/**
 * veo — Google Veo 3 video generation via Vertex AI
 *
 * Usage:
 *   bun run veo.ts "prompt"
 *   bun run veo.ts "prompt" --model veo-3.1 --duration 8 --resolution 1080p
 *   bun run veo.ts "prompt" --aspect 9:16 --no-audio --download
 *   bun run veo.ts "prompt" --model veo-3.1 --image /path/to/ref.jpg --image /path/to/ref2.png
 */

import { execSync } from "child_process";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname, extname } from "path";

// --- Config ---

interface Config {
  project_id: string;
  location: string;
  storage_bucket: string;
}

function loadConfig(): Config {
  const configPath = resolve(dirname(process.argv[1]!), "config.json");
  if (!existsSync(configPath)) {
    console.error(`Config not found: ${configPath}`);
    console.error("Copy config.example.json to config.json and set your project_id.");
    process.exit(1);
  }
  return JSON.parse(readFileSync(configPath, "utf-8"));
}

function getAccessToken(): string {
  return execSync("gcloud auth print-access-token", { encoding: "utf-8" }).trim();
}

// --- Model mapping ---

const MODEL_MAP: Record<string, string> = {
  "veo-3": "veo-3.0-generate-preview",
  "veo-3-fast": "veo-3.0-fast-generate-preview",
  "veo-3.1": "veo-3.1-generate-preview",
  "veo-3.1-fast": "veo-3.1-fast-generate-preview",
};

// --- API ---

const config = loadConfig();
const BASE = `https://${config.location}-aiplatform.googleapis.com/v1`;
const PROJECT_PATH = `projects/${config.project_id}/locations/${config.location}`;

async function api(method: string, url: string, body?: unknown): Promise<unknown> {
  const token = getAccessToken();

  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`API error ${res.status}: ${err}`);
    process.exit(1);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : {};
}

// --- Generate video ---

interface GenerateOptions {
  prompt: string;
  model: string;
  duration: number;
  resolution: string;
  aspect: string;
  audio: boolean;
  count: number;
  negative?: string;
  seed?: number;
  download: boolean;
  images: string[];
}

function loadImage(filePath: string): { bytesBase64Encoded: string; mimeType: string } {
  const absPath = resolve(filePath);
  if (!existsSync(absPath)) {
    console.error(`Image not found: ${absPath}`);
    process.exit(1);
  }

  const ext = extname(absPath).toLowerCase();
  const mimeMap: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
  };

  const mimeType = mimeMap[ext] ?? "image/jpeg";
  const bytesBase64Encoded = readFileSync(absPath).toString("base64");

  return { bytesBase64Encoded, mimeType };
}

async function generateVideo(opts: GenerateOptions): Promise<void> {
  const modelId = MODEL_MAP[opts.model];
  if (!modelId) {
    console.error(`Unknown model: ${opts.model}`);
    console.error(`Available: ${Object.keys(MODEL_MAP).join(", ")}`);
    process.exit(1);
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const storageUri = `gs://${config.storage_bucket}/${timestamp}/`;

  const parameters: Record<string, unknown> = {
    aspectRatio: opts.aspect,
    durationSeconds: opts.duration,
    generateAudio: opts.audio,
    sampleCount: opts.count,
    storageUri,
  };

  if (opts.resolution !== "720p") {
    parameters.resolution = opts.resolution;
  }

  if (opts.negative) {
    parameters.negativePrompt = opts.negative;
  }

  if (opts.seed !== undefined) {
    parameters.seed = opts.seed;
  }

  // Build instance with optional reference images
  const instance: Record<string, unknown> = { prompt: opts.prompt };

  if (opts.images.length > 0) {
    if (!opts.model.includes("3.1")) {
      console.error("Reference images require Veo 3.1. Use --model veo-3.1 or veo-3.1-fast");
      process.exit(1);
    }
    if (opts.images.length > 3) {
      console.error("Maximum 3 reference images allowed.");
      process.exit(1);
    }

    instance.referenceImages = opts.images.map((imgPath) => {
      const img = loadImage(imgPath);
      return {
        image: {
          bytesBase64Encoded: img.bytesBase64Encoded,
          mimeType: img.mimeType,
        },
        referenceType: "asset",
      };
    });
  }

  const url = `${BASE}/${PROJECT_PATH}/publishers/google/models/${modelId}:predictLongRunning`;

  console.log(`Generating video...`);
  console.log(`  Model: ${opts.model} (${modelId})`);
  console.log(`  Duration: ${opts.duration}s`);
  console.log(`  Resolution: ${opts.resolution}`);
  console.log(`  Aspect: ${opts.aspect}`);
  console.log(`  Audio: ${opts.audio}`);
  if (opts.images.length > 0) {
    console.log(`  Reference images: ${opts.images.length}`);
  }
  console.log(`  Output: ${storageUri}`);
  console.log();

  const result = await api("POST", url, {
    instances: [instance],
    parameters,
  });

  const op = result as { name?: string };
  if (!op.name) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  console.log(`Operation: ${op.name}`);
  console.log();

  // Poll for completion
  const pollUrl = `${BASE}/${PROJECT_PATH}/publishers/google/models/${modelId}:fetchPredictOperation`;
  const maxAttempts = 120;
  const intervalMs = 10000;

  for (let i = 0; i < maxAttempts; i++) {
    const poll = (await api("POST", pollUrl, {
      operationName: op.name,
    })) as {
      done?: boolean;
      response?: {
        predictions?: Array<{
          bytesBase64Encoded?: string;
          gcsUri?: string;
          mimeType?: string;
        }>;
      };
      error?: { message: string; code: number };
    };

    if (poll.done) {
      if (poll.error) {
        console.error(`Generation failed: ${poll.error.message}`);
        process.exit(1);
      }

      // API returns videos in response.videos[] or response.predictions[]
      const response = poll.response ?? {};
      const videos: Array<{ gcsUri?: string; bytesBase64Encoded?: string; mimeType?: string }> =
        (response as any).videos ?? (response as any).predictions ?? [];
      console.log(`Generated ${videos.length} video(s):`);

      for (let j = 0; j < videos.length; j++) {
        const video = videos[j]!;
        const gcsUri = video.gcsUri ?? `${storageUri}video_${j}.mp4`;
        console.log(`  [${j + 1}] ${gcsUri}`);

        if (opts.download) {
          const localName = `veo_${timestamp}_${j}.mp4`;

          if (video.bytesBase64Encoded) {
            const bytes = Buffer.from(video.bytesBase64Encoded, "base64");
            writeFileSync(localName, bytes);
            console.log(`  Downloaded: ${localName} (${(bytes.length / 1024 / 1024).toFixed(1)} MB)`);
          } else if (video.gcsUri) {
            try {
              execSync(`gsutil cp "${video.gcsUri}" "${localName}"`, { stdio: "inherit" });
              console.log(`  Downloaded: ${localName}`);
            } catch {
              console.error(`  Failed to download from GCS. Run manually: gsutil cp "${video.gcsUri}" .`);
            }
          }
        }
      }

      if (!opts.download && videos.some((v) => v.gcsUri)) {
        console.log();
        console.log(`To download: gsutil cp "${storageUri}*" .`);
      }

      return;
    }

    process.stderr.write(`Waiting for video generation (${i + 1}/${maxAttempts})...\r`);
    await new Promise((r) => setTimeout(r, intervalMs));
  }

  console.error(`\nTimed out waiting for generation. Check GCS: ${storageUri}`);
  console.error(`Or poll manually with operation: ${op.name}`);
  process.exit(1);
}

// --- CLI ---

function usage(): never {
  console.log(`Usage: bun run veo.ts "prompt" [options]

Options:
  --model <name>       veo-3, veo-3-fast, veo-3.1, veo-3.1-fast (default: veo-3)
  --duration <sec>     4, 6, or 8 (default: 8)
  --resolution <res>   720p, 1080p, 4k (default: 720p)
  --aspect <ratio>     16:9 or 9:16 (default: 16:9)
  --no-audio           Disable audio generation
  --count <n>          Number of variants, 1-4 (default: 1)
  --negative "text"    What to exclude from the video
  --seed <number>      Seed for reproducible output
  --download           Download MP4 to current directory
  --image <path>       Reference image (up to 3, requires veo-3.1)

Examples:
  veo.ts "A cinematic aerial shot of a Norwegian fjord at sunset"
  veo.ts "Coffee being poured in slow motion" --resolution 1080p --duration 4
  veo.ts "A person walking in rain" --aspect 9:16 --model veo-3.1-fast
  veo.ts "A woman walking through a garden" --model veo-3.1 --image ref.jpg`);
  process.exit(1);
}

function main(): void {
  const args = process.argv.slice(2);

  if (args.length === 0) usage();

  let prompt = "";
  let model = "veo-3";
  let duration = 8;
  let resolution = "720p";
  let aspect = "16:9";
  let audio = true;
  let count = 1;
  let negative: string | undefined;
  let seed: number | undefined;
  let download = false;
  const images: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]!;

    switch (arg) {
      case "--model":
        model = args[++i]!;
        break;
      case "--duration":
        duration = parseInt(args[++i]!, 10);
        break;
      case "--resolution":
        resolution = args[++i]!;
        break;
      case "--aspect":
        aspect = args[++i]!;
        break;
      case "--no-audio":
        audio = false;
        break;
      case "--count":
        count = parseInt(args[++i]!, 10);
        break;
      case "--negative":
        negative = args[++i]!;
        break;
      case "--seed":
        seed = parseInt(args[++i]!, 10);
        break;
      case "--download":
        download = true;
        break;
      case "--image":
        images.push(args[++i]!);
        break;
      case "--help":
        usage();
        break;
      default:
        if (!arg.startsWith("--") && !prompt) {
          prompt = arg;
        }
        break;
    }
  }

  if (!prompt) {
    console.error("Error: prompt is required");
    usage();
  }

  generateVideo({
    prompt,
    model,
    duration,
    resolution,
    aspect,
    audio,
    count,
    negative,
    seed,
    download,
    images,
  });
}

main();

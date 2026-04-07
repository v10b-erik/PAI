/**
 * notebooklm — Google NotebookLM Enterprise API client
 *
 * Usage:
 *   bun run notebooklm.ts <command> [options]
 *
 * Commands:
 *   create --title "Name"
 *   get <notebook-id>
 *   list
 *   delete <notebook-id>
 *   share <notebook-id> --email user@example.com [--role READER|WRITER|OWNER]
 *   add-sources <notebook-id> --url "..." --text "..." --youtube "..." --drive "..."
 *   upload <notebook-id> --file /path/to/file
 *   get-source <notebook-id> <source-id>
 *   delete-source <notebook-id> <source-id>
 *   audio <notebook-id> [--focus "topic"] [--lang "en"]
 *   delete-audio <notebook-id>
 *   podcast --text "..." [--focus "topic"] [--lang "en"] [--length SHORT|STANDARD]
 */

import { execSync } from "child_process";
import { readFileSync, existsSync } from "fs";
import { basename, resolve, dirname } from "path";

// --- Config ---

interface Config {
  project_number: string;
  location: string;
}

function loadConfig(): Config {
  const configPath = resolve(dirname(process.argv[1]!), "config.json");
  if (!existsSync(configPath)) {
    console.error(`Config not found: ${configPath}`);
    console.error("Copy config.example.json to config.json and set your project_number.");
    process.exit(1);
  }
  return JSON.parse(readFileSync(configPath, "utf-8"));
}

function getAccessToken(): string {
  return execSync("gcloud auth print-access-token", { encoding: "utf-8" }).trim();
}

// --- API helpers ---

const config = loadConfig();
const BASE = `https://${config.location}-discoveryengine.googleapis.com/v1alpha`;
const UPLOAD_BASE = `https://${config.location}-discoveryengine.googleapis.com/upload/v1alpha`;
const PROJECT_PATH = `projects/${config.project_number}/locations/${config.location}`;

async function api(
  method: string,
  path: string,
  body?: unknown,
  extraHeaders?: Record<string, string>
): Promise<unknown> {
  const token = getAccessToken();
  const url = path.startsWith("https://") ? path : `${BASE}/${path}`;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    ...extraHeaders,
  };

  const res = await fetch(url, {
    method,
    headers,
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

async function apiUpload(
  path: string,
  fileBytes: Uint8Array,
  mimeType: string,
  fileName: string
): Promise<unknown> {
  const token = getAccessToken();
  const url = `${UPLOAD_BASE}/${path}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": mimeType,
      "X-Goog-Upload-File-Name": fileName,
      "X-Goog-Upload-Protocol": "raw",
    },
    body: fileBytes,
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`Upload error ${res.status}: ${err}`);
    process.exit(1);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : {};
}

// --- Polling for long-running operations ---

async function pollOperation(operationName: string, label: string): Promise<unknown> {
  const maxAttempts = 60;
  const intervalMs = 5000;

  for (let i = 0; i < maxAttempts; i++) {
    const op = (await api("GET", operationName)) as {
      done?: boolean;
      response?: unknown;
      error?: { message: string };
    };

    if (op.done) {
      if (op.error) {
        console.error(`${label} failed: ${op.error.message}`);
        process.exit(1);
      }
      return op.response;
    }

    process.stderr.write(`${label}: polling (${i + 1}/${maxAttempts})...\n`);
    await new Promise((r) => setTimeout(r, intervalMs));
  }

  console.error(`${label}: timed out after ${maxAttempts} attempts`);
  process.exit(1);
}

// --- Notebook resource path helpers ---

function notebookPath(notebookId: string): string {
  if (notebookId.includes("/")) return notebookId;
  return `${PROJECT_PATH}/notebooks/${notebookId}`;
}

function sourcePath(notebookId: string, sourceId: string): string {
  return `${notebookPath(notebookId)}/sources/${sourceId}`;
}

// --- Commands ---

async function createNotebook(title: string): Promise<void> {
  const result = await api("POST", `${PROJECT_PATH}/notebooks`, {
    title,
  });
  console.log(JSON.stringify(result, null, 2));
}

async function getNotebook(notebookId: string): Promise<void> {
  const result = await api("GET", notebookPath(notebookId));
  console.log(JSON.stringify(result, null, 2));
}

async function listNotebooks(): Promise<void> {
  const result = await api("GET", `${PROJECT_PATH}/notebooks:listRecentlyViewed`);
  console.log(JSON.stringify(result, null, 2));
}

async function deleteNotebook(notebookId: string): Promise<void> {
  const fullName = notebookPath(notebookId);
  await api("POST", `${PROJECT_PATH}/notebooks:batchDelete`, {
    names: [fullName],
  });
  console.log(`Deleted notebook: ${notebookId}`);
}

async function shareNotebook(notebookId: string, email: string, role: string): Promise<void> {
  const result = await api("POST", `${notebookPath(notebookId)}:share`, {
    accountAndRoles: [{ email, role: `PROJECT_ROLE_${role}` }],
  });
  console.log(JSON.stringify(result, null, 2));
}

// --- Source management ---

interface SourceSpec {
  urls: string[];
  texts: string[];
  youtubes: string[];
  drives: string[];
}

function buildUserContents(specs: SourceSpec): unknown[] {
  const contents: unknown[] = [];

  for (const url of specs.urls) {
    contents.push({
      webContent: { url, sourceName: url },
    });
  }

  for (const text of specs.texts) {
    contents.push({
      textContent: { content: text, sourceName: text.slice(0, 50) },
    });
  }

  for (const yt of specs.youtubes) {
    contents.push({
      videoContent: { url: yt },
    });
  }

  for (const drive of specs.drives) {
    contents.push({
      googleDriveContent: {
        documentId: drive,
        mimeType: "application/vnd.google-apps.document",
        sourceName: drive,
      },
    });
  }

  return contents;
}

async function addSources(notebookId: string, specs: SourceSpec): Promise<void> {
  const userContents = buildUserContents(specs);
  if (userContents.length === 0) {
    console.error("No sources specified. Use --url, --text, --youtube, or --drive.");
    process.exit(1);
  }

  const result = await api(
    "POST",
    `${notebookPath(notebookId)}/sources:batchCreate`,
    { userContents }
  );

  const op = result as { name?: string };
  if (op.name) {
    const response = await pollOperation(op.name, "Adding sources");
    console.log(JSON.stringify(response, null, 2));
  } else {
    console.log(JSON.stringify(result, null, 2));
  }
}

async function uploadSource(notebookId: string, filePath: string): Promise<void> {
  const absPath = resolve(filePath);
  if (!existsSync(absPath)) {
    console.error(`File not found: ${absPath}`);
    process.exit(1);
  }

  const ext = absPath.split(".").pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    pdf: "application/pdf",
    txt: "text/plain",
    md: "text/markdown",
    html: "text/html",
    htm: "text/html",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    mp3: "audio/mpeg",
    wav: "audio/wav",
    ogg: "audio/ogg",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
  };

  const mimeType = mimeTypes[ext ?? ""] ?? "application/octet-stream";
  const fileBytes = new Uint8Array(readFileSync(absPath));
  const fileName = basename(absPath);

  const result = await apiUpload(
    `${notebookPath(notebookId)}/sources:uploadFile`,
    fileBytes,
    mimeType,
    fileName
  );

  const op = result as { name?: string };
  if (op.name) {
    const response = await pollOperation(op.name, "Uploading source");
    console.log(JSON.stringify(response, null, 2));
  } else {
    console.log(JSON.stringify(result, null, 2));
  }
}

async function getSource(notebookId: string, sourceId: string): Promise<void> {
  const result = await api("GET", sourcePath(notebookId, sourceId));
  console.log(JSON.stringify(result, null, 2));
}

async function deleteSource(notebookId: string, sourceId: string): Promise<void> {
  const fullName = sourcePath(notebookId, sourceId);
  await api("POST", `${notebookPath(notebookId)}/sources:batchDelete`, {
    names: [fullName],
  });
  console.log(`Deleted source: ${sourceId}`);
}

// --- Audio ---

async function createAudioOverview(
  notebookId: string,
  focus?: string,
  lang?: string
): Promise<void> {
  const body: Record<string, unknown> = {};
  if (focus) body.episodeFocus = focus;
  if (lang) body.languageCode = lang;

  const result = await api(
    "POST",
    `${notebookPath(notebookId)}/audioOverviews`,
    body
  );

  const op = result as { name?: string };
  if (op.name) {
    const response = await pollOperation(op.name, "Generating audio overview");
    console.log(JSON.stringify(response, null, 2));
  } else {
    console.log(JSON.stringify(result, null, 2));
  }
}

async function deleteAudioOverview(notebookId: string): Promise<void> {
  await api("DELETE", `${notebookPath(notebookId)}/audioOverviews/default`);
  console.log(`Deleted audio overview for notebook: ${notebookId}`);
}

// --- Standalone Podcast (v1 API) ---

async function generatePodcast(
  specs: SourceSpec,
  focus?: string,
  lang?: string,
  length?: string
): Promise<void> {
  const contexts: unknown[] = [];

  for (const text of specs.texts) {
    contexts.push({ text });
  }

  // For URLs/YouTube, fetch and include as text contexts
  for (const url of specs.urls) {
    contexts.push({ text: `Source URL: ${url}` });
  }

  for (const yt of specs.youtubes) {
    contexts.push({ text: `YouTube source: ${yt}` });
  }

  if (contexts.length === 0) {
    console.error("No sources specified. Use --text, --url, or --youtube.");
    process.exit(1);
  }

  const body: Record<string, unknown> = { contexts };
  const podcastConfig: Record<string, string> = {};
  if (focus) podcastConfig.focus = focus;
  if (lang) podcastConfig.languageCode = lang;
  if (length) podcastConfig.length = length;
  if (Object.keys(podcastConfig).length > 0) body.podcastConfig = podcastConfig;

  const podcastUrl = `https://discoveryengine.googleapis.com/v1/projects/${config.project_number}/locations/global/podcasts`;

  const result = await api("POST", podcastUrl, body);

  const op = result as { name?: string };
  if (op.name) {
    const response = await pollOperation(op.name, "Generating podcast");
    console.log(JSON.stringify(response, null, 2));

    // Download MP3
    const downloadUrl = `https://discoveryengine.googleapis.com/v1/${op.name}:download?alt=media`;
    process.stderr.write(`Download MP3: ${downloadUrl}\n`);
  } else {
    console.log(JSON.stringify(result, null, 2));
  }
}

// --- CLI ---

function collectMultiArg(args: string[], flag: string): string[] {
  const values: string[] = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === flag && args[i + 1]) {
      values.push(args[i + 1]!);
      i++;
    }
  }
  return values;
}

function getArg(args: string[], flag: string): string | undefined {
  const idx = args.indexOf(flag);
  return idx >= 0 && args[idx + 1] ? args[idx + 1] : undefined;
}

function usage(): never {
  console.log(`Usage: bun run notebooklm.ts <command> [options]

Commands:
  create --title "Name"                                 Create a notebook
  get <notebook-id>                                     Get notebook details
  list                                                  List recently viewed notebooks
  delete <notebook-id>                                  Delete a notebook
  share <id> --email user@example.com [--role READER]   Share a notebook
  add-sources <id> --url/--text/--youtube/--drive        Add sources to notebook
  upload <notebook-id> --file /path/to/file             Upload a file as source
  get-source <notebook-id> <source-id>                  Get source details
  delete-source <notebook-id> <source-id>               Delete a source
  audio <id> [--focus "topic"] [--lang "en"]            Generate audio overview
  delete-audio <notebook-id>                            Delete audio overview
  podcast --text "..." [--focus "..."] [--length SHORT] Generate standalone podcast`);
  process.exit(1);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command) usage();

  switch (command) {
    case "create": {
      const title = getArg(args, "--title");
      if (!title) {
        console.error('Usage: create --title "Notebook Title"');
        process.exit(1);
      }
      await createNotebook(title);
      break;
    }

    case "get": {
      const id = args[1];
      if (!id) {
        console.error("Usage: get <notebook-id>");
        process.exit(1);
      }
      await getNotebook(id);
      break;
    }

    case "list":
      await listNotebooks();
      break;

    case "delete": {
      const id = args[1];
      if (!id) {
        console.error("Usage: delete <notebook-id>");
        process.exit(1);
      }
      await deleteNotebook(id);
      break;
    }

    case "share": {
      const id = args[1];
      const email = getArg(args, "--email");
      const role = getArg(args, "--role") ?? "READER";
      if (!id || !email) {
        console.error("Usage: share <notebook-id> --email user@example.com [--role READER]");
        process.exit(1);
      }
      await shareNotebook(id, email, role.toUpperCase());
      break;
    }

    case "add-sources": {
      const id = args[1];
      if (!id) {
        console.error("Usage: add-sources <notebook-id> --url/--text/--youtube/--drive ...");
        process.exit(1);
      }
      await addSources(id, {
        urls: collectMultiArg(args, "--url"),
        texts: collectMultiArg(args, "--text"),
        youtubes: collectMultiArg(args, "--youtube"),
        drives: collectMultiArg(args, "--drive"),
      });
      break;
    }

    case "upload": {
      const id = args[1];
      const file = getArg(args, "--file");
      if (!id || !file) {
        console.error("Usage: upload <notebook-id> --file /path/to/file");
        process.exit(1);
      }
      await uploadSource(id, file);
      break;
    }

    case "get-source": {
      const notebookId = args[1];
      const sourceId = args[2];
      if (!notebookId || !sourceId) {
        console.error("Usage: get-source <notebook-id> <source-id>");
        process.exit(1);
      }
      await getSource(notebookId, sourceId);
      break;
    }

    case "delete-source": {
      const notebookId = args[1];
      const sourceId = args[2];
      if (!notebookId || !sourceId) {
        console.error("Usage: delete-source <notebook-id> <source-id>");
        process.exit(1);
      }
      await deleteSource(notebookId, sourceId);
      break;
    }

    case "audio": {
      const id = args[1];
      if (!id) {
        console.error("Usage: audio <notebook-id>");
        process.exit(1);
      }
      const focus = getArg(args, "--focus");
      const lang = getArg(args, "--lang");
      await createAudioOverview(id, focus, lang);
      break;
    }

    case "delete-audio": {
      const id = args[1];
      if (!id) {
        console.error("Usage: delete-audio <notebook-id>");
        process.exit(1);
      }
      await deleteAudioOverview(id);
      break;
    }

    case "podcast":
      await generatePodcast(
        {
          urls: collectMultiArg(args, "--url"),
          texts: collectMultiArg(args, "--text"),
          youtubes: collectMultiArg(args, "--youtube"),
          drives: [],
        },
        getArg(args, "--focus"),
        getArg(args, "--lang"),
        getArg(args, "--length")
      );
      break;

    default:
      console.error(`Unknown command: ${command}`);
      usage();
  }
}

main();

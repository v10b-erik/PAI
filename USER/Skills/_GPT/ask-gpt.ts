/**
 * ask-gpt — Query GPT-5.2 via Azure OpenAI
 *
 * Usage:
 *   bun run ask-gpt.ts "prompt"
 *   bun run ask-gpt.ts "prompt" --system "system prompt"
 */

import { execSync } from "child_process";

const ENDPOINT = "https://swedencentral.api.cognitive.microsoft.com";
const DEPLOYMENT = "gpt-5.2-chat";
const API_VERSION = "2024-10-21";
const API_KEY = execSync('op read "op://Development/Azure OpenAI/key"', { encoding: "utf-8" }).trim();

function parseArgs(argv: string[]): { prompt: string; system?: string } {
  const args = argv.slice(2);
  let prompt = "";
  let system: string | undefined;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--system" && args[i + 1]) {
      system = args[i + 1];
      i++;
    } else if (!prompt) {
      prompt = args[i]!;
    }
  }

  return { prompt, system };
}

async function main() {
  const { prompt, system } = parseArgs(process.argv);

  if (!prompt) {
    console.error("Usage: bun run ask-gpt.ts <prompt> [--system <system_prompt>]");
    process.exit(1);
  }

  const messages: { role: string; content: string }[] = [];
  if (system) {
    messages.push({ role: "system", content: system });
  }
  messages.push({ role: "user", content: prompt });

  const url = `${ENDPOINT}/openai/deployments/${DEPLOYMENT}/chat/completions?api-version=${API_VERSION}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "api-key": API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages,
      max_completion_tokens: 4096,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`Error ${res.status}: ${err}`);
    process.exit(1);
  }

  const data = await res.json();
  const reply = data.choices?.[0]?.message?.content;

  if (reply) {
    console.log(reply);
  } else {
    console.error("No response from GPT");
    console.error(JSON.stringify(data, null, 2));
    process.exit(1);
  }
}

main();

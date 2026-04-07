#!/usr/bin/env bun
/**
 * Share.ts - Share data with contacts via Resend (email) and n8n (other channels)
 *
 * Usage:
 *   bun Share.ts --to "Alice,Bob" --message "Hello!" --channels "email,slack"
 *   bun Share.ts --to "Alice" --message "Meeting at 3pm" --channels "sms"
 *   bun Share.ts --to "Team" --message "Deploy done" --channels "slack"
 *
 * Options:
 *   --to        Comma-separated contact names (required)
 *   --message   Message content (required)
 *   --channels  Comma-separated channels: email, sms, slack (default: email)
 *   --subject   Email subject (optional, defaults to "Message from PAI")
 */

import { parseArgs } from "util";
import { readFile } from "fs/promises";
import { join, dirname } from "path";
import { $ } from "bun";
import * as readline from "readline";

// Get PAI_DIR with tilde expansion
function getPaiDir(): string {
  const paiDir = process.env.PAI_DIR || "~/.Basic";
  return paiDir.replace(/^~/, process.env.HOME || "");
}

interface Contact {
  name: string;
  email?: string;
  phone?: string;
  slack?: string;
  role?: string;
}

interface Config {
  webhookUrl: string;
  defaultChannels: string[];
  sender: {
    name: string;
    email: string;
  };
  resend?: {
    fromEmail: string;
    fromName: string;
  };
}

async function getResendApiKey(): Promise<string> {
  try {
    const result = await $`op item get "Resend" --vault Development --fields label=homelab_apikey --reveal`.text();
    return result.trim();
  } catch {
    throw new Error("Could not get Resend API key from 1Password");
  }
}

async function sendViaResend(
  contact: Contact,
  message: string,
  subject: string,
  config: Config
): Promise<boolean> {
  if (!contact.email) {
    console.error(`  No email for ${contact.name}, skipping`);
    return false;
  }

  const apiKey = await getResendApiKey();
  // Use test domain while custom domain verifies, then switch to pai@fillipsveen.no
  const fromEmail = config.resend?.fromEmail || "onboarding@resend.dev";
  const fromName = config.resend?.fromName || "PAI";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `${fromName} <${fromEmail}>`,
      to: contact.email,
      subject: subject,
      text: message,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`  Failed to send to ${contact.email}: ${error}`);
    return false;
  }

  const result = await response.json();
  console.log(`  Email sent to ${contact.email} (id: ${result.id})`);
  return true;
}

interface SharePayload {
  contacts: Contact[];
  channels: string[];
  message: string;
  subject?: string;
  metadata: {
    sender: string;
    senderEmail: string;
    timestamp: string;
    source: string;
  };
}

const args = parseArgs({
  options: {
    to: { type: "string", short: "t" },
    message: { type: "string", short: "m" },
    channels: { type: "string", short: "c" },
    subject: { type: "string", short: "s" },
    yes: { type: "boolean", short: "y" },
    help: { type: "boolean", short: "h" },
  },
  allowPositionals: true,
});

async function confirm(prompt: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === "y" || answer.toLowerCase() === "yes");
    });
  });
}

async function loadConfig(): Promise<Config> {
  const configPath = join(dirname(process.argv[1]!), "..", "config.json");
  try {
    const content = await readFile(configPath, "utf-8");
    return JSON.parse(content);
  } catch {
    console.error(`Error: Could not load config from ${configPath}`);
    console.error("Create config.json with your n8n webhook URL.");
    process.exit(1);
  }
}

async function loadContacts(): Promise<string> {
  const contactsPath = join(dirname(process.argv[1]!), "..", "..", "CONTACTS.md");
  try {
    return await readFile(contactsPath, "utf-8");
  } catch {
    console.error(`Warning: Could not load contacts from ${contactsPath}`);
    return "";
  }
}

function parseContacts(contactsContent: string, names: string[]): Contact[] {
  const contacts: Contact[] = [];
  const lines = contactsContent.split("\n");

  for (const name of names) {
    const searchName = name.trim().toLowerCase();
    let found: Contact | null = null;

    for (const line of lines) {
      const lineLower = line.toLowerCase();

      // Match patterns like "**Name**" or "| Name |"
      if (lineLower.includes(searchName)) {
        const contact: Contact = { name: name.trim() };

        // Extract email (pattern: word@word.word)
        const emailMatch = line.match(/[\w.-]+@[\w.-]+\.\w+/);
        if (emailMatch) contact.email = emailMatch[0];

        // Extract phone (pattern: +number or number with dashes)
        const phoneMatch = line.match(/\+?[\d\s-]{10,}/);
        if (phoneMatch) contact.phone = phoneMatch[0].trim();

        // Extract slack handle (pattern: @word)
        const slackMatch = line.match(/@[\w-]+/);
        if (slackMatch && !slackMatch[0].includes("@") === false) {
          // Avoid matching emails
          if (!slackMatch[0].includes(".")) {
            contact.slack = slackMatch[0];
          }
        }

        // Extract role (pattern: [Role])
        const roleMatch = line.match(/\[([^\]]+)\]/);
        if (roleMatch) contact.role = roleMatch[1];

        found = contact;
        break;
      }
    }

    if (found) {
      contacts.push(found);
    } else {
      // Contact not found - include with just the name
      console.error(`Warning: Contact "${name}" not found in CONTACTS.md`);
      contacts.push({ name: name.trim() });
    }
  }

  return contacts;
}

async function sendToN8n(config: Config, payload: SharePayload): Promise<void> {
  try {
    const response = await fetch(config.webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    console.log(`Sent to n8n webhook (${response.status})`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error sending to n8n: ${error.message}`);
    }
    process.exit(1);
  }
}

async function main() {
  if (args.values.help) {
    console.log(`
Send - Send messages to contacts via email (Resend) and n8n (Slack/SMS)

Usage:
  bun Send.ts --to "Name1,Name2" --message "Content" [--channels "email,slack"] [--subject "Subject"]

Options:
  --to, -t        Comma-separated contact names (required)
  --message, -m   Message content (required)
  --channels, -c  Channels: email, sms, slack (default: from config)
  --subject, -s   Email subject (optional)
  --yes, -y       Skip confirmation prompt
  --help, -h      Show this help

Examples:
  bun Send.ts --to "Alice" --message "Hello!" --channels "email"
  bun Send.ts --to "Alice,Bob" --message "Meeting at 3" --channels "slack,email"
  bun Send.ts --to "Erik" --message "Test" -y  # Skip confirmation
`);
    return;
  }

  if (!args.values.to || !args.values.message) {
    console.error("Error: --to and --message are required");
    console.error("Use --help for usage information");
    process.exit(1);
  }

  const config = await loadConfig();
  const contactsContent = await loadContacts();

  const names = args.values.to.split(",").map((n) => n.trim());
  const channels = args.values.channels
    ? args.values.channels.split(",").map((c) => c.trim().toLowerCase())
    : config.defaultChannels;

  const contacts = parseContacts(contactsContent, names);

  const payload: SharePayload = {
    contacts,
    channels,
    message: args.values.message,
    subject: args.values.subject,
    metadata: {
      sender: config.sender.name,
      senderEmail: config.sender.email,
      timestamp: new Date().toISOString(),
      source: "PAI Send Skill",
    },
  };

  // Show confirmation unless --yes flag is used
  if (!args.values.yes) {
    console.log("\n┌─────────────────────────────────────────────────────────────┐");
    console.log("│                      SEND CONFIRMATION                       │");
    console.log("├─────────────────────────────────────────────────────────────┤");
    console.log(`│ Channels: ${channels.join(", ").padEnd(49)}│`);
    console.log(`│ Subject:  ${(args.values.subject || "Message from PAI").padEnd(49)}│`);
    console.log("├─────────────────────────────────────────────────────────────┤");
    console.log("│ Recipients:                                                  │");
    for (const contact of contacts) {
      const channelInfo: string[] = [];
      if (channels.includes("email") && contact.email) channelInfo.push(contact.email);
      if (channels.includes("sms") && contact.phone) channelInfo.push(contact.phone);
      if (channels.includes("slack") && contact.slack) channelInfo.push(contact.slack);
      const info = channelInfo.length > 0 ? channelInfo.join(", ") : "(no matching contact info)";
      console.log(`│   • ${contact.name}: ${info.substring(0, 52).padEnd(52)}│`);
    }
    console.log("├─────────────────────────────────────────────────────────────┤");
    console.log("│ Message:                                                     │");
    // Wrap message to fit in box
    const msgLines = args.values.message.match(/.{1,57}/g) || [args.values.message];
    for (const line of msgLines.slice(0, 5)) {
      console.log(`│   ${line.padEnd(57)}│`);
    }
    if (msgLines.length > 5) {
      console.log(`│   ... (${msgLines.length - 5} more lines)`.padEnd(62) + "│");
    }
    console.log("└─────────────────────────────────────────────────────────────┘\n");

    const confirmed = await confirm("Send this message? (y/n): ");
    if (!confirmed) {
      console.log("Cancelled.");
      process.exit(0);
    }
    console.log("");
  }

  console.log(`Sending to ${contacts.length} contact(s) via ${channels.join(", ")}...`);

  // Handle email channel directly via Resend
  if (channels.includes("email")) {
    console.log("Sending emails via Resend...");
    for (const contact of contacts) {
      await sendViaResend(
        contact,
        args.values.message,
        args.values.subject || "Message from PAI",
        config
      );
    }
  }

  // Handle other channels via n8n
  const otherChannels = channels.filter((c) => c !== "email");
  if (otherChannels.length > 0) {
    console.log(`Sending to n8n for: ${otherChannels.join(", ")}...`);
    payload.channels = otherChannels;
    await sendToN8n(config, payload);
  }

  console.log("Done");
}

main().catch(console.error);

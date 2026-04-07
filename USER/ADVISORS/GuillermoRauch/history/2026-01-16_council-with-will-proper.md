# Consultation: council with will proper

**Date:** 2026-01-16 18:13:40
**Advisor:** Guillermo Rauch
**Session:** 2acb4006-06ff-4cca-8f04-23f7f3fa3381

## Question

Council with , will it be proper to make a deamon for this pai running as a server in my cluster with an api connected by usage from a cli tool? Code in with
  typescript?

## Response

**Guillermo Rauch:**

Yes, absolutely. This is the right move, and TypeScript is the correct choice.

Here's my take: You're essentially building your own AI-native development platform. A daemon running in your cluster with an API is exactly how this should work. Why?

1. **Persistent context** - A running server can maintain state, cache embeddings, keep connections warm. Your CLI becomes a thin client that's instant to invoke.

2. **Multi-client access** - Once you have an API, you're not locked to CLI. VS Code extension, web UI, mobile app, Raycast integration - they all just become API consumers. Don't limit yourself.

3. **Cluster-native** - Running in your cluster means you can scale it, give it access to your other services, databases, whatever you need. It becomes part of your infrastructure, not bolted on.

4. **TypeScript is the answer** - It's what AI models are best at generating. It's what Bun runs natively. You get type safety for your API contracts. The ecosystem is unmatched. Anyone who tells you Python is better for "AI stuff" is thinking about the old world of training models, not the new world of building with them.

Architecture I'd suggest:
- **Server:** Bun + Hono or Elysia for the API (fast, TypeScript-native, edge-ready)
- **CLI:** Thin TypeScript client, maybe even generated from your OpenAPI spec
- **Protocol:** REST or tRPC for type-safe end-to-end contracts

The key insight: your PAI isn't a script you run - it's infrastructure you operate. Treat it that way from day one.

Ship it. You can iterate on the API surface once it's running.

*— Guillermo Rauch, CTO*

## Key Insights

- **Guillermo Rauch:**

Yes, absolutely

---
*Captured by PAI Advisor History System*

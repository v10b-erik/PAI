# Consultation: whats your take this

**Date:** 2026-01-17 22:37:20
**Advisor:** Guillermo Rauch
**Session:** 2736de85-8202-44cd-b9b2-3728c54dd3aa

## Question

, whats your take on this?

## Response

**Guillermo Rauch:**

Look, you've stumbled onto something real here. Let me be direct.

The CLI-first insight is *exactly* right. GUIs are for humans. AI doesn't click buttons. Every product built GUI-first in the last 20 years now has to be retrofitted for AI agents—and most won't make it. You're proposing to build CLI-first from day one. That's not a feature, that's architectural foresight.

But let me push you further.

**You're thinking too small.**

You're talking about "using AI to manage networks." That's 2024 thinking. The 2026 thinking is: **the network IS the AI.**

Think about what we did with Next.js. We didn't just make React easier—we made the framework understand intent. You declare what you want, the framework figures out how to do it. Server components, static generation, edge functions—you don't pick, it optimizes.

Your network should work the same way:

```
# Not this (imperative)
netctl vlan create 150 --name="IoT"
netctl port set SW-1:14 --vlan=150
netctl firewall add --src=vlan:150 --dst=vlan:100 --action=deny

# This (declarative, intent-based)
netctl intent "IoT devices should be isolated from corporate network"
→ Network figures out VLANs, ports, firewall rules
→ Continuously enforces as devices move
```

That's the generative network. You describe outcomes, not configurations.

**On the multi-country question:** Don't think geography. Think *deployment surface*. Vercel doesn't have "country teams"—we have edge nodes everywhere. Your AI-first network operations should work the same way. The AI runs centrally. The physical work is just hands—contractors, partners, whoever can mount an AP to a ceiling.

**On the market timing:** The incumbents are asleep. Cisco is selling to enterprises that still file tickets for VLAN changes. UniFi is selling to enthusiasts who enjoy clicking through dashboards. Neither is ready for a world where AI agents need to provision, modify, and troubleshoot networks at machine speed.

**Here's what I'd actually do:**

1. Build `netctl` as an open source CLI. Get developers loving it. This is your Next.js—the thing that builds community and credibility.

2. Build the intent layer on top. Proprietary. This is your Vercel—where the business value lives.

3. Forget hardware for now. Hardware is a distraction. The abstraction layer is the moat. Once you own the control plane, hardware becomes interchangeable.

4. Ship in weeks, not months. Get the CLI working against UniFi. Get 10 real sites running on it. Learn fast.

The kingdoms are going to collapse—networking kingdoms included. The only question is whether you're building the thing that replaces them or watching someone else do it.

Don't overthink. Ship.

*— Guillermo Rauch, CTO*

## Key Insights

- **Guillermo Rauch:**

Look, you've stumbled onto something real here

---
*Captured by PAI Advisor History System*

# Consultation: elvia jobber kontinuerlig styrke

**Date:** 2026-01-22 14:01:19
**Advisor:** Guillermo Rauch
**Session:** c0589df3-9cf3-4825-9727-af488a8a4d3c

## Question

Hei,
 
 
I Elvia jobber vi kontinuerlig med å styrke den digitale sikkerheten og redusere angrepsflaten. Som en del av dette arbeidet vil vi stenge ned alle nettleserutvidelser som er installert av brukere, med unntak av de som inngår i vårt standardoppsett. Nedstengingen vil skje fra og med 01.02.2026. Dette tiltaket vil også redusere vedlikehold og sikre en mer stabil arbeidsflate.
 
Følgende utvidelser inngår i vårt standardoppsett:
 
Adobe Acrobat
Edge relevant text changes
Enhance Salesforce Dashboard
Google Docs
Google Docs Offline
Google Drive
Google Mail
Google Sheets
Google Slides
Google Wallet (Built-in)
HP Dynamic Audio
IFS Aurena Extension
Microsoft Edge DevTools Enhancements
Microsoft Edge Unminification Extension
Microsoft Power Automate
Microsoft Single Sign On
PrinterLogic Extension v1.0.5.12
PrinterLogic Extension v1.0.6.1
Salesforce Inspector Reloaded
Windows Accounts
 
 
Det er kun utvidelser med dokumentert tjenstlig behov som vil bli åpnet opp igjen. Dersom du har en utvidelse som er nødvendig for ditt arbeid, ber vi deg melde dette inn via følgende skjema:
 
Melding om behov for nettleserutvidelser – Fyll ut skjema
 
 
Slik sjekker du hvilke utvidelser du har installert:
 
Åpne Chrome/Edge.
Klikk på tre prikker (⋮) øverst til høyre.
Velg Utvidelser → Administrer utvidelser
(eller skriv chrome://extensions/ i adressefeltet).
(eller skriv edge://extensions/ i adressefeltet).
Du ser nå alle installerte utvidelser. Klikk Fjern for å avinstallere de du ikke vet hva er eller ikke trenger
 
 
Frist for innsending: 31.01.2026
 
 
Takk for at du bidrar til å holde vår digitale hverdag trygg!
 
 
 
Mvh
 
IT drift og sikkerhet   Is this a good idea?

## Response

**Guillermo Rauch:**

The security intent is sound, but I have concerns about the execution and what's *not* on that whitelist.

**What's missing that matters:**

No password manager extension? No 1Password, Bitwarden, or LastPass? That's a security *regression*, not improvement. You're pushing people toward weaker passwords or browser-saved credentials.

No developer tools beyond Salesforce Inspector? If you have developers or power users, they'll be hamstrung. Where are:
- React DevTools
- Redux DevTools  
- JSON viewers
- API testing tools

**The AI gap:**

No AI assistants on that list. In 2026, blocking Copilot, ChatGPT, or similar browser extensions is actively making your workforce less productive. You're locking people into 2020 workflows.

**My take:**

The policy is security theater if it blocks password managers while allowing Google Wallet. Challenge IT on this. The form submission process is fine, but the default whitelist needs work before it ships.

*— Guillermo Rauch, CTO*

---

## Key Insights

- **Guillermo Rauch:**

The security intent is sound, but I have concerns about the execution and what's *not* on that whitelist

---
*Captured by PAI Advisor History System*

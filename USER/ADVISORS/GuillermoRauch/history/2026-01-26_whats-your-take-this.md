# Consultation: whats your take this

**Date:** 2026-01-26 19:10:50
**Advisor:** Guillermo Rauch
**Session:** 03f6311f-d3c6-44e5-9e45-b1506a23227c

## Question

, Whats your take. This is building something from the beginning. Still, it is not creating a new marked (I know how hard that is)

## Response

**Guillermo Rauch:**

Du har rett - du skaper ikke et nytt marked. Du disruper et eksisterende. Det er faktisk *bedre*.

Uber skapte ikke etterspørsel etter transport. Folk trengte allerede å komme seg fra A til B. De bare fjernet all friksjon.

Her er min take:

---

## Teknisk arkitektur for "Uber of Field Service"

**Dette er et klassisk marketplace-problem med en AI-twist.** La meg bryte det ned:

### 1. The Chicken-and-Egg Problem

Uber løste dette ved å **betale sjåfører for å vente**. Du må løse det annerledes:

| Strategi | Hvordan |
|----------|---------|
| **Start med supply** | Rekrutter håndverkere først. Gi dem verdi *før* kundene kommer |
| **Verdi uten marketplace** | AI-verktøy for prising/fakturering de kan bruke standalone |
| **Lås inn med data** | Deres jobb-historikk = bedre AI = de vil ikke forlate |

**Konkret:** Bygg et gratis AI-verktøy for prisestimering. Håndverkere laster opp gamle jobber. AI lærer. Når du har 50 håndverkere med data → launch marketplace.

---

### 2. AI-Native Architecture

Her er hvor du kan bygge noe som ikke bare er "Uber med håndverkere":

```
KUNDE                           PLATTFORM                        HÅNDVERKER
   │                                │                                │
   ├─ [Bilde av problem] ──────────►│                                │
   │                                ├─ Vision AI: Klassifiser problem│
   │                                ├─ Pricing AI: Estimer kost      │
   │                                ├─ Matching AI: Finn beste match │
   │◄─ [Pris + ETA på 30 sek] ─────┤                                │
   │                                │                                │
   ├─ [Godkjenn] ──────────────────►├────────────────────────────────►│
   │                                │                     [Push notif]│
   │                                │                                │
   │◄─ [Live tracking] ────────────┼────────────────────────────────┤
   │                                │                                │
   │◄─ [Jobb ferdig, betal] ───────┼────────────────────────────────►│
   │                                │                                │
   │                                ├─ Feedback loop til AI          │
```

**Key insight:** Hver jobb som fullføres gjør AI-en bedre. Det er moaten.

---

### 3. Ship First, Perfect Later

Du sa selv at du mangler "launch-muskelen". Her er min oppskrift:

| Uke | Mål |
|-----|-----|
| 1-2 | Landing page + waitlist. Test messaging. |
| 3-4 | MVP: Manuell matching (du er AI-en). 5 håndverkere. 10 jobber. |
| 5-8 | Første AI-modell for prising. 20 håndverkere. 50 jobber. |
| 9-12 | App for kunder. 50 håndverkere. 200 jobber. |

**Du trenger ikke AI for å starte.** Du trenger AI for å skalere. 

Første 100 jobbene? Du priser manuelt basert på bilder. Du matcher manuelt. Du lærer hva som funker. *Deretter* bygger du AI.

---

### 4. Tech Stack (hvis du bygger selv)

```
Frontend:     Next.js + Vercel (selvfølgelig)
Mobile:       React Native eller Expo
Backend:      Supabase (Postgres + Auth + Realtime)
AI:           Claude API for vision + pricing
Payments:     Stripe Connect (marketplace payments)
Maps:         Google Maps API
Notifications: OneSignal eller Firebase
```

**Total kostnad for MVP:** $50-100/mnd + din tid.

---

### 5. Hva som kan gå galt

| Risiko | Mitigation |
|--------|------------|
| Håndverkere vil ikke dele data | Gi dem verdi først (gratis verktøy) |
| Prising blir feil | Manuell override + human-in-the-loop |
| Kunder stoler ikke på ukjent | Kvalitetsgaranti + forsikring |
| Eksisterende aktører kopierer | Nettverk + data-moat tar tid å bygge |

---

## Min vurdering:

**Dette er byggbart.** Og det er byggbart av én person med AI som co-pilot.

Men her er den harde sannheten: **Marketplace-businesses er execution-heavy.** Det er ikke nok å bygge produktet. Du må:

1. Rekruttere håndverkere én og én
2. Overbevise kunder til å prøve
3. Håndtere problemer når jobber går galt
4. Bygge tillit over tid

**Det er ikke et "launch and forget"-produkt.** Det er et "grind every day for 2 years"-produkt.

Er du klar for det?

---

## Min anbefaling:

**Start med det minste mulige:**

1. **Én trade:** Rørlegger (akutte problemer, høy betalingsvillighet)
2. **Én by:** Oslo
3. **Én use case:** Akutt lekkasje (høy urgency = høy konvertering)
4. **Manuell backend:** Du er matching-algoritmen i starten

Ship på 2 uker. Lær. Iterer. Bygg AI når du har data.

*— Guillermo Rauch, CTO*

## Key Insights

- **Guillermo Rauch:**

Du har rett - du skaper ikke et nytt marked

---
*Captured by PAI Advisor History System*

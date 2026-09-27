# Product Requirements Document
## Personalized Dynamic Tour Planning & Tour Operations Platform
**PS ID 07 — HackCelestial 3.0**

**Version:** 1.0 (Hackathon Draft)
**Prepared for:** Planning handoff to Antigravity (Opus) → build handoff to Gemini
**Status:** Draft for team alignment

---

## 1. Executive Summary

Travelers want tours built around *their* preferences — not a fixed package. Operators need one system to run the operational chaos this creates: vendors, hotels, transport, coordinators, payments, and constant itinerary changes.

We're building a two-sided platform — **Traveler App** and **Operator Console** — connected by a shared itinerary engine, with **GenAI woven through every stage** of the journey: `Discover → Personalize → Plan → Price → Book → Prepare → Operate → Assist → Adapt → Complete → Review`.

The differentiator for judges isn't "we added a chatbot" — it's that the **AI actually does planning and re-planning work** (constraint-aware itinerary generation, conflict detection, and dynamic replanning), not just conversation.

---

## 2. Problem Statement (condensed)

- **Travelers** are boxed into rigid, pre-built packages with no real customization of destinations, stay, transport, activities, or budget.
- **Operators** manually coordinate many moving parts (customers, vendors, hotels, transport, coordinators, payments, groups) with no centralized visibility.
- **Change events** (cancellations, delays, weather, traveler requests) require manual re-coordination across multiple stakeholders — slow and error-prone.

---

## 3. Goals & Non-Goals

### Goals (for hackathon scope)
1. Let a traveler build a custom tour from preferences → get an AI-optimized itinerary → see live pricing → book.
2. Give the operator a single console to see all active tours, vendors, and bookings, with alerts when something breaks.
3. Demonstrate **dynamic adaptation**: simulate a disruption (e.g., hotel unavailable, weather alert) and show the AI detect the conflict, propose ranked alternatives, and let a human approve the change — cascading updates through the itinerary automatically.
4. Show a working (not just mocked) GenAI layer: recommendations, itinerary generation, and conflict/alternative reasoning should call a real LLM with real logic, not hardcoded text.

### Non-Goals (explicitly out of scope for the hackathon build)
- Real payment gateway integration (mock/sandbox only).
- Real vendor/hotel API integrations (use seeded mock inventory data).
- Multi-language support.
- Native mobile apps (responsive web is enough).
- Production-grade auth/security hardening (basic auth is fine).

---

## 4. Users & Personas

| Persona | Who | Core need |
|---|---|---|
| **Traveler (Aditi)** | Independent traveler planning a personalized multi-day trip | Build a trip that matches her interests/budget without wading through fixed packages |
| **Tour Operator Admin (Rohan)** | Runs a small/mid tour operator business | One dashboard to see every active tour, vendor, and problem needing attention |
| **Tour Coordinator (Meera)** | Field-facing staff assigned to a tour group | Needs to know today's plan and get notified instantly if something changes |
| **Vendor/Activity Provider** | Hotel, transport, or activity partner | (Stretch) Confirm/reject bookings, see schedule |

---

## 5. End-to-End Journey Mapped to Features

### 5.1 Discover (Traveler)
- Browse destinations/experiences with rich cards (image, tags, price band, best season).
- **GenAI:** semantic search — "quiet hill stations with trekking, under ₹15k, 4 days" returns relevant destinations even without exact keyword match (embedding-based retrieval over a destination/activity catalog).

### 5.2 Personalize (Traveler)
- Preference intake: destination(s), dates, duration, budget, group size, accommodation tier, transport mode, interests (adventure/culture/food/relaxation/nightlife), pace (relaxed/packed).
- **GenAI:** conversational intake option — a chat interface that extracts structured preferences from free text ("I want a laid-back 5-day trip to Goa with my partner, mid-budget, mostly beaches and food") instead of forcing a long form.

### 5.3 Plan (Traveler + AI)
- **GenAI — Itinerary Generation Engine (core differentiator):**
  - Input: traveler preferences + available inventory (hotels, transport, activities, vendor schedules, pricing) from the operator's data.
  - Output: a day-by-day optimized itinerary respecting constraints — budget ceiling, geographic sequencing (no backtracking across the map), opening hours, travel time between activities, pacing preference.
  - Approach: LLM proposes candidate itinerary structure + a constraint-check/optimization pass (rule-based or lightweight solver) validates feasibility (time windows, budget, capacity) before showing it to the user. This hybrid (LLM + validator) is important to call out to judges — pure LLM output for logistics is unreliable; the validator is what makes it trustworthy.
- Traveler can swap any component (hotel, activity, transport leg) and see alternatives ranked by fit-to-preference and price impact.

### 5.4 Price (Traveler)
- Live cost breakdown by category (stay/transport/activities/misc) as components are swapped.
- Budget bar showing remaining budget vs. selections.

### 5.5 Book (Traveler)
- Review full itinerary + final price → confirm → mock payment → booking confirmation with all vendor bookings marked as pending/confirmed.
- Auto-creates operator-side booking records for every vendor involved.

### 5.6 Prepare (Traveler + Operator)
- Traveler gets a trip-prep checklist (documents, weather-appropriate packing — **GenAI-generated** based on destination + season + activities).
- Operator assigns a coordinator, confirms vendor bookings, generates the operational schedule.

### 5.7 Operate (Operator)
- Operator console: live view of all active tours, today's group locations/status, coordinator assignments, vendor confirmation status.
- Coordinator view: today's schedule for their group(s), contact info, quick "report an issue" action.

### 5.8 Assist (Traveler, during trip)
- **GenAI — In-trip assistant (chat):** traveler can ask "what's next", "find a vegetarian restaurant near here", "can we push today's trek by 2 hours" — assistant answers using live itinerary context and, where it's a change request, routes into the Adapt flow rather than just answering conversationally.

### 5.9 Adapt (Traveler + Operator + AI) — headline demo feature
- Trigger: a disruption event (vendor cancels, weather alert, traveler requests a change).
- **GenAI — Conflict Detection & Replanning:**
  1. System identifies what's affected (this activity/hotel/transport leg + anything downstream that depends on it — timing, connected transport, budget).
  2. LLM + validator generates 2–3 ranked alternative resolutions (e.g., "swap Hotel A for Hotel B: +₹800, same area, available" / "shift Day 3 activities, no cost change").
  3. Traveler or operator picks one → itinerary, price, and operator records update automatically (cascading update, not manual re-entry).
- This is the single most important flow to nail for the demo — it's the direct answer to the hackathon's "dynamic tour management" ask.

### 5.10 Complete (Traveler)
- Trip marked complete, final itinerary archived, expense summary shown.

### 5.11 Review (Traveler)
- Post-trip feedback per activity/vendor + overall trip.
- **GenAI (stretch):** feedback summarized into structured vendor-quality signals feeding back into future recommendation ranking.

---

## 6. Functional Requirements

### 6.1 Traveler App
- FR1: Preference intake (form + conversational mode)
- FR2: Destination/activity discovery & search
- FR3: AI-generated itinerary with editable components
- FR4: Real-time price recalculation
- FR5: Booking flow with confirmation
- FR6: Trip dashboard (itinerary, docs, prep checklist)
- FR7: In-trip assistant chat
- FR8: Change-request flow → Adapt engine
- FR9: Post-trip review submission

### 6.2 Operator Console
- FR10: Dashboard — active tours, alerts, today's operations at a glance
- FR11: Vendor/hotel/transport inventory management (CRUD)
- FR12: Booking management per tour (status per vendor)
- FR13: Coordinator assignment & schedule view
- FR14: Disruption/conflict alert feed with AI-suggested resolutions requiring approval
- FR15: Payment/booking status tracking (mocked)
- FR16: Tour group roster & communication log

### 6.3 Shared / AI Layer
- FR17: Itinerary Generation Service (LLM + constraint validator)
- FR18: Conflict Detection Service (dependency graph over itinerary items)
- FR19: Recommendation/semantic search service
- FR20: Conversational preference extraction
- FR21: In-trip assistant with itinerary-context grounding

---

## 7. Non-Functional Requirements (hackathon-appropriate bar)

- Itinerary generation response: aim for under ~8–10s with a loading state (LLM calls are slow — design UI around this, don't hide it).
- Demo-day resilience: cache/pre-generate a fallback itinerary for the demo destination in case of API flakiness.
- Data: seed a realistic mock inventory (10–15 destinations, hotels, transport options, activities) so the AI has real constraints to reason over — this matters more for demo credibility than UI polish.
- Role-based views: traveler / operator admin / coordinator.

---

## 8. Suggested Architecture

```
┌─────────────────┐        ┌──────────────────┐
│  Traveler Web    │        │  Operator Console │
│  App (React)     │        │  (React)          │
└────────┬─────────┘        └────────┬──────────┘
         │                            │
         └───────────┬────────────────┘
                      │  REST/GraphQL API
              ┌───────▼────────┐
              │   Backend API   │  (Node/Express or FastAPI)
              │  - Auth         │
              │  - Bookings     │
              │  - Inventory    │
              │  - Itinerary    │
              └───────┬────────┘
                      │
     ┌────────────────┼─────────────────────┐
     │                │                     │
┌────▼─────┐   ┌──────▼───────┐    ┌───────▼────────┐
│ Database │   │ AI Services  │    │ Conflict/Dep    │
│ (Postgres│   │ Layer        │    │ Graph Engine    │
│ /Mongo)  │   │ - LLM calls  │    │ (rule-based     │
│          │   │ - Embeddings │    │  validator)     │
│          │   │ - Prompt     │    │                 │
│          │   │   templates  │    │                 │
└──────────┘   └──────────────┘    └─────────────────┘
```

**Notes for the build:**
- Keep the "AI Services Layer" as its own module with clean input/output contracts (JSON in, JSON out) — this is what makes it demo-able and debuggable under time pressure, and it's what you'll iterate on most with Gemini during coding.
- The **validator is not optional** — an LLM alone will produce itineraries with impossible timing or budget overshoot. Even a simple rule-based pass (check time windows, sum costs, check capacity) massively increases perceived reliability to judges.
- Model the itinerary as a **dependency graph** (Day → Slot → Item, with links to the vendor/hotel/transport record and cost) — this is what makes the Adapt flow (cascading updates) tractable instead of ad hoc.

---

## 9. Data Model (core entities)

- **User** (traveler / operator_admin / coordinator / vendor)
- **TourPlan** (preferences, status, dates, budget)
- **ItineraryDay** → **ItineraryItem** (type: stay/transport/activity, linked vendor, time window, cost, dependencies)
- **Vendor** (hotel/transport/activity provider — inventory, availability, pricing)
- **Booking** (per itinerary item, status: pending/confirmed/cancelled)
- **DisruptionEvent** (source, affected items, status: detected/resolved)
- **Review** (per vendor/trip)

---

## 10. GenAI Feature Summary (for the pitch deck's "Innovation" section)

| Feature | What it is | Why it's not just a gimmick |
|---|---|---|
| Conversational preference intake | Free-text → structured trip preferences | Lowers friction vs. long forms |
| Semantic destination/activity search | Embedding-based retrieval | Handles vague, natural queries |
| AI itinerary generation + validator | LLM proposes, rules verify | Solves the actual "personalization vs. feasibility" tension operators face |
| Conflict detection + ranked alternatives | Dependency-graph-aware replanning | Directly answers the "dynamic tour management" ask in the problem statement |
| In-trip assistant | Context-grounded chat during the trip | Ties Assist stage back into the same itinerary data model, not a generic chatbot |

---

## 11. Hackathon Build Plan (time-boxed)

**Phase 1 — Core loop (must-have for any demo):**
Preference intake → AI itinerary generation → itinerary view/edit → mock booking.

**Phase 2 — Operator side (must-have):**
Operator dashboard showing bookings generated from Phase 1 + vendor inventory CRUD.

**Phase 3 — Headline feature (must-have, do not skip):**
Adapt flow — trigger a disruption, show detection + AI-ranked alternatives + cascading update.

**Phase 4 — Polish (if time remains):**
In-trip assistant chat, semantic search, review/feedback loop, prep checklist generation.

*Recommendation: get Phase 3 working end-to-end early with mock/simplified data — it's the single feature most likely to differentiate this submission, and it's also the easiest to run out of time for if left last.*

---

## 12. Execution Instructions for Antigravity (Planning) & Gemini (Coding)

These are directives for whoever/whatever is executing this PRD, not optional suggestions — follow them exactly.

### 12.1 Build strictly phase-by-phase
- Build **only one phase at a time**, in the order given in Section 11 (Phase 1 → 2 → 3 → 4).
- **After completing each phase, stop and check in with the user before starting the next phase.** Do not silently continue.
- Each check-in must include:
  1. A short summary of what was built in this phase and which FR/feature IDs (Section 6) it covers.
  2. Any assumptions or shortcuts taken, and any known gaps.
  3. A **deployment suggestion for that phase's output** (see 12.3) so the user can spin it up and click through it themselves before approving the next phase.
  4. A one-line confirmation ask: "Ready to move to Phase X, or want changes first?"
- If a phase is cut short by time, say so explicitly at check-in rather than presenting partial work as done.

### 12.2 GenAI must be real, every phase
- Every phase that touches a GenAI feature listed in Section 10 must call an actual LLM/embedding API with a real prompt/response — never a hardcoded or fake "AI-looking" output. If a real call isn't feasible yet in that phase, say so explicitly at check-in rather than faking it.
- At each check-in, explicitly confirm which GenAI feature(s) from Section 10 are live and working in that phase's build, and which are still stubbed.
- Phase 3 (Adapt/conflict-resolution) in particular must show the LLM proposal + validator check happening for real — this is the feature judges will scrutinize most.

### 12.3 Deployment suggestion at every check-in
At each phase check-in, recommend a concrete, low-effort way to get that phase's build in front of the user/judges quickly. Prefer options that need no infra setup mid-hackathon:
- Frontend-only or lightweight full-stack phases → a static/serverless host (Vercel/Netlify for frontend, Render/Railway for a small backend + DB) so a shareable link exists within minutes.
- Once the backend + DB exist → a single combined deployment (e.g., Render/Railway with a managed Postgres/Mongo add-on) so operator + traveler apps and the API are all reachable from one link for the live demo.
- Always suggest keeping a "known-good" deployed version pinned/tagged before starting the next phase, so there's a fallback to demo from if a later phase breaks something close to presentation time.

### 12.4 UI must look intentional, not like a hackathon form dump
- Both the Traveler App and Operator Console should look like a designed product, not a bare CRUD UI: consistent type scale, real spacing/rhythm, a coherent color palette (not default browser blues/grays), and clear visual hierarchy between primary actions and secondary info.
- Favor a small number of well-used UI patterns over many inconsistent ones (e.g., one card style reused for destinations/vendors/itinerary items, one consistent way of showing price/status/alerts).
- The itinerary view (Section 5.3) and the Adapt/conflict-resolution screen (Section 5.9) are the two screens judges will look at longest — prioritize visual polish there over less-visible admin screens.
- Motion/loading states matter here specifically because GenAI calls are slow (Section 7) — a well-designed loading state during itinerary generation reads as "thoughtful AI," not "broken app."

---

## 13. Success Metrics for the Demo

- Judges can watch a full loop: build a custom trip → get a real (non-canned) AI itinerary → trigger a disruption live → see the system detect and resolve it with minimal manual work.
- Operator console visibly reflects every traveler-side action in real time (or near-real time) without a manual refresh/re-entry step.

---

## 14. Open Items / Placeholders

- Team Name and Team Leader Name — not yet finalized.
- Final tech stack confirmation (frontend framework, DB choice, LLM provider/model) — to be locked during Antigravity planning session.
- Exact scope cut for Phase 4 depending on remaining time at hackathon.

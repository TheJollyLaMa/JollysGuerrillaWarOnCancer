# Jolly's Guerrilla War on Cancer

An open-source decentralized web application and Wiki shell structured as an interactive "Magic School Bus" educational journey. The project catalogs accessible wellness methods, maps relationships between compounds and protocols, and prepares community research data for transparent publication.

## Mission

- Make community health-longevity research easier to browse and compare.
- Present compounds, methods, and protocols as a guided field trip with approachable educational framing.
- Structure entries with a reusable Pinata/IPFS-friendly JSON schema.
- Leave room for public-ledger publishing of research contributions, grants, and community bounties.

## Application Structure

- `index.html` – main application shell with dashboard, wiki, map, and ledger views.
- `styles.css` – retro "Magic Bus" visual system and accessible layout styles.
- `js/app.js` – lightweight router, state manager, filters, and data bootstrapping.
- `js/wiki.js` – wiki list/detail rendering for JSON-backed entries with markdown-style sections.
- `js/pinataSchema.js` – schema helpers, validation, and Pinata payload formatter.
- `js/fractalMap.js` – SVG relationship map renderer for compounds, tags, and mechanisms.
- `js/ledger.js` – contributor-fund and treasury display stubs with web3-ready event payloads.
- `data/schema/method-schema.json` – Pinata-compatible schema for method entries.
- `data/sulforaphane.json` / `data/mushrooms.json` – starter entry shells for initial focus topics.

## Contribution Guidelines

1. Fork or branch from the repository.
2. Make focused changes that improve content, accessibility, or ledger integrations.
3. Open a Pull Request describing:
   - what research or interface area changed,
   - what sources or reasoning informed the change,
   - any new schema fields or tags being proposed.
4. Keep method data aligned with `data/schema/method-schema.json`.
5. Use PR discussion for transparent review so contribution logs can later be mirrored to a repo-bot reward flow.

## Data Model and Decentralized Publishing

Each method entry is designed to carry a stable set of required fields:

- `title`
- `category`
- `accessibility_score`
- `evidence_tier`
- `associated_tags`
- `mechanism_of_action`
- `contraindications`

The JavaScript schema utilities can validate entries locally and format them into Pinata-friendly payloads for IPFS publication.

## DAO / Ledger Architecture

The current ledger module is a front-end stub for two future integrations:

- **BigNuten contribution flow** – log PRs, track contribution metadata, and prepare reward events for a repo bot.
- **GreenTeaHut#1 treasury flow** – display incoming grants, active allocations, and outgoing community bounties in a transparent public-facing ledger.

Planned ledger event types:

- `contribution.logged`
- `grant.allocated`
- `bounty.paid`

These events are rendered in the UI today as preview payloads so a wallet, smart contract adapter, or webhook worker can be connected later without changing the educational shell.

## Medical Disclaimer

This repository is for educational and research-organizing purposes only. It is **not** medical advice, diagnosis, or treatment guidance. Always consult qualified healthcare professionals before attempting any protocol, supplement, extract, or lifestyle intervention, especially when contraindications, medications, pregnancy, or chronic conditions may be involved.

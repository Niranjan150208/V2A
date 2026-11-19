# VITHAI TO ARUVADAI — Judge Presentation Guide

**Live demo:** https://vithai-to-aruvadai.vercel.app/  
**One-line pitch:** A Tamil-first crop-season workspace that lets a farmer keep field records together and follow a harvest lot through buyer offers, a sale record, and a clearly separated payment ledger.

## Problem and approach

Small farmers often manage crop plans, input costs, harvest details, buyer conversations, and payment follow-up across disconnected channels. V2A demonstrates how those records could be brought into one crop-season journey, with a focus on making the economics of a sale easier to inspect.

The prototype's strongest working slice is intentionally narrow and demonstrable: reset a prepared harvest, publish a local demo listing, compare generated buyer offers, accept one, create a sale record, and track the receivable separately from a locally recorded receipt.

## 60-second pitch

> Farmers make many important decisions across a season, but their plans, costs, harvest details, buyer offers, and payment follow-up are often scattered. VITHAI TO ARUVADAI is a Tamil-first crop-season workspace designed to connect those steps in one place. Our demo focuses on the point where value is most visible: a farmer broadcasts a harvested lot, compares buyer terms, accepts an offer, sees the sale calculation, and tracks pending dues separately from money marked received. The journey is replayable, so judges can inspect each state change. Today this is a front-end prototype using local demo data—not a live marketplace, AI diagnosis service, or bank integration. Our next step is to validate this workflow with farmers and buyers, then add secure shared storage and verified integrations based on that feedback.

## Three-minute live demo

1. Open the live demo URL. The app opens to the dashboard.
2. Select **Reset demo journey** and confirm. This resets demo data in this browser only and prepares a harvested, unsold sample crop.
3. Open **Harvest** and select **Broadcast Lot to Buyers**.
4. Compare the generated sample offers. Explain that these are demo offers, not bids from connected buyers.
5. Accept one offer. Show the generated sale record and its itemized calculation.
6. Open **Payments**. Point out the pending receivable, then select **Simulate Bank Credit**.
7. Explain that this marks a local ledger record as received; it does not initiate or verify a bank transfer.

**If time is short:** skip the optional seed and crop-advice screens; the harvest-to-payment path is the clearest end-to-end demonstration.

## How the implementation supports the judging criteria

| Criterion                          | What to show                                                                        | Evidence and honest boundary                                                                                                                                                                                                |
| ---------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Innovation & Creativity (25%)      | The connected crop-season journey and farmer-facing financial view                  | The product combines records and decision steps into one workflow. The differentiator is workflow integration, not a claim of novel AI or blockchain.                                                                       |
| Technical Implementation (25%)     | Broadcast → offers → accept → sale → payment status                                 | React + TypeScript + Vite app; season records persist in browser `localStorage`; store logic generates listings, offers, sale calculations, and payment milestones. State is local to one browser, not shared across users. |
| Problem Solving (20%)              | Compare terms and track outstanding dues separately                                 | The prototype makes trade terms and gross/net calculations inspectable. Buyer offers and settlement are simulated; the app does not connect farmers to actual buyers or banks.                                              |
| UX & Design (20%)                  | Switch between English/Tamil and follow the dashboard workflow on desktop or mobile | Responsive layouts and language controls support the intended audience. Some translations and module content are not yet complete.                                                                                          |
| Presentation & Documentation (10%) | Use the replay steps and explain what is real today                                 | This guide and the README document setup, demo flow, and integration boundaries. Do not present mock records as verified services.                                                                                          |

## Technical snapshot

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, lucide-react.
- **Navigation:** client-side route/hash state.
- **Persistence:** browser `localStorage` through the app store.
- **Production hosting:** Vercel static deployment.
- **External services:** none currently connected for authentication, weather, market prices, crop diagnosis, buyer matching, government verification, or payments.

## Practical next steps

1. Interview farmers and buyers in one pilot region; validate terminology, trust needs, and the order of the trade workflow.
2. Add a hosted database and authentication with farmer/buyer roles; protect personal and land data with explicit consent and access controls.
3. Replace sample weather/market values with sourced feeds, showing source and timestamp.
4. Connect diagnosis to a validated advisory workflow with expert review; label uncertainty and avoid unsafe treatment instructions.
5. Integrate payments only through an authorized provider, with user confirmation and auditable receipts. Never treat a local demo toggle as proof of bank settlement.
6. Add automated tests for season isolation, duplicate listing prevention, offer acceptance, calculation reconciliation, and payment transitions.

## Judge Q&A

**Is this a live marketplace?**  
No. Buyer profiles and offers are generated demo data; there is no multi-user backend or live buyer connection yet.

**Does the payment button transfer money?**  
No. It updates a local demo ledger only. A real transfer requires a regulated payment partner, consent, and verification.

**What is the technical innovation?**  
The prototype demonstrates one consistent crop-season workflow and separates sale value, pending receivables, and amounts marked received, rather than treating them as one number.

**What would you build next?**  
Validate the offer and settlement workflow with a small regional pilot, then build secure shared data and integrate only verified services that farmers actually need.

## Safety and privacy note

Use sample information only. Do not enter real Aadhaar, patta, bank, phone, or health data. Demo state is stored in the current browser and can be cleared with **Reset demo journey**.

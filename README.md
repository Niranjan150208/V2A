# VITHAI TO ARUVADAI (V2A)

A Tamil Nadu farmer workflow prototype that connects crop planning, field records, harvest quality, buyer offers, sale invoices, and payment tracking.

For the evaluation rubric, short pitch, judge walkthrough, and practical roadmap, see [HACKATHON_PITCH.md](HACKATHON_PITCH.md).

## Run locally

Requirements: Node.js 20.19+ or 22.12+.

1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`
3. Open the local URL printed by Vite.
4. Create a production build: `npm run build`

For camera and microphone access, open the deployed HTTPS URL or `http://localhost`; mobile LAN URLs served over plain HTTP may not be considered secure by the browser. Approve camera/microphone access when prompted. QR scanning uses the camera and a local QR decoder; browser speech recognition requires browser support and may require internet access.

## Demo access and media

- Demo farmer: **VIJAY**
- Demo phone: `9000000421`
- Demo OTP: `4210` (local UI demo only; no SMS or real authentication)
- Crop and soil images are compressed and stored with the local browser demo record. They are not uploaded to a server or sent to an AI model.
- Soil pH/N/P/K values must be entered from a test kit or laboratory result; a photo cannot measure soil chemistry.

## Hackathon demo walkthrough

The app stores its demo data in this browser's `localStorage`. To replay the trade journey:

1. On the dashboard, select **Reset demo journey** and confirm. This resets this browser's demo edits and prepares a harvested but unsold lot.
2. Open **Harvest** and choose **Broadcast Lot to Buyers**.
3. Review generated demo buyer offers and accept one.
4. Review the created sale invoice and open **Payments**.
5. Choose **Simulate Bank Credit** to record a demo settlement and see the receivable update.

The trade walkthrough is replayable, persists across reloads in the same browser, prevents duplicate active listings and duplicate sales, and calculates sale proceeds and pending receivables from the selected season's records.

## Current integration boundary

This is a front-end hackathon prototype. Farmer, buyer, weather, crop-diagnosis, offer, and payment data are demo/simulated data. Records are stored per browser; they are not shared between users or devices. The payment action only updates the local demo ledger and does not initiate a bank transfer. Login does not provide production authentication. No government, bank, weather, or AI service is connected.

For a multi-user public product, connect a hosted backend (for example Supabase or Firebase), configure real authentication and role-based access, and integrate verified external data/services. Do not enter real identity, land, bank, or health information into this demo.

## Technology

React, TypeScript, Vite, Tailwind CSS, and lucide-react.

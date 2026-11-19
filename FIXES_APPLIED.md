# V2A targeted QA fixes

This patch set is based on the supplied `V2A-main.zip` source snapshot.

## Changes
- Labour booking now creates a persisted `LabourBooking` record as well as the season expense.
- Machinery booking now creates a persisted booking record and the Machinery page displays active-season booking history.
- Onboarding's Save Progress action stores the current step and form values in browser local storage; the page restores that draft for the same signed-in demo user and clears it after successful registration.
- Irrigation records now retain the first farm parcel's identifier and display name/survey number, and the history displays that field context.
- Seed Passport's internal label action opens a printable label document and invokes the browser print dialog instead of showing a simulated-print alert.
- Expert consultation history heading now accurately describes the mixed pending/answered request list.

## Validation
- TypeScript/TSX syntax transpilation check: passed for 51 source files.
- Full `tsc -b` / Vite production build: not completed because dependencies were not installed. `npm ci` timed out in this environment, and the project also declares a dependency with a Node.js 24+ engine requirement while this environment runs Node.js 22.16.0.
- No live Vercel deployment was changed or verified.

## Important
This is a source patch of the uploaded ZIP snapshot, not a GitHub branch or deployment. Test it locally and deploy the updated source only after confirming the build and demo workflows.

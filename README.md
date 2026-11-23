# invcard — The Baddie Files · Feral Affair

Online version of the Feral Affair birthday invitation card. Static site — plain HTML/CSS/JS, no build step.

| Page | What it does |
|---|---|
| `index.html` | Cover. Passcode gate (`UNTAMED` by default). Point the card's QR code here. |
| `invite.html` | The invitation: letter, event details, Baddies of the Month, RSVP + meal choice. |

## Edit the event
Everything changeable is in [`js/config.js`](js/config.js): passcode, date/time/venue, RSVP deadline, meal options, the six baddies (names, titles, optional photo URLs), `surpriseMode` (hide names/photos), `testMode`.

## Before you share the link
1. **Deploy the RSVP script** — see [`docs/rsvp-google-sheet.md`](docs/rsvp-google-sheet.md) and paste the `/exec` URL into `rsvpEndpoint`. Without it, answers never leave the guest's phone.
2. Set `testMode: false`.
3. Set `mapsUrl` to the venue's Google Maps share link (Maps → Share → Copy link). Until then the OPEN MAPS button stays hidden.

## Run locally
```bash
python3 -m http.server 8080
```
Open http://localhost:8080.

## Deploy (GitHub Pages)
Settings → Pages → Source: *Deploy from a branch* → `main` / root. Then generate the QR code from the Pages URL.

## Security note
The passcode is checked in the browser. Anyone who reads the page source can bypass it. It keeps out casual visitors, nothing more — don't put anything genuinely private on these pages.

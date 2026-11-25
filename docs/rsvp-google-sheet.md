# RSVPs → Google Sheet

Sheet: [Feral Affair RSVPs](https://docs.google.com/spreadsheets/d/1MO4fREX8IL7gSEaaS6eKqhxunzXN8DP6UYf5Fd0Znao/edit)
- **Summary** tab: responses, attending / not attending, meal A / B counts, repeat submissions.
- **RSVPs** tab: one row per submission (time, name, Yes/No, meal letter, meal name, device).

## One-time setup (about 3 minutes, must be done by the sheet owner)

1. Open the sheet → **Extensions → Apps Script**.
2. Delete what's in the editor, paste all of [`rsvp-apps-script.gs`](rsvp-apps-script.gs), click **Save**.
3. **Deploy → New deployment** → gear icon → **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy** → **Authorize access** → pick your Google account → *Advanced* → *Go to project (unsafe)* → **Allow**.
   (The "unsafe" warning appears for every personal script Google hasn't reviewed; it's your own code writing to your own sheet.)
5. Copy the **Web app URL** (ends in `/exec`). Open it in a browser: it should say "Feral Affair RSVP endpoint is running."
6. Put that URL in `js/config.js` → `rsvpEndpoint`.

## Notes
- Editing the script later needs **Deploy → Manage deployments → Edit → New version**, or the old code keeps running.
- The page waits for the script to reply `ok` before it counts an RSVP as received; anything else (offline, timeout, script error) offers the WhatsApp fallback.
- "One submission only" is per browser. The Summary tab's "Repeat submissions" counter flags names that appear twice.

# Collect RSVPs in a Google Sheet (10 minutes)

Without this, RSVPs are saved only in each guest's own browser — **you will not see them.**

1. Create a Google Sheet. Row 1 headers: `submittedAt | name | rsvp | poison | poisonName | userAgent`.
2. **Extensions → Apps Script**, replace the code with:

```js
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var d = JSON.parse(e.postData.contents);
  sheet.appendRow([d.submittedAt, d.name, d.rsvp, d.poison, d.poisonName, d.userAgent]);
  return ContentService.createTextOutput('ok');
}
```

3. **Deploy → New deployment → Web app**. Execute as: *Me*. Who has access: *Anyone*. Copy the `/exec` URL.
4. Paste it into `js/config.js` → `rsvpEndpoint: 'https://script.google.com/macros/s/…/exec'`.
5. Test once with `testMode: true`, check the row appears, then set `testMode: false`.

Limits to know:
- The browser can't read Apps Script's response (`no-cors`), so the page confirms on "request sent", not "row written". Network failures still show an error.
- "One submission only" is per browser. A guest on a second phone can submit again — de-duplicate by name in the sheet.

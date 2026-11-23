/*
 * Event configuration — edit this file, not the HTML.
 * Everything a host is likely to change lives here.
 */
window.INVITE_CONFIG = {
  // Cover gate. Compared case- and space-insensitively.
  // NOTE: this is a client-side gate — it keeps casual visitors out, it is not security.
  passcode: 'UNTAMED',

  // true  = photos & names hidden ("CLASSIFIED / Revealed on the night")
  // false = show nicknames, names and titles
  surpriseMode: true,

  // true = shows a "Reset submission" button after submitting (for testing only).
  // Set to false before sharing the link.
  testMode: false,

  event: {
    date: '16 December 2026',
    day: 'Wednesday',
    time: '12.30 PM',
    venue: 'The Ester Lair',
    mapsQuery: 'Ester Room',
    rsvpBy: 'Tuesday, 1 December'
  },

  // RSVP backend. Leave empty to store answers only in the guest's own browser
  // (the host will NOT receive them). See docs/rsvp-google-sheet.md.
  rsvpEndpoint: '',

  poisons: {
    A: { name: 'Black Truffle Seduction', dish: 'Truffle mushroom pasta' },
    B: { name: 'The Wild Hunt', dish: 'Herb-crusted chicken with seasonal vegetables' }
  },

  baddies: [
    { nick: 'Mimi Fang', name: 'Syamimi Izzati', role: 'The Pocket Panther', photo: '' },
    { nick: 'Nadia Sabre', name: 'Nur Iszzatul Nadia', role: 'Queen of the Den', photo: '' },
    { nick: 'Frankie Blaze', name: 'Frankline', role: 'The Spotlight Tigress', photo: '' },
    { nick: 'Tasya Purr', name: 'Amira Natasya', role: 'The Velvet Claw', photo: '' },
    { nick: 'Tifa Prowl', name: 'Amirahtifah', role: 'The List Lioness', photo: '' },
    { nick: 'Syah Riot', name: 'Nur Syahidah', role: 'The Laughing Leopard', photo: '' }
  ]
};

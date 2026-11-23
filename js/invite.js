(function () {
  var cfg = window.INVITE_CONFIG;
  var STORE = 'feral-affair-rsvp-v2';
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ---------- paw icon (gold pads, red claws) ---------- */
  function paw(size) {
    return '<svg aria-hidden="true" width="' + size + '" height="' + size + '" viewBox="0 -1 24 25" style="display:block">' +
      '<g fill="#C8243A"><path d="M3.73 8.22 Q3.0 6.2 2.77 4.47 Q4.2 5.9 5.01 7.64 Z"/><path d="M8.58 3.43 Q8.5 1.4 8.74 -0.43 Q9.8 1.3 9.96 3.23 Z"/>' +
      '<path d="M14.04 3.23 Q14.2 1.3 15.26 -0.43 Q15.5 1.4 15.42 3.43 Z"/><path d="M18.99 7.64 Q19.8 5.9 21.23 4.47 Q21.0 6.2 20.27 8.22 Z"/></g>' +
      '<g fill="#E2C27D"><ellipse cx="12" cy="16.2" rx="5.2" ry="4.3"/><ellipse cx="5.6" cy="10.6" rx="2" ry="2.6" transform="rotate(-25 5.6 10.6)"/>' +
      '<ellipse cx="9.6" cy="6.4" rx="2.1" ry="2.8" transform="rotate(-8 9.6 6.4)"/><ellipse cx="14.4" cy="6.4" rx="2.1" ry="2.8" transform="rotate(8 14.4 6.4)"/>' +
      '<ellipse cx="18.4" cy="10.6" rx="2" ry="2.6" transform="rotate(25 18.4 10.6)"/></g></svg>';
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  $$('[data-paw]').forEach(function (el) { el.outerHTML = paw(+el.getAttribute('data-paw')); });

  /* ---------- event details ---------- */
  $$('[data-bind]').forEach(function (el) { el.textContent = cfg.event[el.getAttribute('data-bind')] || ''; });
  $('#maps').href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(cfg.event.mapsQuery || cfg.event.venue);

  /* ---------- baddies of the month ---------- */
  var veiled = !!cfg.surpriseMode;
  var meter = '<div class="baddie__meter-label">BADDIE METER</div>' +
    '<div class="meter" role="img" aria-label="Baddie meter: 5 out of 5">' + [1, 2, 3, 4, 5].map(function () { return paw(20); }).join('') + '</div>';
  $('#baddies').innerHTML = cfg.baddies.map(function (b) {
    var photo = (!veiled && b.photo)
      ? '<img src="' + esc(b.photo) + '" alt="' + esc(b.name) + '" loading="lazy">'
      : '[Photo]';
    var who = veiled
      ? '<div class="italic muted" style="font-size:17px">Revealed on the night</div>'
      : '<div class="baddie__nick">' + esc(b.nick) + '</div><div class="baddie__name">' + esc(b.name) + '</div>';
    return '<li class="baddie">' +
      '<div class="baddie__photo"><div class="baddie__inner">' + photo +
      (veiled ? '<div class="baddie__veil">CLASSIFIED</div>' : '') + '</div></div>' +
      who + meter +
      '<div class="baddie__role">' + esc(b.role) + '</div></li>';
  }).join('');

  /* ---------- poison copy ---------- */
  $$('.poison').forEach(function (btn) {
    var p = cfg.poisons[btn.getAttribute('data-poison')];
    $('.poison__name', btn).textContent = p.name;
    $('.poison__dish', btn).textContent = p.dish;
  });

  /* ---------- RSVP ---------- */
  var state = { name: '', rsvp: null, poison: null, locked: false, sending: false };
  var form = $('#rsvp-form');
  var nameInput = $('#agent');
  var err = $('#rsvp-error');
  var submitBtn = $('#rsvp-submit');
  var modal = $('#modal');
  var lastFocus = null;

  try {
    var saved = JSON.parse(localStorage.getItem(STORE) || 'null');
    if (saved && saved.name) { state.name = saved.name; state.rsvp = saved.rsvp; state.poison = saved.poison; state.locked = true; }
  } catch (e) {}

  function setError(msg) { err.textContent = msg || ''; err.hidden = !msg; }

  function render() {
    form.hidden = state.locked;
    $('#sealed').hidden = !state.locked;
    $('#reset').hidden = !(cfg.testMode && state.locked);

    $$('.choice').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-rsvp') === state.rsvp)); });
    $('#poison-group').hidden = state.rsvp !== 'in';
    $$('.poison').forEach(function (b) {
      var on = b.getAttribute('data-poison') === state.poison;
      b.setAttribute('aria-pressed', String(on));
      $('.poison__tag', b).textContent = 'POISON ' + b.getAttribute('data-poison') + (on ? ' · CHOSEN' : '');
    });
    submitBtn.hidden = !state.rsvp;
    submitBtn.disabled = state.sending;
    submitBtn.textContent = state.sending ? 'SEALING…' : 'SUBMIT YOUR FILE';

    var isIn = state.rsvp === 'in';
    var p = cfg.poisons[state.poison];
    var out = {
      title: isIn ? 'Welcome to the Affair' : 'Noted, darling',
      msg: isIn ? 'Welcome to the pack, ' + state.name + '. See you at the table.' : 'Your absence will be felt, ' + state.name + '.',
      letter: state.poison || '',
      pname: p ? p.name : '',
      pdish: p ? p.dish : ''
    };
    $$('[data-out]').forEach(function (el) { el.textContent = out[el.getAttribute('data-out')]; });
    $('#modal-poison').hidden = !(isIn && p);
  }

  nameInput.addEventListener('input', function () { state.name = nameInput.value; setError(''); });
  $$('.choice').forEach(function (b) {
    b.addEventListener('click', function () { state.rsvp = b.getAttribute('data-rsvp'); setError(''); render(); });
  });
  $$('.poison').forEach(function (b) {
    b.addEventListener('click', function () { state.poison = b.getAttribute('data-poison'); setError(''); render(); });
  });

  function send(rec) {
    if (!cfg.rsvpEndpoint) return Promise.resolve();
    // text/plain avoids a CORS preflight, which Google Apps Script web apps don't answer.
    return fetch(cfg.rsvpEndpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(rec)
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (state.locked || state.sending) return;
    var n = nameInput.value.trim();
    if (!n) { setError('Name first, baddie. We don’t do anonymous.'); nameInput.focus(); return; }
    if (!state.rsvp) { setError('In or out? Pick one.'); return; }
    if (state.rsvp === 'in' && !state.poison) { setError('Pick your poison first.'); return; }

    var rec = {
      name: n,
      rsvp: state.rsvp,
      poison: state.rsvp === 'in' ? state.poison : null,
      poisonName: state.rsvp === 'in' ? cfg.poisons[state.poison].name : null,
      submittedAt: new Date().toISOString(),
      userAgent: navigator.userAgent
    };
    state.name = n;
    state.sending = true;
    render();

    send(rec).then(function () {
      try { localStorage.setItem(STORE, JSON.stringify(rec)); } catch (e2) {}
      state.sending = false;
      state.locked = true;
      state.poison = rec.poison;
      render();
      openModal();
    }, function () {
      state.sending = false;
      render();
      setError('The signal got lost in the jungle. Check your connection and try again.');
    });
  });

  function openModal() {
    lastFocus = document.activeElement;
    modal.hidden = false;
    $('#modal-close').focus();
    document.addEventListener('keydown', onModalKey);
  }
  function closeModal() {
    modal.hidden = true;
    document.removeEventListener('keydown', onModalKey);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  function onModalKey(e) {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'Tab') { e.preventDefault(); $('#modal-close').focus(); } // single focusable element
  }
  $('#modal-close').addEventListener('click', closeModal);

  $('#reset').addEventListener('click', function () {
    try { localStorage.removeItem(STORE); } catch (e) {}
    state = { name: '', rsvp: null, poison: null, locked: false, sending: false };
    nameInput.value = '';
    setError('');
    render();
  });

  nameInput.value = state.name;
  render();
})();

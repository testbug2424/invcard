(function () {
  var cfg = window.INVITE_CONFIG;
  var KEY = 'feral-affair-unlocked';
  var form = document.getElementById('gate');
  var input = document.getElementById('pw');
  var error = document.getElementById('pw-error');
  var unlocked = document.getElementById('unlocked');

  function norm(v) { return String(v || '').replace(/\s+/g, '').toUpperCase(); }

  function showUnlocked() {
    form.hidden = true;
    unlocked.hidden = false;
    unlocked.querySelector('a').focus();
  }

  try { if (sessionStorage.getItem(KEY) === '1') showUnlocked(); } catch (e) {}

  input.addEventListener('input', function () { error.hidden = true; });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = norm(cfg.passcode) !== '' && norm(input.value) === norm(cfg.passcode);
    if (!ok) {
      error.hidden = false;
      form.classList.remove('shake');
      void form.offsetWidth; // restart animation
      form.classList.add('shake');
      input.select();
      return;
    }
    try { sessionStorage.setItem(KEY, '1'); } catch (e2) {}
    showUnlocked();
  });
})();

// Local dev: Flask backend. GitHub Pages: swap to your Formspree URL.
const BACKEND_URL = 'http://localhost:8080/api/messages';

// ── Contact form ──
document.getElementById('msgForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn    = document.getElementById('msgBtn');
  const status = document.getElementById('msg-status');

  btn.disabled = true;
  btn.textContent = 'Sending…';
  status.className = '';
  status.textContent = '';

  const fd = new FormData(e.target);
  const payload = {
    name:    fd.get('name').trim(),
    email:   fd.get('email').trim(),
    message: fd.get('message').trim(),
  };

  try {
    const res  = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      status.className = 'ok';
      status.textContent = '✓ Message sent! Thanks for reaching out.';
      e.target.reset();
    } else {
      throw new Error(data.error || 'Something went wrong — please try again.');
    }
  } catch (err) {
    status.className = 'err';
    status.textContent = '✗ ' + err.message;
  } finally {
    btn.disabled = false;
    btn.textContent = 'Send Message';
  }
});

// ── Admin inbox (?admin=1) ──
if (new URLSearchParams(location.search).get('admin') === '1') {
  const section = document.getElementById('messages');
  section.classList.add('visible');

  fetch(BACKEND_URL)
    .then(r => r.json())
    .then(msgs => {
      const list = document.getElementById('msgList');
      if (!msgs.length) {
        list.innerHTML = '<p style="color:var(--muted)">No messages yet.</p>';
        return;
      }
      list.innerHTML = [...msgs].reverse().map(m => `
        <div class="msg-item">
          <div class="msg-item-header">
            <span class="msg-item-name">${esc(m.name)}${m.email ? ` &lt;${esc(m.email)}&gt;` : ''}</span>
            <span class="msg-item-meta">${new Date(m.timestamp).toLocaleString()}</span>
          </div>
          <p class="msg-item-body">${esc(m.message)}</p>
        </div>`).join('');
    })
    .catch(() => {
      document.getElementById('msgList').innerHTML =
        '<p style="color:#e53e3e">Could not load messages — is the backend running?</p>';
    });
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

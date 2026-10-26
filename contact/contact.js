const form = document.querySelector('.contact-form');
const status = document.querySelector('.form-status');

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const fields = new FormData(form);
  const subject = String(fields.get('subject') ?? '').trim();
  const message = String(fields.get('body') ?? '').trim();
  const email = String(fields.get('email') ?? '').trim();
  const body = `${message}\n\nReply to: ${email}`;

  status.textContent = 'Opening your email app with a draft. If nothing opens, use the email address above.';
  window.location.href = `mailto:yuz235@ucsd.edu?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

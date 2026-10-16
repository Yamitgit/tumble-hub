(function () {
  const dateInput = document.getElementById('date');
  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  dateInput.min = localToday;
  document.getElementById('year').textContent = new Date().getFullYear();

  document.querySelectorAll('[data-service]').forEach(function (link) {
    link.addEventListener('click', function () {
      const service = link.getAttribute('data-service');
      const select = document.getElementById('service');
      select.value = service;
    });
  });

  const form = document.getElementById('bookingForm');
  const result = document.getElementById('formResult');
  const resultText = document.getElementById('resultText');
  let requestText = '';
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const d = new FormData(form);
    requestText = [
      'BOL — BANGALORE ONLINE LAUNDRY SERVICE — PICKUP REQUEST',
      'Name: ' + d.get('name'),
      'Mobile: ' + d.get('phone'),
      'PIN code: ' + d.get('pin'),
      'Service: ' + d.get('service'),
      'Preferred pickup: ' + d.get('date') + ' / ' + d.get('time'),
      'Address: ' + d.get('address'),
      'Notes: ' + (d.get('notes') || 'None'),
      '',
      'Status: Request only — awaiting BOL confirmation.'
    ].join('\n');
    resultText.textContent = requestText + '\n\nPreview only: details have not been sent or saved.';
    result.classList.add('show');
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
  document.getElementById('copyRequest').addEventListener('click', async function () {
    const btn = this;
    try {
      await navigator.clipboard.writeText(requestText);
      btn.textContent = 'Copied to clipboard ✓';
    } catch (error) {
      const range = document.createRange();
      range.selectNodeContents(resultText);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      btn.textContent = 'Select the text above to copy';
    }
  });

  document.querySelectorAll('[data-policy]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      alert(link.getAttribute('data-policy') + ' page: add reviewed business-specific policy content before launch.');
    });
  });
  document.getElementById('contactLink').addEventListener('click', function (event) {
    event.preventDefault();
    alert('Add BOL’s verified phone number, WhatsApp contact, business email and operating hours before launch.');
  });
})();
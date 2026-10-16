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
  const submitButton = form.querySelector('button[type="submit"]');

  const BOL_APPS_SCRIPT_URL =
    'https://script.google.com/macros/s/AKfycbzdXxeR_I5BCB4-plwlJ-m1HTVjXH4UG4e0Jt3nxYVzRJNIHqoMr18a7A-Np1sonL7-/exec';

  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const formData = new FormData(form);

    const payload = {
      name: String(formData.get('name') || '').trim(),
      phone: String(formData.get('phone') || '').trim(),
      pin: String(formData.get('pin') || '').trim(),
      service: String(formData.get('service') || '').trim(),
      date: String(formData.get('date') || '').trim(),
      time: String(formData.get('time') || '').trim(),
      address: String(formData.get('address') || '').trim(),
      notes: String(formData.get('notes') || '').trim(),
      consent: document.getElementById('consent').checked,
      website: String(formData.get('website') || '')
    };

    if (payload.website) return;

    if (!BOL_APPS_SCRIPT_URL.includes('/exec')) {
      result.classList.add('show');
      result.querySelector('h3').textContent =
        'Setup incomplete';
      resultText.textContent =
        'The booking form is not connected yet. Please contact BOL directly.';
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Sending request…';

    try {
      await fetch(BOL_APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payload)
      });

      result.classList.add('show');
      result.querySelector('h3').textContent =
        'Request submitted for processing';
      resultText.textContent =
        'Your request was sent for processing. This page cannot verify receipt. BOL must confirm availability, price and pickup time before your booking is confirmed.';

      form.reset();
    } catch (error) {
      result.classList.add('show');
      result.querySelector('h3').textContent =
        'Could not submit';
      resultText.textContent =
        'Please try again later or contact BOL directly. Your pickup is not confirmed.';
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Prepare pickup request →';
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
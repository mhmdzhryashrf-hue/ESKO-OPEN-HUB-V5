/* ESKO V5.6 — random WhatsApp support contact router. */
(() => {
  'use strict';
  const SUPPORT_NUMBERS = Object.freeze([
    '963993825873',
    '201226821986',
    '201128530613'
  ]);
  const DEFAULT_MESSAGE = 'مرحبًا، أحتاج إلى مساعدة بخصوص ESKO OPEN HUB.';
  function pickNumber() {
    if (window.crypto?.getRandomValues) {
      const value = new Uint32Array(1);
      window.crypto.getRandomValues(value);
      return SUPPORT_NUMBERS[value[0] % SUPPORT_NUMBERS.length];
    }
    return SUPPORT_NUMBERS[Math.floor(Math.random() * SUPPORT_NUMBERS.length)];
  }
  function open(message = DEFAULT_MESSAGE) {
    const number = pickNumber();
    const url = 'https://wa.me/' + number + '?text=' + encodeURIComponent(message || DEFAULT_MESSAGE);
    window.location.assign(url);
  }
  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('[data-random-support]');
    if (!link) return;
    event.preventDefault();
    open(link.dataset.supportMessage || DEFAULT_MESSAGE);
  });
  window.ESKORandomSupport = Object.freeze({ open, numbers: SUPPORT_NUMBERS });
})();

'use strict';

const OFFICIAL_LINK_CARDS = Object.freeze([
  Object.freeze({ label: 'القناة الرسمية', url: 'https://whatsapp.com/channel/0029VbE7vGO4tRrwmz95M73S', tone: 'green' }),
  Object.freeze({ label: 'القناة الاحتياطية', url: 'https://whatsapp.com/channel/0029VbEH9N2LY6d4aZ8FRW0I', tone: 'green' }),
  Object.freeze({ label: 'الدعم الفني', url: 'https://wa.me/201128530613', tone: 'green' })
]);

function decorateOutbound(message) {
  const text = typeof message === 'string' ? message : String(message && message.text || '');
  const links = OFFICIAL_LINK_CARDS.map(card => `${card.label}: ${card.url}`).join('\n');
  return Object.freeze({ text: `${text}${text ? '\n\n' : ''}${links}`, linkCards: OFFICIAL_LINK_CARDS });
}

function createAutoLinkSender(sendFunction) {
  if (typeof sendFunction !== 'function') throw new TypeError('sendFunction must be a function');
  return async function sendWithOfficialCards(destination, message, options = {}) {
    const payload = decorateOutbound(message);
    return sendFunction(destination, payload, options);
  };
}

module.exports = { OFFICIAL_LINK_CARDS, decorateOutbound, createAutoLinkSender };

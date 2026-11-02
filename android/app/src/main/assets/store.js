/* ESKO V4.5 local device store. IndexedDB data is origin-scoped, not Android-encrypted. */
(() => {
  'use strict';
  const DB_NAME = 'esko-open-hub-v45';
  const DB_VERSION = 1;
  let dbPromise;

  function openDB() {
    if (!('indexedDB' in window)) return Promise.reject(new Error('IndexedDB غير متاح في هذا المتصفح.'));
    if (!dbPromise) {
      dbPromise = new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = () => {
          const db = req.result;
          for (const store of ['settings', 'notes', 'media', 'profile', 'assistant']) {
            if (!db.objectStoreNames.contains(store)) db.createObjectStore(store);
          }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error || new Error('تعذر فتح وحدة التخزين.'));
      });
    }
    return dbPromise;
  }

  async function request(store, mode, operation) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, mode);
      const objectStore = tx.objectStore(store);
      let req;
      let result;
      try { req = operation(objectStore); } catch (error) { reject(error); return; }
      req.onsuccess = () => { result = req.result; };
      req.onerror = () => reject(req.error || new Error('فشلت عملية التخزين.'));
      tx.oncomplete = () => resolve(result);
      tx.onerror = () => reject(tx.error || new Error('فشلت معاملة التخزين.'));
      tx.onabort = () => reject(tx.error || new Error('تم إلغاء معاملة التخزين.'));
    });
  }

  window.ESKOStore = Object.freeze({
    get: (store, key) => request(store, 'readonly', s => s.get(key)),
    set: (store, key, value) => request(store, 'readwrite', s => s.put(value, key)),
    remove: (store, key) => request(store, 'readwrite', s => s.delete(key)),
    clear: store => request(store, 'readwrite', s => s.clear()),
    ready: () => openDB()
  });
})();

/* ESKO V5 image pipeline: user-image encoder + wallpaper validator/cache. */
(() => {
  'use strict';
  const MAX_IMAGE_BYTES = 300 * 1024;

  function readAsDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('تعذر تحويل الصورة إلى بيانات.'));
      reader.readAsDataURL(blob);
    });
  }

  async function compressUpload(file, maxBytes = MAX_IMAGE_BYTES) {
    if (!file || !/^image\/(png|jpeg|webp)$/.test(file.type)) {
      throw new Error('صيغة الصورة غير مدعومة؛ استخدم PNG أو JPG أو WebP.');
    }
    let bitmap;
    try { bitmap = await createImageBitmap(file); }
    catch { throw new Error('تعذر فك الصورة المختارة.'); }
    let width = bitmap.width;
    let height = bitmap.height;
    const maxSide = 960;
    if (Math.max(width, height) > maxSide) {
      const ratio = maxSide / Math.max(width, height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) { bitmap.close?.(); throw new Error('معالج الصور غير متاح.'); }

    let output = null;
    const qualities = [.86, .82, .78, .74, .70, .66, .62, .58];
    try {
      for (let index = 0; index < qualities.length; index++) {
        canvas.width = width;
        canvas.height = height;
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(bitmap, 0, 0, width, height);
        output = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', qualities[index]));
        if (output && output.size <= maxBytes) break;
        if (index === 3 || index === 5) {
          width = Math.max(320, Math.round(width * .84));
          height = Math.max(320, Math.round(height * .84));
        }
      }
    } finally { bitmap.close?.(); }

    if (!output || output.size > maxBytes) {
      throw new Error('تعذر ضغط الصورة إلى 300KB؛ اختر صورة أصغر أو أوضح.');
    }
    const data = await readAsDataUrl(output);
    return { data, size: output.size, width, height, format: 'image/webp' };
  }

  async function prepareWallpaper(url, maxBytes = MAX_IMAGE_BYTES) {
    const response = await fetch(url, { cache: 'force-cache', credentials: 'same-origin' });
    if (!response.ok) throw new Error(`تعذر تحميل الخلفية (${response.status}).`);
    const blob = await response.blob();
    if (blob.size > maxBytes) throw new Error('الخلفية تتجاوز الحد المحدد 300KB.');
    if (!/^image\/(webp|jpeg|png)$/.test(blob.type)) throw new Error('صيغة الخلفية غير معروفة.');
    const decoded = await createImageBitmap(blob);
    const dimensions = { width: decoded.width, height: decoded.height };
    decoded.close?.();
    return { url: URL.createObjectURL(blob), size: blob.size, ...dimensions };
  }

  window.ESKOImagePipeline = Object.freeze({ compressUpload, prepareWallpaper, maxBytes: MAX_IMAGE_BYTES });
})();

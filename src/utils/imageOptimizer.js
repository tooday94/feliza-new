export const getOptimizedImageUrl = (url, width = 400) => {
  if (!url) return '';

  // 1. Локально возвращаем оригинал
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return url;
  }

  // 2. Если картинка не наша, не трогаем
  if (!url.includes('feliza-images.s3')) {
    return url;
  }

  // 3. 🔥 ИСПРАВЛЕНИЕ: Сначала декодируем (убираем %20), потом кодируем заново.
  // Это спасет от двойных %% в ссылке.
  const cleanUrl = decodeURIComponent(url);

  return `/.netlify/images?url=${encodeURIComponent(cleanUrl)}&w=${width}&fit=cover&format=auto`;
};

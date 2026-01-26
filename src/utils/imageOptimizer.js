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

 
  const fixedUrl = encodeURI(url);

  // 4. Теперь заворачиваем исправленную ссылку для Netlify
  return `/.netlify/images?url=${encodeURIComponent(fixedUrl)}&w=${width}&fit=cover&format=auto`;
};

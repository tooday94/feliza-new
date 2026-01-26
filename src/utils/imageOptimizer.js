export const getOptimizedImageUrl = (url, width = 400) => {
  if (!url) return '';

  // Локально возвращаем оригинал
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return url;
  }

  // Если картинка не наша, не трогаем
  if (!url.includes('feliza-images.s3')) {
    return url;
  }
  
  return `/.netlify/images?url=${encodeURIComponent(url)}&w=${width}&fit=cover&format=auto`;
};

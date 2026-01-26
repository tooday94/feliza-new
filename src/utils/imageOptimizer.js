// src/utils/imageOptimizer.js

export const getOptimizedImageUrl = (url, width = 400) => {
  if (!url) return '';

  // 1. Если мы работаем на компьютере (localhost), показываем оригинал, 
  // чтобы картинки не ломались при разработке без Netlify CLI.
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return url;
  }

  // 2. Если это не наша картинка с S3 (например, иконка или другой сайт), 
  // возвращаем как есть.
  if (!url.includes('feliza-images.s3')) {
    return url;
  }

  // 3. Формируем "умную" ссылку для Netlify
  // w={width} — ширина, которую мы просим
  // fit=cover — обрезать лишнее, чтобы заполнить область
  // format=auto — Netlify сам выберет формат (AVIF или WebP)
  return `/.netlify/images?url=${encodeURIComponent(url)}&w=${width}&fit=cover&format=auto`;
};

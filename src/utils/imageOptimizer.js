export const getOptimizedImageUrl = (url, width = 400, customHeight = null) => {
  if (!url) return "";

  // Локально возвращаем оригинал
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return url;
  }

  // Только наши S3 картинки
  if (!url.includes("feliza-images.s3")) {
    return url;
  }

  // 🔥 ЛОГИКА ИЗМЕНЕНА:
  // Если высота передана вручную (для баннеров) - берем её.
  // Если нет (для товаров) - считаем автоматически как 3/4.
  const height = customHeight ? customHeight : Math.round(width * 4 / 3);

  const fixedUrl = encodeURI(url);

  // Добавляем параметр q=75 для сжатия и fm=webp для формата
  return `/.netlify/images?url=${encodeURIComponent(fixedUrl)}&w=${width}&h=${height}&fit=cover&fm=webp&q=85`;
};

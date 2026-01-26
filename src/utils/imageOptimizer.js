export const getOptimizedImageUrl = (url, width = 400) => {
  if (!url) return "";

  // локально возвращаем оригинал
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return url;
  }

  // только наши S3 картинки
  if (!url.includes("feliza-images.s3")) {
    return url;
  }

  // высота под fashion-карточки 3/4
  const height = Math.round(width * 4 / 3);

  const fixedUrl = encodeURI(url);

  return `/.netlify/images?url=${encodeURIComponent(fixedUrl)}&w=${width}&h=${height}&fit=cover&fm=webp&q=75`;
};

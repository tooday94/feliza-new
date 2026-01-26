export const getOptimizedImageUrl = (url, width = 400) => {
  if (!url) return "";

  // локально не трогаем
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    return url;
  }

  // оптимизируем только наши S3 картинки
  if (!url.includes("feliza-images.s3")) {
    return url;
  }

  // ВАЖНО: кодируем ТОЛЬКО ОДИН РАЗ
  const encoded = encodeURIComponent(url);

  return `/.netlify/images?url=${encoded}&w=${width}&fit=cover&fm=webp&q=75`;
};

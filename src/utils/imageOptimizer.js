export const getOptimizedImageUrl = (url, width = 400, customHeight = null) => {
  if (!url) return "";

  if (typeof window !== 'undefined' && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
    return url;
  }

  if (!url.includes("feliza-images.s3")) {
    return url;
  }


  const pixelRatio = 2;

  const quality = 95;

  const baseHeight = customHeight ? customHeight : Math.round(width * 4 / 3);


  const retinaWidth = Math.round(width * pixelRatio);
  const retinaHeight = Math.round(baseHeight * pixelRatio);

  const fixedUrl = encodeURI(url);

  return `/.netlify/images?url=${encodeURIComponent(fixedUrl)}&w=${retinaWidth}&h=${retinaHeight}&fit=cover&fm=webp&q=${quality}`;
};

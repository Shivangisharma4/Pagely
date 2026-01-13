export function getOptimizedImageUrl(
  url: string,
  width?: number,
  quality = 75
): string {
  if (!url) return '';
  
  // For external URLs (like Google Books), return as-is
  if (url.startsWith('http')) {
    return url;
  }
  
  // For Next.js Image Optimization
  const params = new URLSearchParams();
  if (width) params.set('w', width.toString());
  params.set('q', quality.toString());
  
  return `/api/image?url=${encodeURIComponent(url)}&${params.toString()}`;
}

export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

export function getImageDimensions(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = reject;
    img.src = src;
  });
}

export function generatePlaceholder(width: number, height: number): string {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Crect width='${width}' height='${height}' fill='%23f0f0f0'/%3E%3C/svg%3E`;
}

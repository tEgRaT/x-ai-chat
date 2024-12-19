export async function compressImage(base64String: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', {
        alpha: false,
        willReadFrequently: true,
      })!;

      let width = img.width;
      let height = img.height;
      const maxSize = 400;

      if (width > height && width > maxSize) {
        height = Math.round((height * maxSize) / width);
        width = maxSize;
      } else if (height > maxSize) {
        width = Math.round((width * maxSize) / height);
        height = maxSize;
      }

      canvas.width = width;
      canvas.height = height;

      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, width, height);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(img, 0, 0, width, height);

      const quality = 0.7;
      const dataUrl = canvas.toDataURL('image/jpeg', quality);

      resolve(dataUrl);
    };
    img.onerror = reject;
    img.src = base64String;
  });
}

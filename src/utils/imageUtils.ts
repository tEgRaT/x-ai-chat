export async function compressImage(base64String: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', {
        alpha: false, // Disable alpha for better JPEG encoding
        willReadFrequently: true, // Optimize for image processing
      })!;

      // Calculate new dimensions (max 400px for better API compatibility)
      let width = img.width;
      let height = img.height;
      const maxSize = 400; // Reduced from 800 to 400

      if (width > height && width > maxSize) {
        height = Math.round((height * maxSize) / width);
        width = maxSize;
      } else if (height > maxSize) {
        width = Math.round((width * maxSize) / height);
        height = maxSize;
      }

      canvas.width = width;
      canvas.height = height;

      // Use better quality settings
      ctx.fillStyle = 'white'; // Set white background
      ctx.fillRect(0, 0, width, height);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Draw with better quality
      ctx.drawImage(img, 0, 0, width, height);

      // Use moderate compression
      const quality = 0.7; // Lower quality for smaller size
      const dataUrl = canvas.toDataURL('image/jpeg', quality);

      console.log('Compressed image details:', {
        originalWidth: img.width,
        originalHeight: img.height,
        newWidth: width,
        newHeight: height,
        quality,
        size: Math.round((dataUrl.length * 0.75) / 1024) + 'KB',
      });

      resolve(dataUrl);
    };
    img.onerror = reject;
    img.src = base64String;
  });
}

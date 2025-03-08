export const loadImageElement = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => resolve(img);
      img.onerror = (error) => reject(error);
    };
  });
};

export const cropImage = (imageElement, cropData, originalFile) => {
  return new Promise((resolve, reject) => {
    if (!cropData || !cropData.width || !cropData.height) {
      reject(new Error("Invalid crop dimensions"));
      return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Get the display size vs natural size ratio
    const scaleX = imageElement.naturalWidth / imageElement.width;
    const scaleY = imageElement.naturalHeight / imageElement.height;

    // Calculate the actual pixel coordinates for cropping
    const pixelCrop = {
      x: cropData.x * scaleX,
      y: cropData.y * scaleY,
      width: cropData.width * scaleX,
      height: cropData.height * scaleY
    };

    // Set canvas dimensions to match the cropped size
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // Draw the cropped portion onto the canvas
    ctx.drawImage(
      imageElement,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    // Convert canvas to file
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        
        // Create a new file from the blob
        // Fix: Use a proper filename handling
        const filename = originalFile.split('/').pop() || 'cropped-image.jpg';
        resolve(new File([blob], `cropped-${filename}`, { type: 'image/jpeg' }));
      },
      'image/jpeg',
      0.8 // High quality but slightly compressed
    );
  });
};
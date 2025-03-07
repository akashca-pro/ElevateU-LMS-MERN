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
      const canvas = document.createElement("canvas");
      const scaleX = imageElement.naturalWidth / imageElement.width;
      const scaleY = imageElement.naturalHeight / imageElement.height;
  
      canvas.width = cropData.width;
      canvas.height = cropData.height;
      
      const ctx = canvas.getContext("2d");
      ctx.drawImage(
        imageElement,
        cropData.x * scaleX,
        cropData.y * scaleY,
        cropData.width * scaleX,
        cropData.height * scaleY,
        0,
        0,
        cropData.width,
        cropData.height
      );
  
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Canvas is empty"));
            return;
          }
          resolve(new File([blob], originalFile.name, { type: originalFile.type }));
        },
        originalFile.type,
        0.8
      );
    });
  };
  
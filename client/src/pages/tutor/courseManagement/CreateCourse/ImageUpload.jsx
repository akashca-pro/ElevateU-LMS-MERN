import { useState, useCallback, useRef } from "react"
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button"
import { ImageIcon, Trash2, Upload, Crop, Check } from "lucide-react"
import { imageUpload } from "@/services/Cloudinary/imageUpload"
import { toast } from "sonner"

export function ImageUpload({ value, onChange, onRemove, disabled = false }) {
  console.log(value)
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageElement, setImageElement] = useState(null);
  const [finalImage, setFinalImage] = useState(null);
  const [croppedPreview, setCroppedPreview] = useState(null);
  const imgRef = useRef()
  const [crop, setCrop] = useState({ 
    unit: "%", 
    x: 25, 
    y: 25, 
    width: 50, 
    height: 50 
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [originalFileName, setOriginalFileName] = useState("");
  const [originalFile, setOriginalFile] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    try {
      const objectUrl = URL.createObjectURL(file);
      setSelectedFile(objectUrl);
      setOriginalFileName(file.name);
      setOriginalFile(file);
      setIsCropping(false);
      setCroppedPreview(objectUrl);
      setFinalImage(file);
    } catch (error) {
      console.error("Error loading image:", error);
      toast.error("Failed to load image");
    }
  };

  const handleStartCropping = () => {
    setIsCropping(true);
    // Reset crop to default centered position
    setCrop({ 
      unit: "%", 
      x: 25, 
      y: 25, 
      width: 50, 
      height: 50 
    });
    setCompletedCrop(null);
  };

  const handleUseAsIs = () => {
    // Skip cropping and use the original image
    if (!originalFile) return;
    
    const objectUrl = URL.createObjectURL(originalFile);
    setCroppedPreview(objectUrl);
    setFinalImage(originalFile);
    setIsCropping(false);
  };

  const handleCropComplete = useCallback((crop) => {
    if (crop.width && crop.height) {
      setCompletedCrop(crop);
    }
  }, []);

  const handleSaveCrop = async () => {
    if (!imgRef.current || !completedCrop?.width || !completedCrop?.height) {
      toast.error("Please select a crop area");
      return;
    }
  
    try {
      setIsUploading(true);
      const img = imgRef.current;
      
      // Calculate scaling factors based on displayed image vs natural size
      const scaleX = img.naturalWidth / img.width;
      const scaleY = img.naturalHeight / img.height;
  
      // Convert crop coordinates to natural image pixels
      const pixelCrop = {
        x: completedCrop.x * scaleX,
        y: completedCrop.y * scaleY,
        width: completedCrop.width * scaleX,
        height: completedCrop.height * scaleY,
      };
  
      // Create canvas and crop
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
  
      ctx.drawImage(
        img,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );
  
      // Convert to file
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error("Canvas is empty");
        }
        const filename = originalFileName.split('/').pop() || 'cropped-image.jpg';
        const croppedFile = new File([blob], `cropped-${filename}`, { type: 'image/jpeg' });
        const croppedPreviewURL = URL.createObjectURL(croppedFile);
        
        setFinalImage(croppedFile);
        setCroppedPreview(croppedPreviewURL);
        setIsCropping(false);
      }, 'image/jpeg', 0.8);
  
    } catch (error) {
      console.error("Error cropping image:", error);
      toast.error("Failed to crop image");
    } finally {
      setIsUploading(false);
    }
  };
  

  const handleUpload = async () => {
    if (!finalImage) return;

    const toastId = toast.loading("Uploading image...");
    try {
      const { uploadedImageUrl } = await imageUpload(finalImage);
      setCroppedPreview(uploadedImageUrl);
      toast.success("Uploaded successfully!", { id: toastId });
      onChange(uploadedImageUrl);
    } catch (error) {
      toast.error("Uploading image failed", { id: toastId });
      console.error("Upload error:", error);
    }
  };

  const handleCancel = () => {
    setIsCropping(false);
    if (!croppedPreview) {
      // Only reset everything if we don't have a previous cropped image
      setSelectedFile(null);
      setImageElement(null);
      setOriginalFile(null);
    }
  };

  const resetAll = () => {
    setCroppedPreview(null);
    setFinalImage(null);
    setSelectedFile(null);
    setImageElement(null);
    setOriginalFile(null);
    if (onRemove) onRemove();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {value ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
          <img 
            src={value} 
            alt="Thumbnail" 
            className="h-full w-full object-cover" 
          />
          <Button 
            type="button" 
            variant="destructive" 
            size="sm" 
            className="absolute bottom-2 right-2"
            onClick={()=>onRemove()}
            disabled={disabled}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Remove
          </Button>
        </div>
      ) : (
        <>
          {!selectedFile ? (
            <label className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/30 text-muted-foreground hover:bg-muted/50 relative">
              <div className="flex flex-col items-center gap-1">
                <ImageIcon className="h-8 w-8" />
                <span className="text-sm font-medium">Upload thumbnail</span>
                <span className="text-xs">Click to browse</span>
              </div>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileChange} 
                disabled={isUploading} 
              />
            </label>
          ) : isCropping ? (
            <div className="w-full flex flex-col items-center">
              <h3 className="text-md font-medium mb-2">Crop Image</h3>
              <div className="max-w-full max-h-[400px] overflow-hidden">
              <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={handleCropComplete}
              aspect={16 / 9}
                >
                <img
              ref={imgRef} // Attach the ref here
                src={selectedFile}
              alt="Crop Preview"
              style={{ maxHeight: '400px', maxWidth: '100%' }}
            />
          </ReactCrop>
              </div>

              <div className="flex justify-between w-full mt-4 gap-2">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={handleCancel}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button 
                  type="button"
                  onClick={handleSaveCrop}
                  disabled={isUploading || !completedCrop?.width || !completedCrop?.height}
                >
                  {isUploading ? "Saving..." : "Save Crop"}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="w-full aspect-video relative rounded-lg border overflow-hidden">
                <img 
                  src={croppedPreview} 
                  alt="Image Preview" 
                  className="w-full h-full object-cover" 
                />
                
                {!finalImage && (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-3">
                    <h3 className="text-white font-medium">What would you like to do with this image?</h3>
                    <div className="flex gap-3">
                      <Button 
                        type="button" 
                        onClick={handleStartCropping}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Crop className="h-4 w-4 mr-2" />
                        Crop Image
                      </Button>
                      <Button 
                        type="button" 
                        onClick={handleUseAsIs}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Use As Is
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {finalImage && (
                <div className="flex gap-2 w-full">
                  <Button
                    type="button"
                    variant="default"
                    className="mt-2 flex-1"
                    onClick={handleUpload}
                    disabled={isUploading}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {isUploading ? "Uploading..." : "Upload"}
                  </Button>

                  <Button 
                    type="button" 
                    onClick={handleStartCropping}
                    variant="outline"
                    className="mt-2"
                    disabled={isUploading}
                  >
                    <Crop className="h-4 w-4 mr-2" />
                    Edit Crop
                  </Button>

                  <Button 
                    type="button" 
                    variant="destructive" 
                    className="mt-2"
                    onClick={resetAll}
                    disabled={isUploading}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
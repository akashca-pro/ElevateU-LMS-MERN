import { useState } from "react"
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button"
import { ImageIcon, Trash2 , Upload } from "lucide-react"
import { imageUpload } from "@/services/Cloudinary/imageUpload"
import { toast } from "sonner"
import { cropImage, loadImageElement } from '@/utils/cropImage.js'

export function ImageUpload({ value, onChange, onRemove }) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageElement, setImageElement] = useState(null);
  const [finalImage, setFinalImage] = useState(null);
  const [croppedPreview, setCroppedPreview] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 50, height: 50 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imgElement = await loadImageElement(file);
      const objectUrl = URL.createObjectURL(file);

      setSelectedFile(objectUrl);
      setImageElement(imgElement);
      setIsCropping(true); // Show cropping UI
    } catch (error) {
      console.error("Error loading image:", error);
    }
  };

  const handleCropComplete = (crop) => {
    setCompletedCrop(crop);
  };

  const handleSaveCrop = async () => {
    if (!imageElement || !completedCrop) return;

    try {
      setIsUploading(true);
      const croppedFile = await cropImage(imageElement, completedCrop, selectedFile);
      const croppedPreviewURL = URL.createObjectURL(croppedFile);

      setFinalImage(croppedFile);
      setCroppedPreview(croppedPreviewURL);
      setSelectedFile(croppedPreviewURL); // Update preview inside upload input
      setIsCropping(false);
    } catch (error) {
      console.error("Error cropping image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpload = async () => {
    if (!finalImage) return;

    const toastId = toast.loading("Uploading image...");
    try {
      const { uploadedImageUrl } = await imageUpload(finalImage);
      setSelectedFile(uploadedImageUrl);
      setCroppedPreview(uploadedImageUrl);
      toast.success("Uploaded successfully!", { id: toastId });
      onChange(uploadedImageUrl);
    } catch (error) {
      toast.error("Uploading image failed", { id: toastId });
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {value ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
          <img src={value || "/placeholder.svg"} alt="Thumbnail" className="h-full w-full object-cover" />
          <Button type="button" variant="destructive" size="icon" className="absolute right-2 top-2" onClick={()=>{onRemove() , setCroppedPreview(null)}}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <>
          {!isCropping && ( 
            <label className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/30 text-muted-foreground hover:bg-muted/50 relative">
              {croppedPreview ? (
                <img src={croppedPreview} alt="Cropped Preview" className="absolute inset-0 w-full h-full object-cover rounded-lg" />
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <ImageIcon className="h-8 w-8" />
                  <span className="text-sm font-medium">Upload thumbnail</span>
                  <span className="text-xs">Click to browse</span>
                </div>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={isUploading} />
            </label>
          )}

          {isCropping && (
            <div className="w-full flex flex-col items-center">
              <h3 className="text-md font-medium mb-2">Crop Image</h3>
              <ReactCrop
                src={selectedFile}
                crop={crop}
                onChange={setCrop}
                onComplete={handleCropComplete}
                className="max-w-full"
              >
                <img src={selectedFile} alt="Crop Preview" />
              </ReactCrop>

              <div className="flex justify-between w-full mt-4">
                <Button className="bg-red-700 hover:bg-red-800" onClick={() => setIsCropping(false)}>Cancel</Button>
                <Button onClick={handleSaveCrop}>Save Crop</Button>
              </div>
            </div>
          )}

          {croppedPreview && ( 
            <Button
              type="button"
              variant="outline"
              className="shrink-0 mt-4"
              onClick={handleUpload}
              disabled={!finalImage}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          )}
        </>
      )}
    </div>
  );
}

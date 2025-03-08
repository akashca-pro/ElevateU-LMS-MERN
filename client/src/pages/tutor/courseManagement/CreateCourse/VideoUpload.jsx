import { Button } from "@/components/ui/button";
import { videoUpload } from "@/services/Cloudinary/videoUpload";
import { X, FileVideo, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

export const VideoUpload = ({ value, onChange, onRemove }) => {
  const [preview, setPreview] = useState("");
  const [isUploaded,setIsUploaded] = useState(false)
  const [videoFile,setVideoFile] = useState(null)
  const fileInputRef = useRef(null); // Reference to the hidden file input

  const handleAdd = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoFile(file)

    const videoUrl = URL.createObjectURL(file);
    setPreview(videoUrl);
    setIsUploaded(false)
  };

  const handleRemove = () => {
    setPreview("");
    onRemove();
    setIsUploaded(false)

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {

    const toastId = toast.loading('uploading . . .') 

    try {
      const { uploadedVideoeUrl } = await videoUpload(videoFile)
      toast.success('Video uploaded',{id : toastId})
      setPreview(uploadedVideoeUrl)
      onChange(uploadedVideoeUrl)
      setIsUploaded(true)

    } catch (error) {
      console.error("Upload failed", error);
      setPreview(preview)
      toast.error('Video upload failed',{id : toastId})
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Video preview (if available) */}
      {preview && (
        <div className="relative">
          <video src={preview} controls className="w-full rounded-md object-cover" />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* File upload options */}
      <div className="flex gap-2">
        {/* Hidden file input */}
        <input
          type="file"
          accept="video/*"
          onChange={handleAdd}
          ref={fileInputRef}
          hidden
        />

        {/* Button to trigger file selection */}
        <Button
          type="button"
          variant="outline"
          className="shrink-0"
          onClick={() => fileInputRef.current?.click()}
        >
          <FileVideo className="h-4 w-4 mr-2" />
          {!preview ? 'Add ' : 'Change '}
        </Button>

        {/* Upload Button */}
        <Button
          type="button"
          variant="outline"
          className="shrink-0"
          onClick={handleUpload}
          disabled={!preview || isUploaded} 
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload
        </Button>
      </div>
    </div>
  );
};

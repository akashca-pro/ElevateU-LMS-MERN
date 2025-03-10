import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileIcon, Paperclip, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { fileUpload, generateFileUrl } from "@/services/Cloudinary/fileUpload";


export function FileUpload({ value = [], onChange, multiple = false , disabled = false}) {
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(true);
  const [fileList, setFileList] = useState([]);

  // Load existing files (Cloudinary URLs) when component mounts
  useEffect(() => {
    if (value.length > 0) {
      const fileLink = value.map(file=>generateFileUrl(file))
      setFileList(fileLink);
    }
  }, [value]);

  const handleAdd = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setFileList((prev) => [...prev, ...files]);
    setIsUploaded(false);
  };

  const removeFile = (index) => {
    setFileList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    setIsUploading(true);
    const toastId = toast.loading("Uploading...");

    try {
      const newFiles = fileList.filter((file) => typeof file !== "string"); // Only new files
      if (newFiles.length > 0) {
        const uploadedFiles = await Promise.all(newFiles.map((file) => fileUpload(file)));
        const uploadedUrls = uploadedFiles.map((result) => result.public_id);
        onChange([...value, ...uploadedUrls]); // Keep previous URLs + new ones
      }
      toast.success("All attachments uploaded", { id: toastId });
      setIsUploaded(true);
      setIsUploading(false);
    } catch (error) {
      toast.error("Upload failed", { id: toastId });
      console.error("Error uploading files:", error);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {fileList.map((file, index) => (
          <div key={index} className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2 text-sm">
            {typeof file === "string" ? (
              // Display Cloudinary URL as a link
              <a href={file} target="_blank" rel="noopener noreferrer" className="truncate max-w-[150px]">
                {value[index]}
              </a>
            ) : (
              // Show newly selected file names
              <>
                <FileIcon className="h-4 w-4" />
                <span className="truncate max-w-[150px]">{file.name}</span>
              </>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-5 w-5 rounded-full"
              onClick={() => removeFile(index)}
              disabled = {disabled}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <label className="flex cursor-pointer items-center gap-2 rounded-md border bg-muted/30 px-3 py-2 text-sm hover:bg-muted/50">
          <Paperclip className="h-4 w-4" />
          <span>{'Add Attachments'}</span>
          <input type="file" className="hidden" onChange={handleAdd} disabled={isUploading || disabled} multiple={multiple} />
        </label>
        <Button onClick={handleUpload} 
        disabled={isUploading || isUploaded || disabled} 
        variant="outline">
          <Upload className="h-4 w-4" />
          <span>Upload</span>
        </Button>
      </div>
    </div>
  );
}
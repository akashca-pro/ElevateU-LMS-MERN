import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileIcon, Paperclip, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { fileUpload, generateFileUrl } from "@/services/Cloudinary/fileUpload";
import { Input } from "@/components/ui/input";

export function FileUpload({ 
  value = [], 
  onChange, 
  multiple = false, 
  disabled = false 
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [fileList, setFileList] = useState([]);

  // Initialize with existing attachments
  useEffect(() => {
    if (value && value.length > 0) {
      setFileList(value);
    }
  }, [value]);

  const handleAdd = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Add new files with empty titles
    const newFiles = files.map(file => ({
      file, // Store the File object
      title: "", // Initialize with empty title
      link: null // No link yet
    }));

    setFileList(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index) => {
    setFileList(prev => prev.filter((_, i) => i !== index));
  };

  const updateTitle = (index, title) => {
    setFileList(prev => {
      const newList = [...prev];
      newList[index].title = title;
      return newList;
    });
  };

  const handleUpload = async () => {
    if (fileList.length === 0) return;
    
    setIsUploading(true);
    const toastId = toast.loading("Uploading attachments...");

    try {
      // Separate existing links and files to upload
      const existingAttachments = fileList.filter(item => item.link);
      const filesToUpload = fileList.filter(item => item.file && !item.link);

      // Upload new files
      const uploadedAttachments = await Promise.all(
        filesToUpload.map(async (item) => {
          const uploadResult = await fileUpload(item.file);
          return {
            link: uploadResult.public_id,
            title: item.title || item.file.name // Use title or fallback to filename
          };
        })
      );

      // Combine existing and new attachments
      const allAttachments = [
        ...existingAttachments.map(({ link, title }) => ({ link, title })),
        ...uploadedAttachments
      ];

      onChange(allAttachments);
      toast.success("Attachments uploaded successfully", { id: toastId });
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload attachments", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* File list display */}
      <div className="space-y-2">
        {fileList.map((item, index) => (
          <div key={index} className="flex items-start gap-3 p-3 border rounded-md">
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <FileIcon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">
                  {item.link ? item.link : item.file?.name}
                </span>
              </div>
              
              <Input
                placeholder="Enter title"
                value={item.title || ""}
                onChange={(e) => updateTitle(index, e.target.value)}
                disabled={isUploading || disabled || !!item.link}
                className="w-full"
              />
              
              {item.link && (
                <a 
                  href={generateFileUrl(item.link)} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500 hover:underline"
                >
                  View file
                </a>
              )}
            </div>
            
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => removeFile(index)}
              disabled={isUploading || disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <label className={
          `flex items-center gap-2 px-3 py-2 border rounded-md cursor-pointer 
          ${(isUploading || disabled) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted/50'}`
        }>
          <Paperclip className="h-4 w-4" />
          <span>Add Files</span>
          <Input 
            type="file" 
             accept=".pdf,.doc,.docx,.ppt,.pptx,.html,.txt,.md,.zip"
            className="hidden" 
            onChange={handleAdd} 
            disabled={isUploading || disabled} 
            multiple={true}
          />
        </label>
        
        <Button 
          onClick={handleUpload}
          disabled={
            isUploading || 
            disabled || 
            fileList.length === 0 || 
            fileList.every(item => item.link) // All files already uploaded
          }
          variant="outline"
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          <span>Upload</span>
        </Button>
      </div>
    </div>
  );
}
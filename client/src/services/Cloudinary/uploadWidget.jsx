import { useState } from "react";

const UploadWidget = ({ onUpload }) => {
  const [uploading, setUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET_CODE); 
    formData.append("folder", "courses");
    formData.append("resource_type", "video"); // Set to video upload

    try {
      const response = await fetch(
        import.meta.env.VITE_CLOUDINARY_BASE_API_VIDEO_URL, 
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      
      // Transform the video URL
      const transformedUrl = `${import.meta.env.VITE_CLOUDINARY_BASE_API_VIDEO_URL}/q_auto:low,w_720,h_480,c_fill,f_auto/${data.public_id}.mp4`;

      setVideoUrl(transformedUrl); // Store the transformed video URL
      onUpload(transformedUrl); // Send transformed URL to parent component
    } catch (error) {
      console.error("Upload Error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <input type="file" accept="video/*" onChange={handleUpload} className="hidden" id="fileUpload" />
      <label htmlFor="fileUpload" className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer">
        {uploading ? "Uploading..." : "Upload Video"}
      </label>

      {/* Video Preview */}
      {videoUrl && (
        <video controls className="w-64 h-40 rounded-lg">
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
};

export default UploadWidget;
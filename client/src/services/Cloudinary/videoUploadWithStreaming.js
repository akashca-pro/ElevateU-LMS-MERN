export const videoUpload = async (file) => {
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET_CODE);
      data.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
      data.append("resource_type", "video"); 
      data.append("eager_async", "true"); 
      
      // Correct eager transformations format
      data.append("eager", JSON.stringify([
        {
          transformation: [
            { streaming_profile: "sd", format: "m3u8" },
            { quality: "auto" }
          ]
        },
        {
          transformation: [
            { streaming_profile: "hd", format: "m3u8" },
            { quality: "auto" }
          ]
        },
        {
          transformation: [
            { streaming_profile: "full_hd", format: "m3u8" },
            { quality: "auto" }
          ]
        }
      ]));
  
      const res = await fetch(import.meta.env.VITE_CLOUDINARY_BASE_API_VIDEO_URL, {
        method: "POST",
        body: data,
      });
  
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error.message);
      }
  
      const uploadedVideo = await res.json();
  
      return {
        publicId: uploadedVideo.public_id,
        sdUrl: uploadedVideo.eager[0]?.secure_url,
        hdUrl: uploadedVideo.eager[1]?.secure_url,
        fullHdUrl: uploadedVideo.eager[2]?.secure_url,
        originalUrl: uploadedVideo.secure_url,
        thumbnailUrl: uploadedVideo.thumbnail_url,
        duration: uploadedVideo.duration
      };
      
    } catch (error) {
      console.error("Video upload failed:", error);
      throw new Error(`Video upload failed: ${error.message}`);
    }
  };
  
  export const generateVideoUrl = (publicId, profile = "hd") => {
    return `https://res.cloudinary.com/${
      import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    }/video/upload/sp_${profile},fl_streaming_attachment/${publicId}.m3u8`;
  };
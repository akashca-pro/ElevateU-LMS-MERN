import { useEffect, useRef } from "react";

const VideoPlayer = ({ videoUrl, preview, className="w-full rounded-md object-cover" }) => {
  const cloudinaryRef = useRef();
  const videoRef = useRef();

  useEffect(() => {
    if(!videoUrl) return
    if (cloudinaryRef.current) return;
    
    cloudinaryRef.current = window.cloudinary;
    cloudinaryRef.current.videoPlayer(videoRef.current, {
      cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
      source: videoUrl, 
      controls: true,
      autoplay: false
    });
  }, [videoUrl]);

  return <video 
          ref={videoRef} 
          className={className} 
          { ...(preview ? { src : preview , controls : true } : {} ) } 
          />;
};

export default VideoPlayer;
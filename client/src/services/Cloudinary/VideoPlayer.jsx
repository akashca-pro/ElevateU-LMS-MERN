import { useEffect, useRef } from "react";

const VideoPlayer = ({ videoUrl, preview }) => {
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
          className="w-full rounded-md object-cover" 
          { ...(preview ? { src : preview , controls : true } : {} ) } 
          />;
};

export default VideoPlayer;
import { useEffect, useRef } from "react";

const VideoPlayer = ({ publicId }) => {
  const cloudinaryRef = useRef();
  const videoRef = useRef();

  useEffect(() => {
    if (cloudinaryRef.current) return;
    
    cloudinaryRef.current = window.cloudinary;
    cloudinaryRef.current.videoPlayer(videoRef.current, {
      cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
      public_id: publicId, // Pass the video public ID
      controls: true,
      autoplay: false
    });
  }, [publicId]);

  return <video ref={videoRef} className="cld-video-player" />;
};

export default VideoPlayer;

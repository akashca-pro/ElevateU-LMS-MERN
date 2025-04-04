import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, VolumeX, Maximize, CheckCircle, SkipForward, Settings, RotateCcw } from "lucide-react"

const VideoPlayer = ({ lesson, onComplete, isCompleted }) => {
  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)

  // Control visibility timer
  let controlsTimer = null


  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.pause(); 
      video.load();
      setCurrentTime(0);
      setIsPlaying(false);
    }
  }, [lesson]);

  // Initialize video
  useEffect(() => {
    const video = videoRef.current

    if (video) {
      // Set up event listeners
      video.addEventListener("timeupdate", handleTimeUpdate)
      video.addEventListener("loadedmetadata", handleLoadedMetadata)
      video.addEventListener("ended", handleVideoEnded)

      // Clean up
      return () => {
        video.removeEventListener("timeupdate", handleTimeUpdate)
        video.removeEventListener("loadedmetadata", handleLoadedMetadata)
        video.removeEventListener("ended", handleVideoEnded)
      }
    }
  }, [lesson])

  // Handle mouse movement to show/hide controls
  useEffect(() => {
    const container = containerRef.current

    const handleMouseMove = () => {
      setShowControls(true)

      // Clear existing timer
      if (controlsTimer) {
        clearTimeout(controlsTimer)
      }

      // Set new timer to hide controls after 3 seconds
      controlsTimer = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false)
        }
      }, 3000)
    }

    const handleMouseLeave = () => {
      if (isPlaying) {
        setShowControls(false)
      }
    }

    if (container) {
      container.addEventListener("mousemove", handleMouseMove)
      container.addEventListener("mouseleave", handleMouseLeave)

      return () => {
        container.removeEventListener("mousemove", handleMouseMove)
        container.removeEventListener("mouseleave", handleMouseLeave)
        if (controlsTimer) {
          clearTimeout(controlsTimer)
        }
      }
    }
  }, [isPlaying])

  // Handle time update
  const handleTimeUpdate = () => {
    const video = videoRef.current
    if (video) {
      setCurrentTime(video.currentTime)
    }
  }

  // Handle loaded metadata
  const handleLoadedMetadata = () => {
    const video = videoRef.current
    if (video) {
      setDuration(video.duration)
    }
  }

  // Handle video ended
  const handleVideoEnded = () => {
    setIsPlaying(false)
    if (!isCompleted) {
      onComplete()
    }
  }

  // Toggle play/pause
  const togglePlay = () => {
    const video = videoRef.current
    if (video) {
      if (isPlaying) {
        video.pause()
      } else {
        video.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Handle seek
  const handleSeek = (value) => {
    const video = videoRef.current
    if (video) {
      video.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  // Toggle mute
  const toggleMute = () => {
    const video = videoRef.current
    if (video) {
      video.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  // Handle volume change
  const handleVolumeChange = (value) => {
    const video = videoRef.current
    if (video) {
      video.volume = value[0]
      setVolume(value[0])
      if (value[0] === 0) {
        setIsMuted(true)
        video.muted = true
      } else if (isMuted) {
        setIsMuted(false)
        video.muted = false
      }
    }
  }

  // Toggle fullscreen
  const toggleFullscreen = () => {
    const container = containerRef.current

    if (!document.fullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen()
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen()
      } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen()
      }
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
      setIsFullscreen(false)
    }
  }

  // Format time (seconds to MM:SS)
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = Math.floor(timeInSeconds % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  // Skip forward 10 seconds
  const skipForward = () => {
    const video = videoRef.current
    if (video) {
      video.currentTime = Math.min(video.duration, video.currentTime + 10)
    }
  }

  // Skip backward 10 seconds
  const skipBackward = () => {
    const video = videoRef.current
    if (video) {
      video.currentTime = Math.max(0, video.currentTime - 10)
    }
  }

  return (
    <div ref={containerRef} className="relative w-full aspect-video bg-black overflow-hidden group">
      {/* Video Element */}
      <video
        key={lesson.videoUrl}
        ref={videoRef}
        className="w-full h-full object-contain"
        onClick={togglePlay}
        poster="/placeholder.svg?height=720&width=1280&text=Video+Thumbnail"
      >
        <source src={lesson.videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Completed Indicator */}
      {isCompleted && (
        <div className="absolute top-4 right-4 z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="bg-green-500 text-white rounded-full p-1"
          >
            <CheckCircle className="h-5 w-5" />
          </motion.div>
        </div>
      )}

      {/* Play/Pause Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={togglePlay}
            className="bg-primary text-white rounded-full p-4"
          >
            <Play className="h-8 w-8 fill-current" />
          </motion.button>
        </div>
      )}

      {/* Video Controls */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-6 z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: showControls ? 1 : 0,
          y: showControls ? 0 : 20,
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Progress Bar */}
        <div className="mb-3">
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Play/Pause Button */}
            <Button variant="ghost" size="icon" onClick={togglePlay} className="h-8 w-8 text-white hover:bg-white/20">
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>

            {/* Skip Backward */}
            <Button variant="ghost" size="icon" onClick={skipBackward} className="h-8 w-8 text-white hover:bg-white/20">
              <RotateCcw className="h-4 w-4" />
            </Button>

            {/* Skip Forward */}
            <Button variant="ghost" size="icon" onClick={skipForward} className="h-8 w-8 text-white hover:bg-white/20">
              <SkipForward className="h-4 w-4" />
            </Button>

            {/* Volume Controls */}
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleMute} className="h-8 w-8 text-white hover:bg-white/20">
                {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>

              <div className="w-20">
                <Slider
                  value={[isMuted ? 0 : volume]}
                  min={0}
                  max={1}
                  step={0.1}
                  onValueChange={handleVolumeChange}
                  className="cursor-pointer"
                />
              </div>
            </div>

            {/* Time Display */}
            <div className="text-white text-xs">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Settings Button */}
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20">
              <Settings className="h-4 w-4" />
            </Button>

            {/* Fullscreen Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="h-8 w-8 text-white hover:bg-white/20"
            >
              <Maximize className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default VideoPlayer
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileIcon, Paperclip, X } from "lucide-react"

/**
 * @param {Object} props
 * @param {string[]} props.value
 * @param {(urls: string[]) => void} props.onChange
 * @param {boolean} [props.multiple=false]
 */
export function FileUpload({ value, onChange, multiple = false }) {
  const [isUploading, setIsUploading] = useState(false)

  // This is a mock function - in a real app, you would upload to your storage service
  const handleUpload = async (e) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    try {
      setIsUploading(true)
      // Mock upload - in a real app, you would upload to your storage service
      // and get back URLs
      setTimeout(() => {
        // Simulate getting back URLs
        const newUrls = Array.from(files).map(
          (file) => `/placeholder.svg?height=50&width=50&text=${encodeURIComponent(file.name)}`,
        )

        if (multiple) {
          onChange([...value, ...newUrls])
        } else {
          onChange(newUrls)
        }

        setIsUploading(false)
      }, 1000)
    } catch (error) {
      console.error("Error uploading files:", error)
      setIsUploading(false)
    }
  }

  const removeFile = (index) => {
    const newUrls = [...value]
    newUrls.splice(index, 1)
    onChange(newUrls)
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {value.map((url, index) => (
          <div
            key={`${url}-${index}`}
            className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2 text-sm"
          >
            <FileIcon className="h-4 w-4" />
            <span className="truncate max-w-[150px]">Attachment {index + 1}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-5 w-5 rounded-full"
              onClick={() => removeFile(index)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>

      <label className="flex cursor-pointer items-center gap-2 rounded-md border bg-muted/30 px-3 py-2 text-sm hover:bg-muted/50">
        <Paperclip className="h-4 w-4" />
        <span>{isUploading ? "Uploading..." : "Upload attachments"}</span>
        <input type="file" className="hidden" onChange={handleUpload} disabled={isUploading} multiple={multiple} />
      </label>
    </div>
  )
}


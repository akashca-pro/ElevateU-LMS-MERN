import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { FileIcon, Paperclip, Upload, X } from "lucide-react"
import { toast } from "sonner"
import { fileUpload } from "@/services/Cloudinary/fileUpload"

/**
 * @param {Object} props
 * @param {string[]} props.value
 * @param {(urls: string[]) => void} props.onChange
 * @param {boolean} [props.multiple=false]
 */
export function FileUpload({ value, onChange, multiple = false }) {
  const [isUploading, setIsUploading] = useState(false)
  const [fileList,setFileList] = useState([])

  useEffect(()=>{
    console.log(fileList)
  },[fileList])


  const handleAdd =  (e) => {
    const files = e.target.files
    if (!files || files.length === 0) return

      if (multiple) {
          setFileList([...fileList, ...files])
        } else {
          setFileList(files)
        }
  }

  const removeFile = (index) => {
    const newFileList = [...fileList]
    newFileList.splice(index,1)
    setFileList(newFileList)
  }

  const handleUpload = async() =>{
    setIsUploading(true)
    const toastId = toast.loading('Uploading . . .')
   try {

    if(fileList.length > 0){
      const uploadedFiles = await Promise.all(fileList.map(file=> fileUpload(file)));
      const uploadedUrls = uploadedFiles.map((result)=> result.uploadedFileUrl );
      onChange(uploadedUrls);
    }
    toast.success('All attachments uploaded',{id : toastId})
    setIsUploading(false)
   } catch (error) {
    toast.error("Upload failed",{id : toastId});
    console.error("Error uploading files:", error);
   }

  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {fileList.map((url, index) => (
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

      <div className="flex gap-2">
      <label className="flex cursor-pointer items-center gap-2 rounded-md border bg-muted/30 px-3 py-2 text-sm hover:bg-muted/50">
        <Paperclip className="h-4 w-4" />
        <span>{'Add Attachments'}</span>
        <input type="file" className="hidden" onChange={handleAdd} disabled={isUploading} multiple={multiple} />
      </label>
      <Button 
      onClick = {handleUpload}
      disabled = {isUploading}
       variant = 'outline' >
        <Upload className="h-4 w-4" />
        <span>Upload</span>
      </Button>
      </div>
    </div>
  )
}


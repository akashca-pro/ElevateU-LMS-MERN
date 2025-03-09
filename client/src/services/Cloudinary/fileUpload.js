export const fileUpload = async(file) =>{
    const data = new FormData()
    data.append('file',file)
    data.append('upload_preset',import.meta.env.VITE_CLOUDINARY_PRESET_CODE)
    data.append('cloud_name',import.meta.env.VITE_CLOUDINARY_CLOUD_NAME)
    data.append("resource_type", "raw");

        const res = await fetch(import.meta.env.VITE_CLOUDINARY_BASE_API_FILE_URL,{
            method : 'POST',
            body : data
        })

        const uploadedFileUrl = await res.json()

        return {uploadedFileUrl : uploadedFileUrl.url}

}
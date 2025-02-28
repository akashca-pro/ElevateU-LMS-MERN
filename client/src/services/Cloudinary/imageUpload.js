export const imageUpload = async(file) =>{
    const data = new FormData()
    data.append('file',file)
    data.append('upload_preset',import.meta.env.VITE_CLOUDINARY_PRESET_CODE)
    data.append('cloud_name',import.meta.env.VITE_CLOUDINARY_CLOUD_NAME)

        const res = await fetch(import.meta.env.VITE_CLOUDINARY_BASE_API_URL,{
            method : 'POST',
            body : data
        })

        const uploadedImageUrl = await res.json()

        return {uploadedImageUrl : uploadedImageUrl.url}

}
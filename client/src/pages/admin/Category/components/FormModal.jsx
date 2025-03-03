import { useEffect, useState } from "react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { imageUpload } from "@/services/Cloudinary/imageUpload"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import {useAdminLoadCategoryQuery} from '@/services/adminApi/adminCategoryApi'


const FormModal = ({title, useCategory,style, type , name})=>{
    const [category] = useCategory()
    const { data } = useAdminLoadCategoryQuery(name, { skip: type !== 'edit' })
    const [isOpen, setIsOpen] = useState(false) 
    const [preview,setPreview] = useState(null)
    const [formData,setFormData] = useState({
        name : '',
        description :  '',
        icon : null,
        isActive : true
    }) 

    useEffect(() => {
        if (type === 'edit' && data) {
            setFormData({
                name: data.name || '',
                description: data.description || '',
                icon: data.icon || null,
                isActive: data.isActive ?? true
            })
            if (data.icon) setPreview(data.icon)
        }
    }, [data, type])




    const isFormChanged = data && (
        formData.name !== data.name ||
        formData.description !== data.description ||
        formData.isActive !== data.isActive ||
        (typeof formData.icon === "string" ? formData.icon !== data.icon : !!formData.icon) 
    );

    const isFormValid = formData?.name 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleCheckboxChange = (checked) => {
        setFormData({
            ...formData,
            isActive: checked
        })
    }

    const handleFileChange = (e) =>{
        const file = e.target.files[0];
        if(file) {
            setFormData({...formData , [e.target.name] : file})
            setPreview(URL.createObjectURL(file))
        }
    }
  

    const handleSubmit = async(e) =>{
        e.preventDefault()
        const toastId = toast.loading('Please Wait . . .')
       
        if(formData.icon){
            const {uploadedImageUrl} = await imageUpload(formData.icon)
            formData.icon = uploadedImageUrl
        }

       if(type === 'edit') formData.id = data?._id
        
        try {
            const response = await category(formData).unwrap()
            toast.success(response?.message || 'Category updated successfully',{id : toastId})
            setFormData({
                name: '',
                description: '',
                icon: null,
                isActive: true
            });
            setPreview(null);
            setIsOpen(false);
        } catch (error) {
            console.log(error)
            toast.error(error?.data?.message || 'Error creating Category ',{id : toastId})
        }

    }

    return (
       <Dialog open={isOpen} onOpenChange={setIsOpen} >
        <DialogTrigger asChild>
        <Button
         className={style} 
        >
        {title}
        </Button>
        </DialogTrigger>

        <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Enter the category details below.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter category name"
              required
            />
          </div>

          <div>
            <Label htmlFor="icon">Icon</Label>
            <Input
              type="file"
              id="icon"
              name='icon'
              accept="image/*"
              onChange={handleFileChange}
              placeholder="Enter category name"
            />
          </div>
          {preview && <img src={preview} alt="Icon Preview" className="mt-2 h-16 w-16 rounded " />}

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor="isActive">Is Active</Label>
        </div>

          <Button type="submit" 
          disabled = {type==='edit' ? !isFormChanged : !isFormValid} 
          className={`w-full  bg-primary text-white`}>Submit</Button>

        </form>

        </DialogContent>
       </Dialog>
    )
}

export default FormModal
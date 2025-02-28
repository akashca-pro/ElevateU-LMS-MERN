import { useState ,useEffect} from "react";
import { RefreshCw, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";;
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ProfileDialog } from "./ProfileDialog";
import useForm from "@/hooks/useForm";
import { imageUpload } from "@/services/Cloudinary/imageUpload";
import {useAdminLoadProfileQuery, useAdminUpdateProfileMutation} from '@/services/adminApi/adminProfileApi'
import {useAdminAuthActions} from '@/hooks/useDispatch'
import { toast } from "sonner";

const Index = () => {
  const {login} = useAdminAuthActions()
  const {data : adminDetails , error, isLoading} = useAdminLoadProfileQuery()
  const loadProfile = useAdminLoadProfileQuery()
  const [updateProfile] = useAdminUpdateProfileMutation()

  const [avatarPreview, setAvatarPreview] = useState(null);  
  const { formData, errors, handleChange ,setFormData} = useForm();


  useEffect(() => {
    if (adminDetails) {
      setFormData({
        firstName: adminDetails?.firstName || "",
        lastName: adminDetails?.lastName || "",
        profileImage: adminDetails?.profileImage || null, 
        email : adminDetails?.email || ""
      });
    }
  }, [adminDetails , loadProfile]);

  console.log('adminData',adminDetails)
  console.log('formdata',formData)


  const notValid = 
  Object.values(errors).some((err) => err) || 
  !formData.firstName || 
  !formData.lastName 
 

  
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        handleChange({ target: { name: "profileImage", value: file } }); // formData updates
      };
      reader.readAsDataURL(file);
    }
  };



  const isFormChanged =
  adminDetails &&
  Object.keys(formData).some((key) => formData[key] !== adminDetails[key]);



  const handleSubmit = async(e, closeDialog) => {
    e.preventDefault();
  
    const toastId = toast.loading(' updating data ...')

    if(formData.profileImage !== null){
      const {uploadedImageUrl} = await imageUpload(formData.profileImage);
      formData.profileImage = uploadedImageUrl
    }

   
    try {
      const response = await updateProfile(formData).unwrap()
      login(response)
      toast.success('Profile updated successfully',{ id: toastId })
    } catch (error) {
      console.log(error)
      toast.error('Updation Failed please try again later ...')
    }
    finally{
      if (closeDialog) closeDialog(); 
    }
    
  };

  return (
    <div className="max-w-4xl p-6">
      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6" id="profile-form">
          {/* Avatar Section */}
          <div className="mb-8">
            <Label className="block text-sm font-medium text-gray-700 mb-2">Your avatar</Label>
            <p className="text-sm text-gray-500 mb-4">PNG or JPG no bigger than 800px wide and tall.</p>
            <div className="flex items-center gap-4">
              <div className="relative">
              <img
                  src={
                    avatarPreview
                    || formData.profileImage 
                    || "/userProfileIcon.svg" // Default
                  }
                  alt="Avatar preview"
                  className="w-20 h-20 rounded-full object-cover"
                />
                <Input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" id="profileImage" />
              </div>
              <div className="flex gap-2">
                <Label
                  htmlFor="profileImage"
                  className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-200 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  Change
                </Label>
                <Button
                  type="button"
                  onClick={() => {
                    setAvatarPreview(null);
                    setFormData({...formData , profileImage : null})
                    handleChange({ target: { name: "profileImage", value: null } });
                  }}
                  className="flex items-center gap-2 px-3 py-2 border bg-gray-50 border-gray-300 rounded-md text-sm text-gray-700 hover:bg-red-600 hover:text-white"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </Button>
              </div>
            </div>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name & Last Name */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">First Name</Label>
              <Input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7454FD] focus:border-transparent"
                placeholder="First Name"
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Last Name</Label>
              <Input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7454FD] focus:border-transparent"
                placeholder="Last Name"
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Email</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7454FD] focus:border-transparent"
                placeholder="Email"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
             
          </div>
          {/* Submit Button */}
          <div>
          <ProfileDialog  notValid={notValid || !isFormChanged}
            btnName={"Save changes"}
            title={"Update profile details"}
            desc={`Make changes to your profile here. Click save when you're done.`}
            onSave={(closeDialog) => handleSubmit(event, closeDialog)} // Pass closeDialog
          />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Index

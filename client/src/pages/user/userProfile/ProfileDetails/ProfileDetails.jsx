import { useState ,useEffect} from "react";
import { RefreshCw, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ProfileDialog } from "./ProfileDialog";
import useForm from "@/hooks/useForm";
import { imageUpload } from "@/services/Cloudinary/imageUpload";
import {useUserLoadProfileQuery, useUserUpdateProfileMutation} from '@/services/userApi/userProfileApi'
import { formatDate } from "@/utils/dateToString";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

const ProfileDetails = () => {
  const {data : details , error, isLoading} = useUserLoadProfileQuery()
  const student = details?.data
  const loadProfile = useUserLoadProfileQuery()
  const [userUpdateProfile] = useUserUpdateProfileMutation()

  const [avatarPreview, setAvatarPreview] = useState(null);  
  const { formData, errors, handleChange ,setFormData} = useForm();

  useEffect(() => {
    if (student) {
      setFormData({
        firstName: student?.firstName || "",
        lastName: student?.lastName || "",
        phone: student?.phone || "",
        dob: formatDate(student.dob) || "",
        bio: student?.bio || "",
        profileImage: student?.profileImage || "", // Set profile image if available
      });
    }
  }, [student , loadProfile]);


  const notValid = 
  Object.values(errors).some((err) => err) || 
  !formData.firstName || 
  !formData.lastName || 
  !formData.phone || 
  !formData.dob

  
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
  student &&
  Object.keys(formData).some((key) => formData[key] !== student[key]);



  const handleSubmit = async(e, closeDialog) => {
    e.preventDefault();
  
    const toastId = toast.loading(' updating data ...')

    if(formData.profileImage !== null){
      const {uploadedImageUrl} = await imageUpload(formData.profileImage);
      formData.profileImage = uploadedImageUrl
    }


    const payload = {
      id : student._id ,
      credentials : formData
    }

    try {
      await userUpdateProfile(payload).unwrap()
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
    <div className="flex justify-center p-4">
      <Card className="w-full max-w-6xl p-8 bg-white shadow-lg rounded-lg">
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

            {/* Phone & Birthday */}
            <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">Phone</Label>
            <Input
            id="phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            pattern="[0-9]{10}" // Ensures only 10-digit numbers
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7454FD] focus:border-transparent"
            placeholder="Enter 10-digit phone number"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>} 
          </div>
          
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Birthday</Label>
              <Input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7454FD] focus:border-transparent"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">Bio</Label>
            <Textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7454FD] focus:border-transparent"
              placeholder="Tell us about yourself..."
            />
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
    </Card>
    </div>
    
  );
};

export default ProfileDetails;
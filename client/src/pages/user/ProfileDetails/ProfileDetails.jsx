
import { useState, useEffect } from "react";
import { RefreshCw, Trash2, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ProfileDialog } from "./ProfileDialog";
import useForm from "@/hooks/useForm";
import { imageUpload } from "@/services/Cloudinary/imageUpload";
import { useUserLoadProfileQuery, useUserUpdateProfileMutation } from '@/services/userApi/userProfileApi';
import { formatDate } from "@/utils/dateToString";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import LoadingSpinner from "@/components/FallbackUI/LoadingSpinner";

const ProfileDetails = () => {
  const { data: details, error, isLoading } = useUserLoadProfileQuery();
  const student = details?.data;
  const loadProfile = useUserLoadProfileQuery();
  const [userUpdateProfile] = useUserUpdateProfileMutation();

  const [avatarPreview, setAvatarPreview] = useState(null);  
  const { formData, errors, handleChange, setFormData } = useForm();

  useEffect(() => {
    if (student) {
      setFormData({
        firstName: student?.firstName || "",
        lastName: student?.lastName || "",
        phone: student?.phone || "",
        dob: formatDate(student.dob) || "",
        bio: student?.bio || "",
        profileImage: student?.profileImage || "",
      });
    }
  }, [student, loadProfile]);

  const notValid = 
    Object.values(errors).some((err) => err) || 
    !formData.firstName || 
    !formData.lastName || 
    !formData.phone || 
    !formData.dob;

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        handleChange({ target: { name: "profileImage", value: file } });
      };
      reader.readAsDataURL(file);
    }
  };

  const isFormChanged =
    student &&
    Object.keys(formData).some((key) => formData[key] !== student[key]);

  const handleSubmit = async(e, closeDialog) => {
    e.preventDefault();
  
    const toastId = toast.loading('Updating data...');

    if(formData.profileImage !== null){
      const {uploadedImageUrl} = await imageUpload(formData.profileImage);
      formData.profileImage = uploadedImageUrl;
    }

    const payload = {
      id: student._id,
      credentials: formData
    };

    try {
      await userUpdateProfile(payload).unwrap();
      toast.success('Profile updated successfully', { id: toastId });
    } catch (error) {
      error?.data?.errors?.forEach(m=>{
        toast.dismiss(toastId)
        toast.error(m?.msg || 'Updation failed');
      })
    } finally {
      if (closeDialog) closeDialog();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Card className="w-full bg-white shadow-md rounded-xl overflow-hidden border-0">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 pb-8">
        <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">Personal Information</CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-300">
          Update your personal details and how others see you on the platform
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6 md:p-8 pt-0 -mt-6">
        <div className="bg-white dark:bg-gray-800 rounded-t-xl shadow-sm p-6 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8" id="profile-form">
            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-700 shadow-lg overflow-hidden">
                  {(avatarPreview || formData.profileImage) ? (
                    <img
                      src={avatarPreview || formData.profileImage}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-100 dark:bg-gray-700">
                      <User className="w-12 h-12 text-blue-500 dark:text-gray-400" />
                    </div>
                  )}
                </div>
                <Input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" id="profileImage" />
              </div>
              
              <div className="flex-grow space-y-3">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">Profile Photo</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">PNG or JPG no bigger than 800px wide and tall.</p>
                <div className="flex flex-wrap gap-3 mt-3">
                  <Label
                    htmlFor="profileImage"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Change
                  </Label>
                  <Button
                    type="button"
                    onClick={() => {
                      setAvatarPreview(null);
                      setFormData({...formData, profileImage: null});
                      handleChange({ target: { name: "profileImage", value: null } });
                    }}
                    variant="outline"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-red-50 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </Button>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-6">Basic Information</h3>
              
              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                {/* First Name & Last Name */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">First Name</Label>
                  <Input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                    placeholder="First Name"
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</Label>
                  <Input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                    placeholder="Last Name"
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>

                {/* Phone & Birthday */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    pattern="[0-9]{10}"
                    className="w-full border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                    placeholder="Enter 10-digit phone number"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>} 
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Birthday</Label>
                  <Input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="mt-8 space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bio</Label>
                <Textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent resize-none transition-all"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-100 dark:border-gray-700">
              <ProfileDialog
                notValid={notValid || !isFormChanged}
                btnName="Save changes"
                title="Update profile details"
                desc="Make changes to your profile here. Click save when you're done."
                onSave={(closeDialog) => handleSubmit(event, closeDialog)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              />
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileDetails;

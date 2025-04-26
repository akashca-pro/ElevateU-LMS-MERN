
import { useState, useEffect } from "react";
import { RefreshCw, Trash2, CircleCheckBig } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ProfileDialog } from "./components/ProfileDialog";
import useForm from "@/hooks/useForm";
import { imageUpload } from "@/services/Cloudinary/imageUpload";
import { useTutorLoadProfileQuery, useTutorUpdateProfileMutation } from '@/services/TutorApi/tutorProfileApi';
import { formatDate } from "@/utils/dateToString";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { SelectExperience } from "./components/SelectExperience";
import Tooltip from "./components/Tooltip";
import { useTutorRequestVerificationMutation } from '@/services/TutorApi/tutorProfileApi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const ProfileDetails = () => {
  const { data: details, isLoading } = useTutorLoadProfileQuery();
  const teacher = details?.data;
  const [tutorUpdateProfile] = useTutorUpdateProfileMutation();
  const [requestVerification] = useTutorRequestVerificationMutation();

  const [expertise, setExpertise] = useState([]);
  const [input, setInput] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);  
  const { formData, errors, handleChange, setFormData } = useForm();

  // Function to add expertise
  const addExpertise = (e) => {
    if (e.key === 'Enter' && input.trim() !== '') {
      e.preventDefault();
      if (expertise.length === 10) {
        toast.info('10 is the limit');
        return;
      }
      const updatedExpertise = [...expertise, input.trim()];
      setExpertise(updatedExpertise);
      setFormData((prev) => ({ ...prev, expertise: updatedExpertise }));
      setInput('');
    }    
  };

  const handleAddTag = (e) =>{
    e.preventDefault();
    if(input.trim() === '') return 
    const updatedExpertise = [...expertise, input.trim()];
    setExpertise(updatedExpertise);
    setFormData((prev) => ({ ...prev, expertise: updatedExpertise }));
    setInput('');
  }

  // Function to remove tag in expertise
  const handleRemoveTag = (e) => {
    e.preventDefault();
    const updatedExpertise = expertise.slice(0, -1);
    setExpertise(updatedExpertise);
    setFormData((prev) => ({ ...prev, expertise: updatedExpertise }));
  };

  // Every time API fetch happens data is stored in the form data
  useEffect(() => {
    if (teacher !== undefined) {
      setFormData({
        firstName: teacher?.firstName || "",
        lastName: teacher?.lastName || "",
        phone: teacher?.phone || "",
        dob: formatDate(teacher.dob) || "",
        bio: teacher?.bio || "",
        profileImage: teacher?.profileImage || null, 
        expertise: teacher?.expertise || [],
        experience: teacher?.experience
      });
      if (teacher.expertise.length !== 0) setExpertise([...teacher.expertise]);
    }
  }, [teacher, setFormData]);

  // Form validation
  const notValid = 
    Object.values(errors).some((err) => err) || 
    !formData.firstName || 
    !formData.lastName || 
    !formData.phone || 
    !formData.dob;
  
  // Avatar change handler
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

  // Check if form is changed
  const isEqualArray = (arr1, arr2) => {
    return arr1.length === arr2.length && arr1.every((val, index) => val === arr2[index]);
  };

  const isFormChanged =
    teacher &&
    Object.keys(formData).some((key) => 
      Array.isArray(formData[key]) && Array.isArray(teacher[key])  
      ? !isEqualArray(formData[key], teacher[key])
      : formData[key] !== teacher[key]);
  
  const isDataUpdated = teacher?.firstName 
    && teacher?.lastName
    && teacher?.phone 
    && teacher?.dob 
    && teacher?.experience
    && teacher?.expertise;

  // Form submission handler
  const handleSubmit = async(e, closeDialog) => {
    e.preventDefault();
    
    const toastId = toast.loading('Updating data...');

    if (formData.profileImage !== null && formData.profileImage instanceof File) {
      const { uploadedImageUrl } = await imageUpload(formData.profileImage);
      formData.profileImage = uploadedImageUrl;
    }

    try {
      await tutorUpdateProfile(formData).unwrap();
      toast.success('Profile updated successfully', { id: toastId });
    } catch (error) {
      console.log(error);
      error?.data?.errors?.forEach(m=>{
        toast.dismiss(toastId)
        toast.error(m?.msg || 'Updation failed');
      })
    } finally {
      if (closeDialog) closeDialog();
    }
  };

  // Verification request handler
  const handleVerificationRequest = async(e) => {
    e.preventDefault();
    const toastId = toast.loading('Please wait...');
    try {
      await requestVerification(teacher._id).unwrap();
      toast.success('Verification request submitted', { id: toastId });
      setTimeout(() => { toast.info('Track verification status in notification section'); }, 2500);
    } catch (error) {
      toast.error(error?.data?.message || "Verification request failed. Try again later.", { id: toastId });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
 
  return (
    <div className="flex justify-center p-4">
      <Card className="w-full bg-white shadow-md rounded-xl overflow-hidden border-0">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 pb-8">
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">Tutor Profile</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Update your profile details and teaching qualifications
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6 md:p-8 pt-0 -mt-6">
          <div className="bg-white dark:bg-gray-800 rounded-t-xl shadow-sm p-6 space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8" id="profile-form">
              {/* Avatar Section */}
              <div className="mb-8">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={
                        avatarPreview
                        || formData.profileImage 
                        || "/userProfileIcon.svg" // Default
                      }
                      alt="Avatar preview"
                      className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                    />
                    {teacher?.isAdminVerified 
                    ? <Label className="absolute -bottom-2 -right-2 flex gap-2">
                        <CircleCheckBig color="#008000"/> 
                      </Label>
                    : <Tooltip/>
                    }
                    <Input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" id="profileImage" />
                  </div>
                  <div className="flex flex-wrap gap-3 mt-3">
                    <Label
                      htmlFor="profileImage"
                      className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors cursor-pointer"
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
                      className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-red-50 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-6">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </div>

              <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Areas of Expertise</h3>
                
                <div className="flex flex-wrap gap-2">
                  {expertise.map((tag, index) => (
                    <Badge 
                      key={index} 
                      className="bg-secondary text-white px-2 py-2 rounded"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Input
                    id="expertise"
                    name="expertise"
                    type="text"
                    placeholder="Type & press Enter to add expertise (e.g. Web Developer)"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={addExpertise}
                    className="w-full md:w-2/3 border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                  <Button
                  onClick={handleAddTag}
                  className='flex items-center gap-2 px-3 py-2'
                  >
                    Add
                  </Button>
                  <Button 
                    onClick={handleRemoveTag} 
                    className="flex items-center gap-2 px-3 py-2 border bg-gray-50 border-gray-300 rounded-md text-sm text-gray-700 hover:bg-red-600 hover:text-white"
                  >
                    Remove Last
                  </Button>
                </div>
              </div>

              <div>
                <SelectExperience 
                  value={formData?.experience} 
                  onSelectExperience={(value) => setFormData((prev) => ({...prev, experience: value}))}
                />
              </div>

              <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
                <div className="space-y-2">
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
                <div className="flex flex-wrap gap-2">
                  <ProfileDialog 
                    notValid={notValid || !isFormChanged}
                    btnName="Save changes"
                    title="Update profile details"
                    desc="Make changes to your profile here. Click save when you're done."
                    onSave={(closeDialog) => handleSubmit(event, closeDialog)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  />
                  
                  {!teacher?.isAdminVerified && 
                    <Button 
                      disabled={!isDataUpdated}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={handleVerificationRequest}
                    >
                      {teacher?.status === 'pending' ? 'Check verification status' : 'Request verification'}
                    </Button>
                  }
                </div>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileDetails;
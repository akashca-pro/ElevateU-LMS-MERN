import { useState ,useEffect} from "react";
import { RefreshCw, Trash2, CircleCheckBig, ShieldAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ProfileDialog } from "./components/ProfileDialog";
import useForm from "@/hooks/useForm";
import { imageUpload } from "@/services/Cloudinary/imageUpload";
import {useTutorLoadProfileQuery , useTutorUpdateProfileMutation} from '@/services/TutorApi/tutorProfileApi'
import { useSelect } from "@/hooks/useSelect";
import { formatDate } from "@/utils/dateToString";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { SelectExperience } from "./components/SelectExperience";
import Tooltip from "./components/Tooltip";
import {useTutorRequestVerificationMutation} from '@/services/TutorApi/tutorProfileApi'
import { Card } from "@/components/ui/card";


const ProfileDetails = () => {
  const {tutor} = useSelect()

  const {data : details } = useTutorLoadProfileQuery()
  const teacher = details?.data
  const [tutorUpdateProfile] = useTutorUpdateProfileMutation()
  const [requestVerification] = useTutorRequestVerificationMutation()

  const [expertise,setExpertise] = useState([])
  const [input,setInput] = useState('');

  const [avatarPreview, setAvatarPreview] = useState(null);  
  const { formData, errors, handleChange ,setFormData} = useForm();

  // function to add expertise 

  const addExpetise = (e) =>{
      if(e.key === 'Enter' && input.trim !== ''){
        e.preventDefault()
        if(expertise.length === 10){toast.info('10 is the limit'); return } 
        const updatedExpertise = [...expertise, input.trim() ]
        setExpertise(updatedExpertise)
        setFormData((prev)=> ({...prev, expertise : updatedExpertise}))
        setInput('');
      }    
  }

  // function to remove tag in expetise
  const handleRemoveTag = (e)=>{
      e.preventDefault()
      const updatedExpertise = expertise.slice(0, -1);
      setExpertise(updatedExpertise);
      setFormData((prev) => ({ ...prev, expertise: updatedExpertise }));
  }

// every time api fetch happens data is stored in the form data 
  useEffect(() => {
    if (teacher) {
      setFormData({
        firstName: teacher?.firstName || "",
        lastName: teacher?.lastName || "",
        phone: teacher?.phone || "",
        dob: formatDate(teacher.dob) || "",
        bio: teacher?.bio || "",
        profileImage: teacher?.profileImage || null, 
        expertise : teacher?.expertise || [],
        experience : teacher?.experience
      });
      if(teacher.expertise.length !== 0) setExpertise([...teacher.expertise])
    }
  }, [teacher]);

// check current formdata and api fetched data is same or not, inorder to ensure errorless update disables the button

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

 

  // this is to avoid duplicate update , disables button 
  //  addition function is used because one of the field is an array

  const isEqualArray = (arr1,arr2) =>{
    return arr1.length === arr2.length && arr1.every((val,index)=>val === arr2[index]);
  }

  const isFormChanged =
  teacher &&
  Object.keys(formData).some((key) => 
    Array.isArray(formData[key]) && Array.isArray(teacher[key])  
    ? !isEqualArray(formData[key],teacher[key])
    : formData[key] !== teacher[key]);
    
    const isDataUpdated = teacher?.firstName 
    && teacher?.lastName
    && teacher?.phone 
    && teacher?.dob 
    && teacher?.experience
    && teacher?.expertise


  const handleSubmit = async(e, closeDialog) => {
    e.preventDefault();
  
    const toastId = toast.loading(' updating data ...')

    if(formData.profileImage !== null){
      const {uploadedImageUrl} = await imageUpload(formData.profileImage);
      formData.profileImage = uploadedImageUrl
    }

    console.log(formData)

    try {
      await tutorUpdateProfile(formData).unwrap()
      toast.success('Profile updated successfully',{ id: toastId })
    } catch (error) {
      console.log(error)
      toast.error('Updation Failed please try again later ...',{id : toastId})
    }
    finally{
      if (closeDialog) closeDialog();
    }
    
  };

  const handleVerificationRequest = async(e) =>{
    e.preventDefault()
    const toastId = toast.loading('Please wait...')
        try {
          await requestVerification(tutor.tutorData._id).unwrap()
          toast.success('Verification request submited',{ id: toastId });
          setTimeout(()=>{toast.info('Track verification status in notification section');},[2500])
        } catch (error) {
          toast.error(error?.data?.message || "Verification request failed try again later",{id : toastId})
        }
  }
 
  return (
   <div className="flex justify-center p-4">
      <Card className="w-full max-w-7xl p-8 bg-white shadow-lg rounded-lg">
      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6" id="profile-form">
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
                  className="w-20 h-20 rounded-full object-cover"
                />
                {tutor.tutorData?.isAdminVerified 
                ? <Label className = 'flex gap-2'>
                  <CircleCheckBig color="#008000"/> 
                </Label>
                : <Tooltip/>
                }
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

          <div>
          <div className="flex flex-wrap gap-2">
            {expertise.map((tag,index)=> (
              <Badge 
              key={index} 
              className="bg-secondary text-white px-2 py-2 rounded hover:bg-secondary "
              >
                {tag}
              </Badge>
            ))}
          </div>
          <br />
           <div className="flex gap-2 ">
           <Input
            id = 'expertise'
            name = 'expertise'
            type = 'text'
            placeholder="Type & press Enter to add expertise examble Web Developer"
            value = {input}
            onChange={(e)=>setInput(e.target.value)}
            onKeyDown={addExpetise}
            className="border p-2 rounded w-1/2"
            >
            </Input>
            <Button onClick={handleRemoveTag} className=" flex items-center gap-2 px-3 py-2 border bg-gray-50 border-gray-300 rounded-md text-sm text-gray-700 hover:bg-red-600 hover:text-white">X</Button>
           </div>
          </div>
         
          <div>
            <SelectExperience value = {formData?.experience} onSelectExperience={(value)=>
              setFormData((prev)=>({...prev , experience : value}))}/>
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
          <div className="flex gap-2 ">
          <ProfileDialog  notValid={notValid || !isFormChanged}
            btnName={"Save changes"}
            title={"Update profile details"}
            desc={`Make changes to your profile here. Click save when you're done.`}
            onSave={(closeDialog) => handleSubmit(event, closeDialog)} // Pass closeDialog
          />
          {!tutor.tutorData?.isAdminVerified  && 
          <Button 
          disabled = {!isDataUpdated}
          className='bg-blue-600 hover:bg-blue-700'
          onClick = {handleVerificationRequest}
          >
            {tutor.tutorData?.status === 'pending' ? 'Check verification status' : 'Request verification'}
          </Button>}
          </div>
        </form>
      </div>
    </Card>
  </div>
  );
};

export default ProfileDetails;
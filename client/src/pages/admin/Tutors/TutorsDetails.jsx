import {  Mail, Phone, BadgeIcon as IdCard, Activity, GraduationCap , Calendar, PartyPopper, SquareChevronUp} from "lucide-react"
import { useParams } from 'react-router-dom'
import {useAdminLoadTutorDetailsQuery} from '@/services/adminApi/adminTutorApi'

const TutorsDetails = () => {
    const {tutorId} = useParams();
    const {data : details} = useAdminLoadTutorDetailsQuery(tutorId);
    const data = details?.data;
  
  
    const detailItems = [
      { icon: Mail, label: "Email", value: data?.email },
      { icon: Phone, label: "Phone", value: data?.phone },
      { icon: IdCard, label: "Tutor ID", value: data?._id },
      { icon: Activity, label: "Status", value: data?.isActive ? 'Active' : 'Not Active' },
      { icon: GraduationCap, label: "Expertise", value: data?.expertise.join(", ") },
      { icon: Calendar, label: "Date of birth", value: data?.dob },
      { icon: PartyPopper, label: "Bio", value: data?.bio },
      { icon: SquareChevronUp, label: "Experience", value: data?.experience },
    ]
  
  
    return (
      <div className="max-w-5xl mx-auto p-6">
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-secondary to-primary p-6 text-white">
            <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
              <img
                src={data?.profileImage || "/userIcon.png"}
                alt={data?.firstName}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg mb-4 md:mb-0 md:mr-6 bg-white"
              />
              <div>
                <h1 className="text-3xl font-bold mb-2">{data?.firstName} {data?.lastName}</h1>
                <div>
                    <p className="text-lg font-medium text-white">{data?.bio}</p>
                  </div>
              </div>
            </div>
          </div>
  
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {detailItems.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start">
                  <div className="bg-primary bg-opacity-10 rounded-full p-3 mr-4">
                    <Icon className="w-6 h-6 text-bg-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{label}</p>
                    <p className="text-lg font-medium text-gray-800">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

export default TutorsDetails

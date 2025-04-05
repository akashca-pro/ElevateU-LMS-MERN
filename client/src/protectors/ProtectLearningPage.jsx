import { useParams } from 'react-router-dom'
import { useCheckEnrollmentQuery } from '@/services/userApi/userLearningCourseApi.js'
import NotEnrolledCard from '@/components/FallbackUI/NotEnrolledCard';

const ProtectLearningPage = ({ children }) => {
    const {courseId} = useParams();
    const { data } = useCheckEnrollmentQuery(courseId);
    
    if(data){
        return <>{children}</>
    }

    return <NotEnrolledCard courseId={courseId} />

}

export default ProtectLearningPage

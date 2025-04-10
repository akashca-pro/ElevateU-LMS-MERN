import {useAdminVerificationRequestQuery, useAdminApproveOrRequestMutation} from '@/services/adminApi/adminTutorApi'
import { useAdminLoadPendingRequestQuery, useAdminApproveOrRejectCourseMutation } from '@/services/adminApi/adminCourseApi.js'
import CoursePublishRequests from "./CoursePublishRequests";
import TutorVerificationRequest from "./tutorVerificationRequest";
import WithdrawRequests from './WithdrawRequests';


export function NotificationCard() {
  const {data : tutorVerificationRequests, refetch : refetchVerificationRequest } = useAdminVerificationRequestQuery();
  const VerificationRequests = tutorVerificationRequests?.data;
  const [tutorApproveOrRequest] = useAdminApproveOrRequestMutation();

  const { data : coursePublishRequests, refetch : refetchPublishRequest } = useAdminLoadPendingRequestQuery()
  const publishRequests = coursePublishRequests?.data;
  const [courseApproveOrReject] = useAdminApproveOrRejectCourseMutation()

  return (
    <div className="flex flex-col gap-4">
      {/* Tutor verification requests */}

      <TutorVerificationRequest VerificationRequests={VerificationRequests}
       refetchVerificationRequest={refetchVerificationRequest} 
       tutorApproveOrRequest={tutorApproveOrRequest}/>

      <CoursePublishRequests courseApproveOrReject={courseApproveOrReject} 
      publishRequests={publishRequests}
      refetchPublishRequest={refetchPublishRequest}  />

      <WithdrawRequests/>

    </div>
  );
}
import { useSelector } from "react-redux";

export const useSelect = () => {
  return {
    user: useSelector((state) => state.userAuth),
    tutor: useSelector((state) => state.tutorAuth),
    admin: useSelector((state) => state.adminAuth),
    course : useSelector((state)=>state.course.courseId)
  };
};
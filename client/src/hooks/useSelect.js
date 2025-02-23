import { useSelector } from "react-redux";

export const user = useSelector((state)=>state.userAuth)

export const tutor = useSelector((state)=>state.tutorAuth)

export const admin = useSelector((state)=>state.adminAuth)
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";



const useSetStateOnRouteChange = () =>{
    const location = useLocation();
    const [state, setState] = useState(defaultStates);
    
}
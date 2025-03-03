import React, { useState, useEffect } from "react";
import VerificationNotification from "./components/VerificationNotification";

const Index = () => {
  const [visible, setVisible] = useState(() => {
   
    return true
  });

  const handleMarkAsRead = () => {
    
    setVisible(false); 
  };

  return (
    <div>
      {visible && <VerificationNotification markRead={handleMarkAsRead} />}
    </div>
  );
};

export default Index;
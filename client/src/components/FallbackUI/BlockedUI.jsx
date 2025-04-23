import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Ban, Home } from "lucide-react"


const BlockedUI = ({ children }) => {
  const [isBlocked,setIsBlocked] = useState(false);
  const [blockMessage, setBlockMessage] = useState('');

  useEffect(()=>{

    const handleBlockEvent = (event) => {
      setIsBlocked(true)
      setBlockMessage(event.detail?.message || 'You have been blocked.');
    }

    window.addEventListener('userBlocked',handleBlockEvent)

    return ()=> {
      window.removeEventListener('userBlocked',handleBlockEvent)
    }

  },[])
  
  if(isBlocked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="w-[350px] shadow-lg">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold text-red-600 flex items-center justify-center">
                <Ban className="mr-2 h-6 w-6" />
                {blockMessage}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
                className="text-center mb-4"
              >
                <span className="text-6xl">🚫</span>
              </motion.div>
              { /deactivated/i.test(blockMessage)
              ?<p className="text-center text-gray-600 mb-4">
              Your account has been deactivated by you. You can contact support to reactivate it anytime.
            </p>
              :<p className="text-center text-gray-600 mb-4">
                Your account has been blocked due to a violation of our terms of service.
              </p>}
              <motion.p
                className="text-sm text-center text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                If you believe this is a mistake, please contact our support team for assistance.
              </motion.p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to={"/"}>
                  <Home className="mr-2 h-4 w-4" />
                  Return to Home
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    )
  }else{
    return <>{children}</>
  }

}

export default BlockedUI


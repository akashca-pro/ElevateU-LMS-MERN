import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotEnrolledCard({courseId}) {
  const navigate = useNavigate()
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center h-screen"
    >
      <Card className="w-[350px] p-6 text-center shadow-lg">
        <CardContent>
          <h2 className="text-xl font-semibold mb-2">This course is not enrolled</h2>
          <p className="text-gray-500 mb-4">Please purchase to access the content.</p>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button 
            onClick={()=>navigate(`/explore/courses/${courseId}`)}
            className="w-full flex gap-2" variant="default">
              <ShoppingCart size={18} /> Purchase Now
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
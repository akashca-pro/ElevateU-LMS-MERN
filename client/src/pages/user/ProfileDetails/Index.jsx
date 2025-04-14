import { motion } from "framer-motion";
import ProfileDetails from "./ProfileDetails";

const Index = () => {
  return (
      <div className="container mx-auto ">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          
          <ProfileDetails/>
        </motion.div>
      </div>
  );
};

export default Index;

import ProfileCards from './ProfileCards';
import ProfileDetails from './ProfileDetails'
import { motion } from "framer-motion";

const Index = () => {
    return (
        <div className="min-h-screen ">
          <div className="container mx-auto px-4 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
               <ProfileCards/> 
              <ProfileDetails />
            </motion.div>
          </div>
        </div>
      );
}

export default Index

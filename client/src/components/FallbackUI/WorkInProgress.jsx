import React from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { scaleIn } from '@/utils/animation'; // adjust this path if needed

const WorkInProgress = ({ title, description, children }) => {
  return (
    <div className="w-full max-w-4xl mx-auto my-8">
      <motion.div
        variants={scaleIn}
        initial="hidden"
        animate="visible"
        className="border border-yellow-400 p-6 rounded-lg bg-yellow-50 text-center"
      >
        <div className="flex justify-center mb-4">
          <div className="bg-yellow-100 p-3 rounded-full border border-yellow-300">
            <Lock className="text-yellow-700 w-6 h-6" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-yellow-700 mb-2">{title}</h2>
        <p className="text-yellow-600 mb-4">{description}</p>
        <div className="opacity-40 pointer-events-none">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default WorkInProgress;
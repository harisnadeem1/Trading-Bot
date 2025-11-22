import React from "react";
import { useAuthStore } from "@/store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const LockModal = () => {
  const { isLockModalOpen } = useAuthStore();

  return (
    <AnimatePresence>
      {isLockModalOpen && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="
              relative bg-[#141414] w-[90%] max-w-md p-8 rounded-2xl 
              border border-white/10 shadow-2xl shadow-black/40
            "
          >
            {/* Header */}
            <h2 className="text-2xl font-bold text-white mb-3 text-center">
              License Expired
            </h2>

            {/* Message */}
            <p className="text-gray-300 mb-8 leading-relaxed text-[15px] text-center">
              Your <span className="text-green-400 font-semibold">60-day free trial</span> has ended.
              <br />
              Contact support to <span className="font-semibold">renew or cancel your license</span>.
            </p>

            {/* Contact Button */}
            <a
              href="https://t.me/ImpulseEdge"
              target="_blank"
              rel="noopener noreferrer"
              className="
                w-full block text-center bg-green-500 text-black 
                font-semibold py-3 rounded-xl text-lg
                hover:bg-green-400 transition transform hover:scale-105
              "
            >
              Contact Support
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LockModal;

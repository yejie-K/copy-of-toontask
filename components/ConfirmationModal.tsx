import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={onCancel}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotate: -2 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.8, opacity: 0, rotate: 2 }}
            className="relative bg-white w-full max-w-sm rounded-[2rem] border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] p-6 overflow-hidden"
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 bg-yellow-300 rounded-full flex items-center justify-center border-4 border-slate-900">
                <RefreshCw className="w-8 h-8 text-slate-900" />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900">Restart Task?</h3>
              <p className="text-slate-600 font-medium">
                This will reset the timer and move the task back to "To Do".
              </p>

              <div className="flex gap-4 w-full mt-2">
                <button
                  onClick={onCancel}
                  className="flex-1 py-3 px-4 rounded-xl border-2 border-slate-900 font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 py-3 px-4 rounded-xl border-2 border-slate-900 bg-sky-400 hover:bg-sky-500 text-white font-bold shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-y-0.5 active:shadow-none transition-all"
                >
                  Restart
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;

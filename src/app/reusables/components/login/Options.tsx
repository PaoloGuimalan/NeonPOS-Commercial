import React from 'react';
import { motion } from 'framer-motion';
import { MdClose } from 'react-icons/md';
import ReusableModal from '../../ReusableModal';

function Options() {
  return (
    <ReusableModal
      shaded
      padded={false}
      children={
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white w-[95%] h-[95%] max-w-[450px] max-h-[200px] rounded-[7px] p-[20px] pb-[5px] flex flex-col"
        >
          <div className="w-full flex flex-row">
            <div className="flex flex-1">
              <span className="text-[16px] font-semibold">Reset Settings</span>
            </div>
            <div className="w-fit">
              <button
                onClick={() => {
                  settoggleSettingsModal(false);
                }}
              >
                <MdClose />
              </button>
            </div>
          </div>
          <div className="w-full flex flex-1 flex-col items-center justify-center gap-[3px]">
            <button
              onClick={OpenNeonRemote}
              className="h-[30px] w-full bg-green-500 cursor-pointer shadow-sm text-white font-semibold rounded-[4px]"
            >
              <span className="text-[14px]">Open Neon Remote</span>
            </button>
            <button
              onClick={OpenTerminal}
              className="h-[30px] w-full bg-orange-500 cursor-pointer shadow-sm text-white font-semibold rounded-[4px]"
            >
              <span className="text-[14px]">Open Terminal</span>
            </button>
            <button
              onClick={ResetSetup}
              className="h-[30px] w-full bg-orange-500 cursor-pointer shadow-sm text-white font-semibold rounded-[4px]"
            >
              <span className="text-[14px]">Reset</span>
            </button>
            <button
              onClick={ShutdownSystem}
              className="h-[30px] w-full bg-red-500 cursor-pointer shadow-sm text-white font-semibold rounded-[4px]"
            >
              <span className="text-[14px]">Shutdown</span>
            </button>
          </div>
        </motion.div>
      }
    />
  );
}

export default Options;

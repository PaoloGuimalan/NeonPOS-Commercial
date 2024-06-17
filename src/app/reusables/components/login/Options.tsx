import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MdClose, MdSettings } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import ReusableModal from '../../ReusableModal';
import { settingsstate } from '../../../redux/types/states';
import { SET_SETTINGS } from '../../../redux/types/types';

function Options() {
  const dispatch = useDispatch();
  const [toggleSettingsModal, setToggleSettingsModal] = useState<boolean>(false);

  const openNeonRemote = () => {
    window.ipcRenderer.send('execute-command', 'xdg-open https://neonremote.netlify.app');
    setToggleSettingsModal(false);
  };

  const openTerminal = () => {
    window.ipcRenderer.send('execute-command', 'gnome-terminal');
    setToggleSettingsModal(false);
  };

  const resetSetup = () => {
    localStorage.removeItem('settings');
    dispatch({
      type: SET_SETTINGS,
      payload: {
        settings: settingsstate
      }
    });
    setToggleSettingsModal(false);
    window.ipcRenderer.send('close-external', '');
  };

  const shutdownSystem = () => {
    window.ipcRenderer.send('execute-command', 'systemctl poweroff');
  };

  return (
    <>
      <button
        onClick={() => {
          setToggleSettingsModal(!toggleSettingsModal);
        }}
        className="absolute bottom-[10px] left-[10px] p-[10px] rounded-[7px]"
      >
        <MdSettings className="text-accent-tertiary" style={{ fontSize: '25px' }} />
      </button>
      {toggleSettingsModal && (
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
                      setToggleSettingsModal(false);
                    }}
                  >
                    <MdClose />
                  </button>
                </div>
              </div>
              <div className="w-full flex flex-1 flex-col items-center justify-center gap-[3px]">
                <button
                  onClick={openNeonRemote}
                  className="h-[30px] w-full bg-green-500 cursor-pointer shadow-sm text-white font-semibold rounded-[4px]"
                >
                  <span className="text-[14px]">Open Neon Remote</span>
                </button>
                <button
                  onClick={openTerminal}
                  className="h-[30px] w-full bg-orange-500 cursor-pointer shadow-sm text-white font-semibold rounded-[4px]"
                >
                  <span className="text-[14px]">Open Terminal</span>
                </button>
                <button
                  onClick={resetSetup}
                  className="h-[30px] w-full bg-orange-500 cursor-pointer shadow-sm text-white font-semibold rounded-[4px]"
                >
                  <span className="text-[14px]">Reset</span>
                </button>
                <button
                  onClick={shutdownSystem}
                  className="h-[30px] w-full bg-red-500 cursor-pointer shadow-sm text-white font-semibold rounded-[4px]"
                >
                  <span className="text-[14px]">Shutdown</span>
                </button>
              </div>
            </motion.div>
          }
        />
      )}
    </>
  );
}

export default Options;

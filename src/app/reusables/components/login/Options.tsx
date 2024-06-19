import React, { SetStateAction, useState, Dispatch } from 'react';
import { motion } from 'framer-motion';
import { MdClose, MdSettings } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import ReusableModal from '../../ReusableModal';
import { settingsstate } from '../../../redux/types/states';
import { SET_SETTINGS } from '../../../redux/types/types';
import Button from '../button/Button';

type Props = {
  isSetup?: boolean;
  setHideBackground?: Dispatch<SetStateAction<boolean>>;
};

function Options({ isSetup, setHideBackground }: Props) {
  const dispatch = useDispatch();
  const [toggleSettingsModal, setToggleSettingsModal] = useState<boolean>(false);

  const modalHandler = () => {
    if (setHideBackground) {
      setHideBackground((prev) => !prev);
    }

    setToggleSettingsModal((prev) => !prev);
  };

  const openNeonRemote = () => {
    window.ipcRenderer.send('execute-command', 'xdg-open https://neonremote.netlify.app');
    modalHandler();
  };

  const openTerminal = () => {
    window.ipcRenderer.send('execute-command', 'gnome-terminal');
    modalHandler();
  };

  const resetSetup = () => {
    localStorage.removeItem('settings');
    dispatch({
      type: SET_SETTINGS,
      payload: {
        settings: settingsstate
      }
    });
    modalHandler();
    window.ipcRenderer.send('close-external', '');
  };

  const shutdownSystem = () => {
    window.ipcRenderer.send('execute-command', 'systemctl poweroff');
  };

  const options = [
    {
      label: 'Open Neon Remote',
      onClick: openNeonRemote,
      color: 'bg-green-500'
    },
    {
      label: 'Open Terminal',
      onClick: openTerminal,
      color: 'bg-orange-500'
    },
    {
      label: 'Reset',
      onClick: resetSetup,
      color: `bg-green-500 ${isSetup && 'hidden'}`
    },
    {
      label: 'Shutdown',
      onClick: shutdownSystem,
      color: `bg-red-500 ${isSetup && 'hidden'}`
    }
  ];

  return (
    <>
      <Button
        className="absolute z-10 bottom-[10px] left-[10px] rounded-[7px] cursor-pointer "
        variant="ghost"
        onClick={modalHandler}
      >
        <MdSettings className="text-accent-tertiary" style={{ fontSize: '25px' }} />
      </Button>
      {toggleSettingsModal && (
        <ReusableModal
          shaded
          padded={false}
          children={
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-white w-[95%] h-[95%] max-w-[450px] max-h-[200px] rounded-[7px] absolute z-40 p-[20px] pb-[5px] flex flex-col"
            >
              <div className="w-full flex flex-row">
                <div className="flex flex-1">
                  <span className="text-[16px] font-semibold">Reset Settings</span>
                </div>
                <div className="w-fit">
                  <button className="cursor-pointer" onClick={modalHandler}>
                    <MdClose />
                  </button>
                </div>
              </div>
              <div className="w-full flex flex-1 flex-col items-center justify-center gap-[3px]">
                {options?.map((option) => (
                  <button
                    key={option.label}
                    onClick={option.onClick}
                    className={`h-[30px] w-full ${option.color} cursor-pointer shadow-sm text-white font-semibold rounded-[4px]`}
                  >
                    <span className="text-[14px]">{option.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          }
        />
      )}
    </>
  );
}

export default Options;

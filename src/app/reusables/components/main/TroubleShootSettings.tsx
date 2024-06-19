import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { MdClose, MdSettings } from 'react-icons/md';
import ReusableModal from '../../ReusableModal';
import { dispatchnewalert } from '../../../helpers/utils/alertdispatching';
import { SettingsInterface } from '../../../helpers/variables/interfaces';
import { RootState } from '@/app/redux/store/store';
import { useSelector, useDispatch } from 'react-redux';
import Button from '../button/Button';

function TroubleShootSettings() {
  const [toggleTroubleshoot, settoggleTroubleshoot] = useState<boolean>(false);
  const settings: SettingsInterface = useSelector((state: RootState) => state.settings);
  const dispatch = useDispatch();

  const OpenNeonRemote = () => {
    window.ipcRenderer.send('execute-command', 'xdg-open https://neonremote.netlify.app');
    settoggleTroubleshoot(false);
  };

  const RestartReportWindow = () => {
    if (settings.setup === 'POS') {
      window.ipcRenderer.send('restart-report-window', '');
      settoggleTroubleshoot(false);
    } else {
      dispatchnewalert(dispatch, 'warning', 'Action unavailable, current setup is not POS type.');
    }
  };

  const RestartReceiptWindow = () => {
    if (settings.setup === 'POS') {
      window.ipcRenderer.send('restart-receipt-window', '');
      settoggleTroubleshoot(false);
    } else {
      dispatchnewalert(dispatch, 'warning', 'Action unavailable, current setup is not POS type.');
    }
  };

  const settingsItem = [
    { label: 'Open Neon Remote', onClick: OpenNeonRemote, className: 'bg-green-500' },
    { label: 'Restart Reciept Window', onClick: RestartReceiptWindow, className: 'bg-green-700' },
    { label: 'Restart Report Window', onClick: RestartReportWindow, className: 'bg-orange-500' }
  ];

  return (
    <>
      <motion.button
        initial={{
          color: 'white'
        }}
        whileHover={{
          background: 'white',
          color: 'black'
        }}
        onClick={() => {
          settoggleTroubleshoot(!toggleTroubleshoot);
        }}
        className="text-red w-full h-[70px] rounded-[10px] flex items-center justify-center"
      >
        <MdSettings style={{ fontSize: '27px' }} />
      </motion.button>
      {toggleTroubleshoot && (
        <ReusableModal
          shaded
          padded={false}
          children={
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-white w-[95%] h-[95%] max-w-[450px] max-h-[180px] rounded-[7px] p-[20px] pb-[5px] flex flex-col"
            >
              <div className="w-full flex flex-row">
                <div className="flex flex-1">
                  <span className="text-[16px] font-semibold">Troubleshoot Settings</span>
                </div>
                <div className="w-fit">
                  <button
                    onClick={() => {
                      settoggleTroubleshoot(false);
                    }}
                  >
                    <MdClose />
                  </button>
                </div>
              </div>
              <div className="w-full flex flex-1 flex-col items-center justify-center gap-[3px]">
                {settingsItem.map((setting) => (
                  // <button
                  //   key={setting.label}
                  //   onClick={setting.onClick}
                  //   className={`h-[30px] w-full ${setting.className} cursor-pointer shadow-sm text-white font-semibold rounded-[4px]`}
                  // >
                  //   <span className="text-[14px]">{setting.label}</span>
                  // </button>

                  <Button
                    key={setting.label}
                    onClick={setting.onClick}
                    className={`h-[30px] w-full ${setting.className}  cursor-pointer shadow-sm text-white font-semibold rounded-[4px]`}
                  >
                    {setting.label}
                  </Button>
                ))}
              </div>
            </motion.div>
          }
        />
      )}
    </>
  );
}

export default TroubleShootSettings;

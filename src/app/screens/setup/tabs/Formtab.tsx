import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import ReusableModal from '../../../reusables/ReusableModal';
import NeonPOS from '../../../../assets/NeonPOS.png';
import { dispatchnewalert } from '../../../helpers/utils/alertdispatching';
import { InitialSetupDeviceVerificationRequest } from '../../../helpers/http/requests';
import { SET_SETTINGS } from '../../../redux/types/types';
import Options from '../../../reusables/components/login/Options';
import BGLayout from '../../../reusables/BGLayout';
import Button from '../../../reusables/components/button/Button';
import Paragraph from '../../../reusables/components/typography/Paragraph';

function Formtab() {
  const [NSUSRID, setNSUSRID] = useState<string>('');
  const [NSDVCID, setNSDVCID] = useState<string>('');
  const [connectionToken, setconnectionToken] = useState<string>('');
  const [SetupType, setSetupType] = useState<string>('POS');
  const [POSType, setPOSType] = useState<string>('none');

  const [isVerifying, setisVerifying] = useState<boolean>(false);

  const [isShuttingdown, setisShuttingdown] = useState<boolean>(false);
  const [hideBackground, setHideBackground] = useState<boolean>(false);

  const dispatch = useDispatch();

  const VerifyCredentials = () => {
    if (NSUSRID.trim() !== '' && NSDVCID.trim() !== '' && connectionToken.trim() !== '' && POSType.trim() !== 'none') {
      setisVerifying(true);
      InitialSetupDeviceVerificationRequest({
        userID: NSUSRID,
        deviceID: NSDVCID,
        connectionToken
      })
        .then((response) => {
          if (response.data.status) {
            dispatchnewalert(dispatch, 'success', response.data.message);
            localStorage.setItem(
              'settings',
              JSON.stringify({
                userID: NSUSRID,
                deviceID: NSDVCID,
                connectionToken,
                setup: SetupType,
                posType: POSType
              })
            );
            dispatch({
              type: SET_SETTINGS,
              payload: {
                settings: {
                  userID: NSUSRID,
                  deviceID: NSDVCID,
                  connectionToken,
                  setup: SetupType,
                  posType: POSType
                }
              }
            });
            window.ipcRenderer.send('setup-type-reload', SetupType);
          } else {
            setisVerifying(false);
            dispatchnewalert(dispatch, 'warning', response.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
          setisVerifying(false);
          dispatchnewalert(dispatch, 'error', 'Error requesting verification');
        });
    } else {
      dispatchnewalert(dispatch, 'warning', 'Fields are incomplete');
    }
  };

  const CancelSetup = () => {
    setisShuttingdown(true);
    setTimeout(() => {
      window.ipcRenderer.send('execute-command', 'systemctl poweroff');
    }, 5000);
  };

  return (
    <BGLayout className="w-full h-full absolute flex items-center">
      <Options isSetup setHideBackground={setHideBackground} />
      {!hideBackground && (
        <ReusableModal
          shaded={false}
          padded={false}
          children={
            <motion.div
              initial={{
                maxHeight: '0px'
              }}
              animate={{
                maxHeight: '720px'
              }}
              transition={{
                delay: 1,
                duration: 1
              }}
              className="border-[1px] bg-white w-[95%] h-[95%] max-w-[700px] shadow-md rounded-[10px] overflow-y-auto"
            >
              <div className="w-full h-full p-[25px] flex flex-col gap-[10px]">
                <div className="w-full flex flex-row">
                  <img src={NeonPOS.src} className="h-[60px]" alt="NEON POS ALT SRC" />
                </div>
                <div className="w-full flex flex-col justify-center items-center">
                  <span className="text-[30px] font-semibold font-Inter">Welcome to Neon POS</span>
                  <span className="text-[11px] font-Inter">Powered by Neon Service</span>
                </div>
                <div className="w-full flex flex-col pt-[20px] pl-[20px] pr-[20px]">
                  <Paragraph fontSize="sm" className="font-Inter text-justify">
                    Introducing Neon POS, the innovative Point-of-Sales system powered by cutting-edge software, Neon
                    Service. Seamlessly integrating state-of-the-art solutions, Neon POS offers streamlined transactions
                    and instant insights, transforming businesses.
                  </Paragraph>
                </div>
                <div className="w-full flex flex-col pt-[10px] pl-[20px] pr-[20px] gap-[20px]">
                  <span className="text-[14px] font-Inter font-semibold">Enter setup details</span>
                  <div className="flex flex-col w-full pl-[20px] pr-[20px] gap-[10px]">
                    <div className="flex flex-col w-full gap-[5px]">
                      <span className="text-[12px] font-Inter font-semibold">Neon Service User ID</span>
                      <input
                        placeholder="eg: USR_00000_0000000000"
                        value={NSUSRID}
                        onChange={(e) => {
                          setNSUSRID(e.target.value);
                        }}
                        className="font-Inter bg-transparent border-[1px] h-[35px] pl-[10px] pr-[10px] outline-none text-[12px] w-full rounded-[4px]"
                      />
                    </div>
                    <div className="flex flex-col w-full gap-[5px]">
                      <span className="text-[12px] font-Inter font-semibold">Neon Service Device ID</span>
                      <input
                        placeholder="eg: USR_00000_0000000000"
                        value={NSDVCID}
                        onChange={(e) => {
                          setNSDVCID(e.target.value);
                        }}
                        className="font-Inter bg-transparent border-[1px] h-[35px] pl-[10px] pr-[10px] outline-none text-[12px] w-full rounded-[4px]"
                      />
                    </div>
                    <div className="flex flex-col w-full gap-[5px]">
                      <span className="text-[12px] font-Inter font-semibold">Connection Token</span>
                      <input
                        placeholder="Input connection token of this device provided in Neon Remote"
                        value={connectionToken}
                        onChange={(e) => {
                          setconnectionToken(e.target.value);
                        }}
                        className="font-Inter bg-transparent border-[1px] h-[35px] pl-[10px] pr-[10px] outline-none text-[12px] w-full rounded-[4px]"
                      />
                    </div>
                    <div className="flex flex-col w-full gap-[5px]">
                      <span className="text-[12px] font-Inter font-semibold">Setup Type</span>
                      <select
                        value={SetupType}
                        onChange={(e) => {
                          setSetupType(e.target.value);
                        }}
                        className="font-Inter bg-transparent border-[1px] h-[35px] pl-[10px] pr-[10px] outline-none text-[12px] w-full rounded-[4px]"
                      >
                        <option defaultChecked value="POS">
                          POS
                        </option>
                        <option value="Portable">Portable</option>
                      </select>
                    </div>
                    <div className="flex flex-col w-full gap-[5px]">
                      <span className="text-[12px] font-Inter font-semibold">POS Type</span>
                      <select
                        value={POSType}
                        onChange={(e) => {
                          setPOSType(e.target.value);
                        }}
                        className="font-Inter bg-transparent border-[1px] h-[35px] pl-[10px] pr-[10px] outline-none text-[12px] w-full rounded-[4px]"
                      >
                        <option defaultChecked value="none">
                          -- Select a POS Type --
                        </option>
                        <option value="fast_food">Fast Food</option>
                        <option value="restaurant">Restaurant</option>
                        <option value="convenience_store">Convenience Store</option>
                        <option value="market">Market</option>
                        <option value="retail">Retail</option>
                      </select>
                    </div>
                    <div className="flex flex-flex w-full gap-[5px] pt-[10px] pb-[10px]">
                      {/* <button
                        disabled={isVerifying}
                        onClick={VerifyCredentials}
                        className="flex items-center justify-center h-[32px] font-Inter pl-[12px] pr-[12px] bg-accent-tertiary cursor-pointer shadow-sm text-white font-semibold rounded-[4px]"
                      >
                        <span className="text-[12px]">
                          {isVerifying ? '...Verifying Credentials' : 'Verify and Confirm'}
                        </span>
                      </button> */}
                      <Button
                        disabled={isVerifying}
                        onClick={VerifyCredentials}
                        className="flex items-center justify-center h-[32px] font-Inter pl-[12px] pr-[12px] text-[12px] bg-accent-tertiary cursor-pointer shadow-sm text-white font-semibold rounded-[4px]"
                      >
                        {isVerifying ? '...Verifying Credentials' : 'Verify and Confirm'}
                      </Button>
                      {/* <button
                        disabled={isVerifying}
                        onClick={CancelSetup}
                        className="flex items-center justify-center h-[32px] font-Inter pl-[12px] pr-[12px] bg-red-500 cursor-pointer shadow-sm text-white font-semibold rounded-[4px]"
                      >
                        <span className="text-[12px]">{isShuttingdown ? '...Shutting down' : 'Cancel Setup'}</span>
                      </button> */}
                      <Button
                        disabled={isVerifying}
                        onClick={CancelSetup}
                        className="flex items-center justify-center h-[32px] font-Inter pl-[12px] pr-[12px] bg-red-500 cursor-pointer shadow-sm text-[12px] text-white font-semibold rounded-[4px]"
                      >
                        {isShuttingdown ? '...Shutting down' : 'Cancel Setup'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          }
        />
      )}
    </BGLayout>
  );
}

export default Formtab;

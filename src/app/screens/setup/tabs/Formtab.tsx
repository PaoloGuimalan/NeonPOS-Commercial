import React, { useEffect, useRef, useState } from 'react'
import ReusableModal from '../../../reusables/ReusableModal'
import { motion } from 'framer-motion'
import NeonPOS from '../../../../assets/NeonPOS.png'
import NeonPOSSVG from '../../../../assets/NeonPOS_BG.svg'
import { useDispatch, useSelector } from 'react-redux';
import { dispatchclearalerts, dispatchnewalert } from '../../../helpers/utils/alertdispatching';
import { InitialSetupDeviceVerificationRequest } from '../../../helpers/http/requests';
import { MdClose, MdSettings } from 'react-icons/md'
import { AlertsItem } from '../../../helpers/variables/interfaces'
import { SET_SETTINGS } from '../../../redux/types/types'

function Formtab() {

  const [NSUSRID, setNSUSRID] = useState<string>("");
  const [NSDVCID, setNSDVCID] = useState<string>("");
  const [connectionToken, setconnectionToken] = useState<string>("");
  const [SetupType, setSetupType] = useState<string>("POS");

  const [isVerifying, setisVerifying] = useState<boolean>(false);

  const [isShuttingdown, setisShuttingdown] = useState<boolean>(false);
  const [toggleSettingsModal, settoggleSettingsModal] = useState<boolean>(false);

  const dispatch = useDispatch();

  const VerifyCredentials = () => {
    if(NSUSRID.trim() !== "" && NSDVCID.trim() !== "" && connectionToken.trim() !== ""){
        setisVerifying(true);
        InitialSetupDeviceVerificationRequest({
            userID: NSUSRID,
            deviceID: NSDVCID,
            connectionToken: connectionToken
        }).then((response) => {
            if(response.data.status){
                dispatchnewalert(dispatch, "success", response.data.message);
                localStorage.setItem("settings", JSON.stringify({
                    userID: NSUSRID,
                    deviceID: NSDVCID,
                    connectionToken: connectionToken,
                    setup: SetupType
                }));
                dispatch({
                  type: SET_SETTINGS,
                  payload: {
                    settings: {
                        userID: NSUSRID,
                        deviceID: NSDVCID,
                        connectionToken: connectionToken,
                        setup: SetupType
                    }
                  }
                });
                window.ipcRenderer.send("setup-type-reload", SetupType);
                dispatchclearalerts(dispatch);
            }
            else{
                setisVerifying(false);
                dispatchnewalert(dispatch, "warning", response.data.message);
            }
        }).catch((err) => {
            console.log(err);
            setisVerifying(false);
            dispatchnewalert(dispatch, "error", "Error requesting verification");
        })
    }
    else{
        dispatchnewalert(dispatch, "warning", "Fields are incomplete");
    }
  }

  const CancelSetup = () => {
    setisShuttingdown(true);
    setTimeout(() => {
        window.ipcRenderer.send('execute-command', 'systemctl poweroff');
    }, 5000);
  }

  const OpenNeonRemote = () => {
    // window.ipc.send('execute-command', 'gnome-terminal');
    // settoggleSettingsModal(false);
    window.ipcRenderer.send('execute-command', 'xdg-open https://neonremote.netlify.app');
    settoggleSettingsModal(false);
  }

  const OpenTerminal = () => {
    window.ipcRenderer.send('execute-command', 'gnome-terminal');
    settoggleSettingsModal(false);
  }

//   const CancelSetup = () => {
//     dispatchnewalert(dispatch, "warning", "Cannot cancel setup");
//   }

  return (
    <div style={{ background: `url(${NeonPOSSVG.src})`, backgroundSize: "cover", backgroundPosition: "bottom", backgroundRepeat: "no-repeat" }} className='w-full h-full absolute flex items-center'>
        <button onClick={() => { settoggleSettingsModal(!toggleSettingsModal) }} className='absolute bottom-[10px] left-[10px] p-[10px] rounded-[7px] z-[10]'>
            <MdSettings className='text-accent-tertiary' style={{ fontSize: "25px" }} />
        </button>
        {toggleSettingsModal && (
          <ReusableModal shaded={true} padded={false} children={
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.4 }} className='bg-white w-[95%] h-[95%] max-w-[450px] max-h-[150px] rounded-[7px] p-[20px] pb-[5px] flex flex-col'>
              <div className='w-full flex flex-row'>
                <div className='flex flex-1'>
                  <span className='text-[16px] font-semibold'>Reset Settings</span>
                </div>
                <div className='w-fit'>
                  <button onClick={() => { settoggleSettingsModal(false); }}><MdClose /></button>
                </div>
              </div>
              <div className='w-full flex flex-1 flex-col items-center justify-center gap-[3px]'>
                  <button onClick={OpenNeonRemote} className='h-[30px] w-full bg-green-500 cursor-pointer shadow-sm text-white font-semibold rounded-[4px]'>
                    <span className='text-[14px]'>Open Neon Remote</span>
                  </button>
                  <button onClick={OpenTerminal} className='h-[30px] w-full bg-orange-500 cursor-pointer shadow-sm text-white font-semibold rounded-[4px]'>
                    <span className='text-[14px]'>Open Terminal</span>
                  </button>
              </div>
            </motion.div>
          } />
        )}
        {!toggleSettingsModal && (
            <ReusableModal shaded={false} padded={false} children={
                <motion.div
                initial={{
                    maxHeight: "0px"
                }}
                animate={{
                    maxHeight: "660px"
                }}
                transition={{
                    delay: 1,
                    duration: 1
                }}
                className='border-[1px] bg-white w-[95%] h-[95%] max-w-[700px] shadow-md rounded-[10px] overflow-y-hidden'>
                    <div className='w-full h-full p-[25px] flex flex-col gap-[10px]'>
                        <div className='w-full flex flex-row'>
                            <img src={NeonPOS.src} className='h-[60px]' />
                        </div>
                        <div className='w-full flex flex-col justify-center items-center'>
                            <span className='text-[30px] font-semibold font-Inter'>Welcome to Neon POS</span>
                            <span className='text-[11px] font-Inter'>Powered by Neon Service</span>
                        </div>
                        <div className='w-full flex flex-col pt-[20px] pl-[20px] pr-[20px]'>
                            <p className='text-[14px] font-Inter text-justify'>Introducing Neon POS, the innovative Point-of-Sales system powered by cutting-edge software, Neon Service. Seamlessly integrating state-of-the-art solutions, Neon POS offers streamlined transactions and instant insights, transforming businesses.</p>
                        </div>
                        <div className='w-full flex flex-col pt-[10px] pl-[20px] pr-[20px] gap-[20px]'>
                            <span className='text-[14px] font-Inter font-semibold'>Enter setup details</span>
                            <div className='flex flex-col w-full pl-[20px] pr-[20px] gap-[10px]'>
                                <div className='flex flex-col w-full gap-[5px]'>
                                    <span className='text-[12px] font-Inter font-semibold'>Neon Service User ID</span>
                                    <input placeholder='eg: USR_00000_0000000000' value={NSUSRID} onChange={(e) => { setNSUSRID(e.target.value) }} className='font-Inter bg-transparent border-[1px] h-[35px] pl-[10px] pr-[10px] outline-none text-[12px] w-full rounded-[4px]' />
                                </div>
                                <div className='flex flex-col w-full gap-[5px]'>
                                    <span className='text-[12px] font-Inter font-semibold'>Neon Service Device ID</span>
                                    <input placeholder='eg: USR_00000_0000000000' value={NSDVCID} onChange={(e) => { setNSDVCID(e.target.value) }} className='font-Inter bg-transparent border-[1px] h-[35px] pl-[10px] pr-[10px] outline-none text-[12px] w-full rounded-[4px]' />
                                </div>
                                <div className='flex flex-col w-full gap-[5px]'>
                                    <span className='text-[12px] font-Inter font-semibold'>Connection Token</span>
                                    <input placeholder='Input connection token of this device provided in Neon Remote' value={connectionToken} onChange={(e) => { setconnectionToken(e.target.value) }} className='font-Inter bg-transparent border-[1px] h-[35px] pl-[10px] pr-[10px] outline-none text-[12px] w-full rounded-[4px]' />
                                </div>
                                <div className='flex flex-col w-full gap-[5px]'>
                                    <span className='text-[12px] font-Inter font-semibold'>Setup Type</span>
                                    <select value={SetupType} onChange={(e) => { setSetupType(e.target.value) }} className='font-Inter bg-transparent border-[1px] h-[35px] pl-[10px] pr-[10px] outline-none text-[12px] w-full rounded-[4px]'>
                                        <option defaultChecked value="POS">POS</option>
                                        <option value="Portable">Portable</option>
                                    </select>
                                </div>
                                <div className='flex flex-flex w-full gap-[5px] pt-[10px]'>
                                    <button disabled={isVerifying} onClick={VerifyCredentials} className='flex items-center justify-center h-[32px] font-Inter pl-[12px] pr-[12px] bg-accent-tertiary cursor-pointer shadow-sm text-white font-semibold rounded-[4px]'>
                                        <span className='text-[12px]'>{isVerifying ? "...Verifying Credentials" : "Verify and Confirm"}</span>
                                    </button>
                                    <button disabled={isVerifying} onClick={CancelSetup} className='flex items-center justify-center h-[32px] font-Inter pl-[12px] pr-[12px] bg-red-500 cursor-pointer shadow-sm text-white font-semibold rounded-[4px]'>
                                        <span className='text-[12px]'>{isShuttingdown ? "...Shutting down": "Cancel Setup"}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            } />
        )}
    </div>
  )
}

export default Formtab
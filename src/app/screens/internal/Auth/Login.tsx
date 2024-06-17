/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useState } from 'react';
import { FcAssistant, FcUnlock } from 'react-icons/fc';
import { useDispatch, useSelector } from 'react-redux';
import { MdArrowBackIos, MdClose } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import NeonPOS from '../../../../assets/NeonPOS.png';
import NeonPOSSVG from '../../../../assets/NeonPOS_BG.svg';
import { LoginRequest } from '../../../helpers/http/requests';
import { SET_AUTHENTICATION } from '../../../redux/types/types';
import { dispatchnewalert } from '../../../helpers/utils/alertdispatching';
import { SavedAccountSessionsInterface, SettingsInterface } from '../../../helpers/variables/interfaces';
import Buttonloader from '../../../reusables/loaders/Buttonloader';
import { RootState } from '../../../redux/store/store';
import Options from '../../../reusables/components/login/Options';

function Login() {
  const settings: SettingsInterface = useSelector((state: RootState) => state.settings);
  const navigate = useNavigate();

  const [accountID, setaccountID] = useState<string>('');
  const [password, setpassword] = useState<string>('');
  const [saveSession, setsaveSession] = useState<boolean>(false);

  const [savedAccountSessions, setsavedAccountSessions] = useState<SavedAccountSessionsInterface[]>([]);

  const [isFromSession, setisFromSession] = useState<boolean>(false);
  const [accountNamePreview, setaccountNamePreview] = useState<string>('');
  const [isLoggingIn, setisLoggingIn] = useState<boolean>(false);

  const dispatch = useDispatch();

  const LoginProcess = () => {
    setisLoggingIn(true);
    LoginRequest({
      accountID,
      password,
      userID: settings.userID
    })
      .then((response) => {
        setisLoggingIn(false);
        if (response.data.status) {
          if (response.data.result) {
            if (saveSession) {
              const currentaccountsession = localStorage.getItem('account_sessions');
              if (currentaccountsession) {
                const parsedcurraccountsessions: SavedAccountSessionsInterface[] = JSON.parse(currentaccountsession);
                if (parsedcurraccountsessions.length > 0) {
                  const accIDChecker = parsedcurraccountsessions.map(
                    (mp: SavedAccountSessionsInterface) => mp.accountID
                  );
                  if (!accIDChecker.includes(response.data.result.data.accountID)) {
                    const JsonConvertedsessions = JSON.stringify([
                      ...parsedcurraccountsessions,
                      {
                        accountID: response.data.result.data.accountID,
                        accountName: response.data.result.data.accountName,
                        deviceID: settings.deviceID,
                        userID: settings.userID
                      }
                    ]);
                    console.log({ JsonConvertedsessions });
                    localStorage.setItem('account_sessions', JsonConvertedsessions);
                  } else {
                    const parsedaccsessionsnoncurrent = parsedcurraccountsessions.filter(
                      (flt) => flt.accountID !== response.data.result.data.accountID
                    );
                    const JsonConvertedsessions = JSON.stringify([
                      ...parsedaccsessionsnoncurrent,
                      {
                        accountID: response.data.result.data.accountID,
                        accountName: response.data.result.data.accountName,
                        deviceID: settings.deviceID,
                        userID: settings.userID
                      }
                    ]);
                    localStorage.setItem('account_sessions', JsonConvertedsessions);
                  }
                } else {
                  const JsonConvertedsessions = JSON.stringify([
                    {
                      accountID: response.data.result.data.accountID,
                      accountName: response.data.result.data.accountName,
                      deviceID: settings.deviceID,
                      userID: settings.userID
                    }
                  ]);
                  localStorage.setItem('account_sessions', JsonConvertedsessions);
                }
              } else {
                const JsonConvertedsessions = JSON.stringify([
                  {
                    accountID: response.data.result.data.accountID,
                    accountName: response.data.result.data.accountName,
                    deviceID: settings.deviceID,
                    userID: settings.userID
                  }
                ]);
                localStorage.setItem('account_sessions', JsonConvertedsessions);
              }
            }
            dispatch({
              type: SET_AUTHENTICATION,
              payload: {
                authentication: {
                  auth: true,
                  user: {
                    ...response.data.result.data
                    // permissions: permissionsmapper
                  }
                }
              }
            });
            localStorage.setItem('authentication', response.data.result.authtoken);
            dispatchnewalert(dispatch, 'success', 'Successfully logged in');
            navigate('/app/');
            return;
          }
        } else {
          dispatchnewalert(dispatch, 'warning', 'Credentials are incorrect');
        }

        // setaccountID("");
        setpassword('');
      })
      .catch((err) => {
        setisLoggingIn(false);
        console.log(err);
        dispatchnewalert(dispatch, 'error', 'Error logging in');
      });
  };

  const CheckSessions = () => {
    const accountsessions = localStorage.getItem('account_sessions');
    if (accountsessions) {
      const parsedaccsessions = JSON.parse(accountsessions);
      const filterparsedaccsessions = parsedaccsessions.filter(
        (flt: SavedAccountSessionsInterface) => flt.deviceID === settings.deviceID && flt.userID === settings.userID
      );
      setsavedAccountSessions(filterparsedaccsessions);
      // alert(JSON.stringify(accountsessions, null, 4));
    }
  };

  const RemoveSession = (accountIDProp: string) => {
    const accountsessions = localStorage.getItem('account_sessions');
    if (accountsessions) {
      const parsedaccsessions: SavedAccountSessionsInterface[] = JSON.parse(accountsessions);
      localStorage.setItem(
        'account_sessions',
        JSON.stringify([
          ...parsedaccsessions.filter((flt: SavedAccountSessionsInterface) => flt.accountID !== accountIDProp)
        ])
      );
      setsavedAccountSessions([
        ...parsedaccsessions.filter((flt: SavedAccountSessionsInterface) => flt.accountID !== accountIDProp)
      ]);
      // alert(JSON.stringify(parsedaccsessions, null, 4));
    }
  };

  useEffect(() => {
    window.Main.on('command-output', (event: string) => {
      dispatchnewalert(dispatch, 'info', event);
    });

    window.Main.on('command-error', (event: string) => {
      dispatchnewalert(dispatch, 'error', event);
    });

    CheckSessions();
  }, [settings]);

  const setAccount = (mp: SavedAccountSessionsInterface) => {
    setisFromSession(true);
    setaccountID(mp.accountID);
    setpassword('');
    setaccountNamePreview(`${mp.accountName.firstname} ${mp.accountName.middlename} ${mp.accountName.lastname}`);
  };

  return (
    <div
      style={{
        backgroundImage: `url(${NeonPOSSVG})`
      }}
      className="w-full h-full bg-cover bg-bottom bg-no-repeat bg-neonsvg bg-primary absolute flex flex-1 flex-row font-Inter"
    >
      <div className="h-full bg-transparent flex flex-1 items-center justify-center">
        {savedAccountSessions.length > 0 && (
          <div className="bg-shade flex flex-col w-[95%] h-[95%] max-w-[1000px] max-h-[800px] p-[20px] gap-[10px]">
            <span className="font-Inter font-semibold text-[16px] text-text-tertiary">Recent Sessions</span>
            <div className="flex flex-row flex-wrap flex-1 overflow-y-auto gap-[10px]">
              {savedAccountSessions.map((mp: SavedAccountSessionsInterface) => {
                return (
                  <div
                    key={mp.accountID}
                    title={`${mp.accountName.firstname} ${mp.accountName.middlename} ${mp.accountName.lastname}`}
                    className="cursor-pointer select-none bg-white flex flex-col h-[220px] w-[180px] p-[10px] pb-[20px] rounded-[7px] border-[1px] shadow-md items-center gap-[5px]"
                  >
                    <div className="w-full h-[50px] relative -mb-[50px] flex justify-end">
                      <div className="w-fit">
                        <button
                          onClick={() => {
                            RemoveSession(mp.accountID);
                          }}
                        >
                          <MdClose />
                        </button>
                      </div>
                    </div>
                    <div onClick={() => setAccount(mp)} className="w-full flex flex-1 items-center justify-center">
                      <div className="w-[130px] h-[130px] rounded-[130px] bg-accent-tertiary text-white flex items-center justify-center text-[50px] font-semibold">
                        {mp.accountName.firstname[0]}
                        {mp.accountName.lastname[0]}
                      </div>
                    </div>
                    <span
                      onClick={() => setAccount(mp)}
                      className="text-[14px] font-semibold font-Inter text-center text-text-tertiary overflow-hidden truncate w-full pl-[5px] pr-[5px]"
                    >
                      {`${mp.accountName.firstname} ${mp.accountName.middlename} ${mp.accountName.lastname}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>{' '}
      {/** bg-secondary */}
      <Options />
      <div className="h-full bg-transparent flex flex-1 justify-center items-center max-w-[600px] p-[20px]">
        <div className="bg-primary border-[1px] w-full max-w-[500px] h-full max-h-[700px] flex flex-col gap-[15px] justify-center items-center rounded-[10px] shadow-md p-[10px]">
          <div className="w-full max-w-[370px] flex flex-col gap-[50px] items-center justify-start pb-[10px]">
            <img src={NeonPOS} className="h-[100px]" alt="NEON" />
            <span className="text-[20px] font-semibold text-accent-secondary">Login</span>
          </div>
          {isFromSession && (
            <span className="text-[18px] text-accent-primary font-semibold font-Inter text-center text-text-tertiary overflow-hidden truncate w-full pl-[5px] pr-[5px]">
              {accountNamePreview}
            </span>
          )}
          <div className="w-full max-w-[370px] flex flex-col gap-[15px]">
            {!isFromSession && (
              <div className="border-[1px] shadow-sm h-[45px] rounded-[7px] flex flex-row">
                <div className="w-[45px] flex items-center justify-center">
                  <FcAssistant style={{ fontSize: '22px' }} />
                </div>
                <input
                  placeholder="Employee ID"
                  value={accountID}
                  onChange={(e) => {
                    setaccountID(e.target.value);
                  }}
                  className="bg-transparent outline-none text-[14px] w-full h-full flex flex-1"
                />
              </div>
            )}
            <div className="border-[1px] shadow-sm h-[45px] rounded-[7px] flex flex-row">
              <div className="w-[45px] flex items-center justify-center">
                <FcUnlock style={{ fontSize: '22px' }} />
              </div>
              <input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => {
                  setpassword(e.target.value);
                }}
                className="bg-transparent outline-none text-[14px] w-full h-full flex flex-1"
              />
            </div>
            {!isFromSession && (
              <div className="h-[25px] pl-[10px] pr-[10px] rounded-[7px] flex flex-row items-center justify-start w-full gap-[7px]">
                <input
                  type="checkbox"
                  checked={saveSession}
                  onChange={(e) => {
                    setsaveSession(e.target.checked);
                  }}
                  className="cursor-pointer bg-transparent outline-none text-[14px] h-full"
                />
                <span className="text-[13px] mt-[2px]">Save login session</span>
              </div>
            )}
          </div>
          <div className={`w-full max-w-[370px] ${isFromSession && 'pt-[10px]'} flex flex-col items-center gap-[5px]`}>
            <button
              disabled={isLoggingIn}
              onClick={LoginProcess}
              className="bg-accent-secondary hover:bg-accent-hover cursor-pointer w-full max-w-[200px] shadow-sm h-[40px] text-white font-semibold rounded-[7px]"
            >
              {isLoggingIn ? <Buttonloader size="14px" /> : <span>Login</span>}
            </button>
            {isFromSession && (
              <button
                disabled={isLoggingIn}
                onClick={() => {
                  setaccountID('');
                  setpassword('');
                  setisFromSession(false);
                  setaccountNamePreview('');
                }}
                className="pl-[10px] pr-[10px] bg-accent-tertiary flex flex-row items-center justify-start cursor-pointer w-full max-w-[150px] shadow-sm h-[35px] text-white rounded-[7px]"
              >
                {isLoggingIn ? (
                  <Buttonloader size="14px" />
                ) : (
                  <>
                    <div className="text-[14px] relative w-[20px] -mr-[10px]">
                      <MdArrowBackIos />
                    </div>
                    <span className="text-[14px] flex w-[calc(100%-20px)] justify-center">Back</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

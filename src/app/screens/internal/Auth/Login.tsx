import React, { useState } from 'react';
import { FcAssistant, FcUnlock } from 'react-icons/fc';
import { useDispatch, useSelector } from 'react-redux';
import { MdArrowBackIos } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import NeonPOS from '../../../../assets/NeonPOS.png';
import { SET_AUTHENTICATION } from '../../../redux/types/types';
import { dispatchnewalert } from '../../../helpers/utils/alertdispatching';
import { SavedAccountSessionsInterface, SettingsInterface } from '../../../helpers/variables/interfaces';
import Buttonloader from '../../../reusables/loaders/Buttonloader';
import { RootState } from '../../../redux/store/store';
import Options from '../../../reusables/components/login/Options';
import AccountSessions from '../../../reusables/components/login/AccountSessions';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { LoginSchema } from '../../../lib/schema/AuthSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Session } from '../../../lib/typings/Auth';
import { DataService } from '../../../helpers/http/dataService';
import BACKDOOR from '../../../lib/endpoints/Backdoor';
import BGLayout from '../../../reusables/BGLayout';

type LoginData = z.infer<typeof LoginSchema>;

function Login() {
  const settings: SettingsInterface = useSelector((state: RootState) => state.settings);
  const navigate = useNavigate();
  const [saveSession, setsaveSession] = useState<boolean>(false);

  const [session, setSession] = useState<Session>({
    isFromSession: false,
    namePreview: ''
  });

  const dispatch = useDispatch();

  const {
    register,
    setValue,
    trigger,
    handleSubmit,
    formState: { isSubmitting, isValid }
  } = useForm<LoginData>({
    resolver: zodResolver(LoginSchema)
  });

  const submitLogin = async (formData: LoginData) => {
    try {
      const response = await DataService.post(BACKDOOR.LOGIN, { ...formData, userID: settings.userID });
      const { data, authtoken } = response.data.result || {};

      if (saveSession) {
        const currentaccountsession = localStorage.getItem('account_sessions');
        if (currentaccountsession) {
          const parsedcurraccountsessions: SavedAccountSessionsInterface[] = JSON.parse(currentaccountsession);
          if (parsedcurraccountsessions.length > 0) {
            const accIDChecker = parsedcurraccountsessions.map((mp: SavedAccountSessionsInterface) => mp.accountID);
            if (!accIDChecker.includes(data.accountID)) {
              const JsonConvertedsessions = JSON.stringify([
                ...parsedcurraccountsessions,
                {
                  accountID: data.accountID,
                  accountName: data.accountName,
                  deviceID: settings.deviceID,
                  userID: settings.userID
                }
              ]);
              localStorage.setItem('account_sessions', JsonConvertedsessions);
            } else {
              const parsedaccsessionsnoncurrent = parsedcurraccountsessions.filter(
                (flt) => flt.accountID !== data.accountID
              );
              const JsonConvertedsessions = JSON.stringify([
                ...parsedaccsessionsnoncurrent,
                {
                  accountID: data.accountID,
                  accountName: data.accountName,
                  deviceID: settings.deviceID,
                  userID: settings.userID
                }
              ]);
              localStorage.setItem('account_sessions', JsonConvertedsessions);
            }
          } else {
            const JsonConvertedsessions = JSON.stringify([
              {
                accountID: data.accountID,
                accountName: data.accountName,
                deviceID: settings.deviceID,
                userID: settings.userID
              }
            ]);
            localStorage.setItem('account_sessions', JsonConvertedsessions);
          }
        } else {
          const JsonConvertedsessions = JSON.stringify([
            {
              accountID: data.accountID,
              accountName: data.accountName,
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
              ...data
            }
          }
        }
      });
      localStorage.setItem('authentication', authtoken);
      dispatchnewalert(dispatch, 'success', 'Successfully logged in');
      navigate('/app/');
    } catch (err) {
      console.log(err);
      dispatchnewalert(dispatch, 'error', 'Error logging in');
    }
  };

  return (
    <BGLayout className="bg-primary absolute flex flex-1 flex-row font-Inter">
      <AccountSessions setValue={setValue} trigger={trigger} setSession={setSession} />
      <Options />
      <div className="h-full bg-transparent flex flex-1 justify-center items-center max-w-[600px] p-[20px]">
        <div className="bg-primary border-[1px] w-full max-w-[500px] h-full max-h-[700px] flex flex-col gap-[15px] justify-center items-center rounded-[10px] shadow-md p-[10px]">
          <div className="w-full max-w-[370px] flex flex-col gap-[50px] items-center justify-start pb-[10px]">
            <img src={NeonPOS} className="h-[100px]" alt="NEON" />
            <span className="text-[20px] font-semibold text-accent-secondary">Login</span>
          </div>
          {session.isFromSession && (
            <span className="text-[18px] text-accent-primary font-semibold font-Inter text-center text-text-tertiary overflow-hidden truncate w-full pl-[5px] pr-[5px]">
              {session.namePreview}
            </span>
          )}

          {/* START OF THE FORM */}
          <form onSubmit={handleSubmit(submitLogin)}>
            <div className="w-full max-w-[370px] flex flex-col gap-[15px]">
              {!session.isFromSession && (
                <div className="border-[1px] shadow-sm h-[45px] rounded-[7px] flex flex-row">
                  <div className="w-[45px] flex items-center justify-center">
                    <FcAssistant style={{ fontSize: '22px' }} />
                  </div>
                  <input
                    {...register('accountID')}
                    placeholder="Employee ID"
                    className="bg-transparent outline-none text-[14px] w-full h-full flex flex-1"
                  />
                </div>
              )}
              <div className="border-[1px] shadow-sm h-[45px] rounded-[7px] flex flex-row">
                <div className="w-[45px] flex items-center justify-center">
                  <FcUnlock style={{ fontSize: '22px' }} />
                </div>
                <input
                  {...register('password')}
                  placeholder="Password"
                  type="password"
                  className="bg-transparent outline-none text-[14px] w-full h-full flex flex-1"
                />
              </div>
              {!session.isFromSession && (
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
            <div
              className={`w-full max-w-[370px] ${
                session.isFromSession && 'pt-[10px]'
              } flex flex-col items-center gap-[5px]`}
            >
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="bg-accent-secondary hover:bg-accent-hover cursor-pointer w-full max-w-[200px] shadow-sm h-[40px] text-white font-semibold rounded-[7px]"
              >
                {isSubmitting ? <Buttonloader size="14px" /> : <span>Login</span>}
              </button>
              {session.isFromSession && (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setSession({ isFromSession: false, namePreview: '' })}
                  className="pl-[10px] pr-[10px] bg-accent-tertiary flex flex-row items-center justify-start cursor-pointer w-full max-w-[150px] shadow-sm h-[35px] text-white rounded-[7px]"
                >
                  {isSubmitting ? (
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
          </form>
        </div>
      </div>
    </BGLayout>
  );
}

export default Login;

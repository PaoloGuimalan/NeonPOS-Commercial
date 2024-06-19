import { dispatchnewalert } from '../../../helpers/utils/alertdispatching';
import { SavedAccountSessionsInterface, SettingsInterface } from '../../../helpers/variables/interfaces';
import { RootState } from '@/app/redux/store/store';
import React, { SetStateAction, useEffect, useState, Dispatch } from 'react';
import { UseFormSetValue, UseFormTrigger } from 'react-hook-form';
import { MdClose } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { LoginSchema } from '../../../lib/schema/AuthSchema';
import { Session } from '../../../lib/typings/Auth';
import { z } from 'zod';

type LoginData = z.infer<typeof LoginSchema>;

type Props = {
  setValue: UseFormSetValue<LoginData>;
  trigger: UseFormTrigger<LoginData>;
  setSession: Dispatch<SetStateAction<Session>>;
};

function AccountSessions({ setValue, trigger, setSession }: Props) {
  const dispatch = useDispatch();
  const settings: SettingsInterface = useSelector((state: RootState) => state.settings);
  const [savedAccountSessions, setsavedAccountSessions] = useState<SavedAccountSessionsInterface[]>([]);

  const CheckSessions = () => {
    const accountsessions = localStorage.getItem('account_sessions');
    if (accountsessions) {
      const parsedaccsessions = JSON.parse(accountsessions);
      const filterparsedaccsessions = parsedaccsessions.filter(
        (flt: SavedAccountSessionsInterface) => flt.deviceID === settings.deviceID && flt.userID === settings.userID
      );
      setsavedAccountSessions(filterparsedaccsessions);
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
    }
  };

  const setAccount = (mp: SavedAccountSessionsInterface) => {
    setSession({
      isFromSession: true,
      namePreview: `${mp.accountName.firstname} ${mp.accountName.middlename} ${mp.accountName.lastname}`
    });
    setValue('accountID', mp.accountID);
    trigger('accountID');
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

  return (
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
    </div>
  );
}

export default AccountSessions;

import React, { useEffect, useRef, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AiOutlineLogout } from 'react-icons/ai';
import {
  MdAccountBox,
  MdAccountCircle,
  MdClose,
  MdDashboard,
  MdInventory,
  MdLock,
  MdOutlineRestaurantMenu
} from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { IoReceiptSharp } from 'react-icons/io5';
import { AlertsItem, AuthenticationInterface, SettingsInterface } from '../../../helpers/variables/interfaces';
import { SET_AUTHENTICATION } from '../../../redux/types/types';
import { authenticationstate } from '../../../redux/types/states';
import { dispatchclearalerts } from '../../../helpers/utils/alertdispatching';
import { CloseSSENotifications, SSENotificationsTRequest } from '../../../helpers/http/sse';
import { GetFilesListResponseNeonRemote } from '../../../helpers/http/requests';
import { routing } from '../../../helpers/variables/constants';
import { RootState } from '../../../redux/store/store';
import TroubleShootSettings from '../../../reusables/components/main/TroubleShootSettings';
import BGLayout from '../../../reusables/BGLayout';
import { NAVIGATIONS } from '../../../lib/statics/navigation';

function Main() {
  const authentication: AuthenticationInterface = useSelector((state: RootState) => state.authentication);
  const settings: SettingsInterface = useSelector((state: RootState) => state.settings);
  const alerts: AlertsItem[] = useSelector((state: RootState) => state.alerts);
  const dispatch = useDispatch();
  const [currenttab, setcurrenttab] = useState<string>('');
  const scrollDivAlerts = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const LogoutProcess = () => {
    CloseSSENotifications();
    dispatchclearalerts(dispatch);
    localStorage.removeItem('authentication');
    dispatch({
      type: SET_AUTHENTICATION,
      payload: {
        authentication: {
          auth: false,
          user: authenticationstate.user
        }
      }
    });
  };

  useEffect(() => {
    if (scrollDivAlerts.current) {
      const { scrollHeight, clientHeight } = scrollDivAlerts.current;
      const maxScrollTop = scrollHeight - clientHeight;
      scrollDivAlerts.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  }, [alerts, scrollDivAlerts]);

  useEffect(() => {
    if (settings) {
      SSENotificationsTRequest(dispatch, authentication, settings);

      window.Main.on('get-directories-output', (event: string) => {
        const parseddirs = JSON.parse(event);
        const finalpayload = {
          deviceID: settings.deviceID,
          toID: settings.userID,
          ...parseddirs
        };
        GetFilesListResponseNeonRemote({
          token: JSON.stringify(finalpayload)
        });
      });
    }
  }, [settings]);

  const navigateToTab = (path: string) => {
    setcurrenttab(path);
    navigate(`/app/${path}`);
  };

  // Button Animate css globalized
  const menuAnimation = (routingTab: string) => {
    const isActive = currenttab === routingTab;
    return {
      backgroundColor: isActive ? 'white' : 'transparent',
      color: isActive ? '#616161' : 'white'
    };
  };

  const whileHover = {
    backgroundColor: 'white',
    color: '#616161'
  };

  return (
    <BGLayout className="absolute flex flex-1 flex-row">
      <div className="flex bg-accent-tertiary  flex-1 flex-col max-w-[80px] items-center pt-[15px]">
        <div className="bg-transparent w-full flex flex-1 flex-col items-center p-[7px] pr-[0px] gap-[7px]">
          {NAVIGATIONS.map((item) => (
            <motion.button
              animate={menuAnimation(item.navigation)}
              whileHover={whileHover}
              onClick={() => {
                navigateToTab(item.navigation);
              }}
              className={`text-white w-full h-[70px] rounded-tl-[10px] rounded-bl-[10px] flex flex-col gap-[5px] items-center justify-center ${
                authentication.user.permissions.includes(item.permission) ? 'flex' : 'hidden'
              }`}
            >
              {item.icon}
              <span className="text-[12px]">{item.label}</span>
            </motion.button>
          ))}
        </div>
        <div className="bg-transparent w-full h-[200px] flex flex-col items-center justify-end p-[7px]">
          <TroubleShootSettings />
          <motion.button
            initial={{
              color: 'red'
            }}
            whileHover={{
              background: 'red',
              color: 'white'
            }}
            onClick={LogoutProcess}
            className="text-red w-full h-[70px] rounded-[10px] flex items-center justify-center"
          >
            <AiOutlineLogout style={{ fontSize: '27px' }} />
          </motion.button>
        </div>
      </div>
      <div className="bg-transparent flex flex-1 justify-center">
        <Outlet />
      </div>
    </BGLayout>
  );
}

export default Main;

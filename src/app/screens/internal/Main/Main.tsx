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
  MdOutlineRestaurantMenu,
  MdSettings
} from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { IoReceiptSharp } from 'react-icons/io5';
import { AlertsItem, AuthenticationInterface, SettingsInterface } from '../../../helpers/variables/interfaces';
import { SET_AUTHENTICATION } from '../../../redux/types/types';
import { authenticationstate } from '../../../redux/types/states';
import { dispatchclearalerts, dispatchnewalert } from '../../../helpers/utils/alertdispatching';
import { CloseSSENotifications, SSENotificationsTRequest } from '../../../helpers/http/sse';
import { GetFilesListResponseNeonRemote } from '../../../helpers/http/requests';
import NeonPOSSVG from '../../../../assets/NeonPOS_BG.svg';
import ReusableModal from '../../../reusables/ReusableModal';
import { routing } from '../../../helpers/variables/constants';
import { RootState } from '../../../redux/store/store';

function Main() {
  const authentication: AuthenticationInterface = useSelector((state: RootState) => state.authentication);
  const settings: SettingsInterface = useSelector((state: RootState) => state.settings);
  const alerts: AlertsItem[] = useSelector((state: RootState) => state.alerts);
  const dispatch = useDispatch();
  const [toggleTroubleshoot, settoggleTroubleshoot] = useState<boolean>(false);
  const [currenttab, setcurrenttab] = useState<string>('');

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
    // router.push("/internal/auth/login");
  };

  const scrollDivAlerts = useRef<HTMLDivElement>(null);

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

  const OpenNeonRemote = () => {
    // window.ipc.send('execute-command', 'gnome-terminal');
    // settoggleSettingsModal(false);
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

  const navigateToTab = (path: string) => {
    setcurrenttab(path);
    navigate(`/app/${path}`);
  };

  // Start of Refactored code

  // object of Settings Array mapped
  const settingsItem = [
    { label: 'Open Neon Remote', onClick: OpenNeonRemote, className: 'bg-green-500' },
    { label: 'Restart Reciept Window', onClick: RestartReceiptWindow, className: 'bg-green-700' },
    { label: 'Restart Report Window', onClick: RestartReportWindow, className: 'bg-orange-500' }
  ];

  // Button Animate css globalized
  const menuAnimation = (routingTab: string) => {
    return {
      backgroundColor: currenttab === routingTab ? 'white' : 'transparent',
      color: currenttab === routingTab ? '#616161' : 'white'
    };
  };

  const whileHover = {
    backgroundColor: 'white',
    color: '#616161'
  };

  return (
    <div
      style={{
        background: `url(${NeonPOSSVG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'bottom',
        backgroundRepeat: 'no-repeat'
      }}
      className="w-full h-full bg-primary absolute flex flex-1 flex-row"
    >
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
                  <button
                    onClick={setting.onClick}
                    className={`h-[30px] w-full ${setting.className} cursor-pointer shadow-sm text-white font-semibold rounded-[4px]`}
                  >
                    <span className="text-[14px]">{setting.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          }
        />
      )}
      <div className="flex bg-accent-tertiary  flex-1 flex-col max-w-[80px] items-center pt-[15px]">
        <div className="bg-transparent w-full flex flex-1 flex-col items-center p-[7px] pr-[0px] gap-[7px]">
          {authentication.user.permissions.includes('navigate_dashboard') && (
            <motion.button
              animate={menuAnimation(routing.DASHBOARD_ROUTE)}
              whileHover={whileHover}
              onClick={() => {
                navigateToTab(routing.DASHBOARD_ROUTE);
              }}
              className="text-white w-full h-[70px] rounded-tl-[10px] rounded-bl-[10px] flex flex-col gap-[5px] items-center justify-center"
            >
              <MdDashboard style={{ fontSize: '30px' }} />
              <span className="text-[12px]">Dashboard</span>
            </motion.button>
          )}
          {authentication.user.permissions.includes('navigate_menu') && (
            <motion.button
              animate={menuAnimation(routing.MENU_ROUTE)}
              whileHover={whileHover}
              onClick={() => {
                navigateToTab(routing.MENU_ROUTE);
              }}
              className="text-white w-full h-[70px] rounded-tl-[10px] rounded-bl-[10px] flex flex-col gap-[5px] items-center justify-center"
            >
              <MdOutlineRestaurantMenu style={{ fontSize: '30px' }} />
              <span className="text-[12px]">Menu</span>
            </motion.button>
          )}
          {authentication.user.permissions.includes('navigate_orders') && (
            <motion.button
              animate={menuAnimation(routing.ORDERS_ROUTE)}
              whileHover={whileHover}
              onClick={() => {
                navigateToTab(routing.ORDERS_ROUTE);
              }}
              className="text-white w-full h-[70px] rounded-tl-[10px] rounded-bl-[10px] flex flex-col gap-[5px] items-center justify-center"
            >
              <IoReceiptSharp style={{ fontSize: '30px' }} />
              <span className="text-[12px]">Orders</span>
            </motion.button>
          )}
          {authentication.user.permissions.includes('navigate_inventory') && (
            <motion.button
              animate={menuAnimation(routing.INVENTORY_ROUTE)}
              whileHover={whileHover}
              onClick={() => {
                navigateToTab(routing.INVENTORY_ROUTE);
              }}
              className="text-white w-full h-[70px] rounded-tl-[10px] rounded-bl-[10px] flex flex-col gap-[5px] items-center justify-center"
            >
              <MdInventory style={{ fontSize: '30px' }} />
              <span className="text-[12px]">Inventory</span>
            </motion.button>
          )}
          {(authentication.user.permissions.includes('navigate_permissions') ||
            authentication.user.accountType === 'Admin') && ( // authentication.user.permissions.includes("navigate_permissions")
            <motion.button
              animate={menuAnimation(routing.PERMISSIONS_ROUTE)}
              whileHover={whileHover}
              onClick={() => {
                navigateToTab(routing.PERMISSIONS_ROUTE);
              }}
              className="text-white w-full h-[70px] rounded-tl-[10px] rounded-bl-[10px] flex flex-col gap-[5px] items-center justify-center"
            >
              <MdLock style={{ fontSize: '30px' }} />
              <span className="text-[12px]">Permissions</span>
            </motion.button>
          )}
          {authentication.user.permissions.includes('navigate_users') && (
            <motion.button
              animate={menuAnimation(routing.USERS_ROUTE)}
              whileHover={whileHover}
              onClick={() => {
                navigateToTab(routing.USERS_ROUTE);
              }}
              className="text-white w-full h-[70px] rounded-tl-[10px] rounded-bl-[10px] flex flex-col gap-[5px] items-center justify-center"
            >
              <MdAccountBox style={{ fontSize: '30px' }} />
              <span className="text-[12px]">Users</span>
            </motion.button>
          )}
          {authentication.user.permissions.includes('navigate_account') && (
            <motion.button
              animate={menuAnimation(routing.ACCOUNT_ROUTE)}
              whileHover={whileHover}
              onClick={() => {
                navigateToTab(routing.ACCOUNT_ROUTE);
              }}
              className="text-white w-full h-[70px] rounded-tl-[10px] rounded-bl-[10px] flex flex-col gap-[5px] items-center justify-center"
            >
              <MdAccountCircle style={{ fontSize: '30px' }} />
              <span className="text-[12px]">Account</span>
            </motion.button>
          )}
        </div>
        <div className="bg-transparent w-full h-[200px] flex flex-col items-center justify-end p-[7px]">
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
    </div>
  );
}

export default Main;

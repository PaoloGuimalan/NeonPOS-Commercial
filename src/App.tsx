import React, { useEffect, useRef, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Splash from './app/reusables/Splash';
import { AlertsItem, AuthenticationInterface, SettingsInterface } from './app/helpers/variables/interfaces';
import { SET_AUTHENTICATION, SET_SETTINGS } from './app/redux/types/types';
import { authenticationstate } from './app/redux/types/states';
import Setup from './app/screens/setup/Setup';
import Alert from './app/reusables/widgets/Alert';
import Login from './app/screens/internal/Auth/Login';
import Main from './app/screens/internal/Main/Main';
import ExternalContainer from './app/screens/external/ExternalContainer';
import { RootState } from './app/redux/store/store';
import { DataService } from './app/helpers/http/dataService';
import BACKDOOR from './app/lib/endpoints/Backdoor';
import WelcomeBanner from './app/reusables/holders/WelcomeBanner';

function App() {
  const authentication: AuthenticationInterface = useSelector((state: RootState) => state.authentication);
  const alerts: AlertsItem[] = useSelector((state: RootState) => state.alerts);
  const settings: SettingsInterface = useSelector((state: RootState) => state.settings);
  const dispatch = useDispatch();

  const [isSettingsDone, setisSettingsDone] = useState<boolean | null>(null);
  const scrollDivAlerts = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollDivAlerts.current) {
      const { scrollHeight, clientHeight } = scrollDivAlerts.current;
      const maxScrollTop = scrollHeight - clientHeight;
      scrollDivAlerts.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  }, [alerts, scrollDivAlerts]);

  useEffect(() => {
    const settingsstorage = localStorage.getItem('settings');

    if (settingsstorage) {
      setisSettingsDone(true);
      dispatch({
        type: SET_SETTINGS,
        payload: {
          settings: JSON.parse(settingsstorage)
        }
      });
    } else {
      setisSettingsDone(false);
    }
  }, []);

  useEffect(() => {
    const settingsstorage = localStorage.getItem('settings');

    if (settingsstorage) {
      if (!isSettingsDone) {
        window.ipcRenderer.send('open-printables', '');
        if (JSON.parse(settingsstorage).setup === 'POS') {
          window.ipcRenderer.send('enable-external', JSON.parse(settingsstorage).setup);
        }
      }
      setisSettingsDone(true);
    } else {
      setisSettingsDone(false);
    }
  }, [settings]);

  const refreshAuthToken = async () => {
    try {
      const response = await DataService.get(BACKDOOR.RFSH);
      const { status } = response.data || {};
      const { data } = response.data.result || {};

      if (status) {
        dispatch({
          type: SET_AUTHENTICATION,
          payload: {
            authentication: {
              auth: true,
              user: data
            }
          }
        });
      } else {
        dispatch({
          type: SET_AUTHENTICATION,
          payload: {
            authentication: {
              auth: false,
              user: authenticationstate.user
            }
          }
        });
      }
    } catch (err) {
      dispatch({
        type: SET_AUTHENTICATION,
        payload: {
          authentication: {
            auth: false,
            user: authenticationstate.user
          }
        }
      });
    }
  };

  useEffect(() => {
    refreshAuthToken();
  }, []);

  const renderRootRoue = () => {
    if (!isSettingsDone) return <Navigate to="/setup" />;

    if (authentication.auth === null) {
      return <Splash />;
    }

    return authentication.auth ? <Main /> : <Navigate to="/login" />;
  };

  return (
    <div className="flex flex-col h-screen w-full">
      <div id="div_alerts_container" ref={scrollDivAlerts}>
        {alerts.map((alert) => {
          return <Alert key={alert.id} al={alert} />;
        })}
      </div>
      <Routes>
        <Route path="/app/*" element={renderRootRoue()}>
          <Route index element={<WelcomeBanner />} />
        </Route>

        <Route path="/setup/*" element={isSettingsDone ? <Navigate to="/app" /> : <Setup />} />
        <Route path="/login" element={isSettingsDone || authentication.auth ? <Login /> : <Navigate to="/app" />} />
        <Route path="/external/*" element={<ExternalContainer />} />
      </Routes>
    </div>
  );
}

export default App;

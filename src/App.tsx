import React, { useEffect, useRef, useState } from 'react';
import AppBar from './AppBar';
import { Navigate, Route, Routes } from 'react-router-dom';
import Splash from './app/reusables/Splash';
import { AlertsItem, AuthenticationInterface, SettingsInterface } from './app/helpers/variables/interfaces';
import { useDispatch, useSelector } from 'react-redux';
import { SET_AUTHENTICATION, SET_SETTINGS } from './app/redux/types/types';
import { RefreshAuthRequest } from './app/helpers/http/requests';
import { authenticationstate } from './app/redux/types/states';
import Setup from './app/screens/setup/Setup';
import Alert from './app/reusables/widgets/Alert';
import Login from './app/screens/internal/Auth/Login';
import Home from './app/screens/internal/Home/Home';

function App() {
  const authentication: AuthenticationInterface = useSelector((state: any) => state.authentication);
  const alerts: AlertsItem[] = useSelector((state: any) => state.alerts);
  const settings: SettingsInterface = useSelector((state: any) => state.settings);
  const dispatch = useDispatch();

  const [isSettingsDone, setisSettingsDone] = useState<boolean | null>(null);
  const [isAuthLoading, setisAuthLoading] = useState<boolean>(true);

  const scrollDivAlerts = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(scrollDivAlerts.current){
      const scrollHeight = scrollDivAlerts.current.scrollHeight;
      const clientHeight = scrollDivAlerts.current.clientHeight;
      const maxScrollTop = scrollHeight - clientHeight
      scrollDivAlerts.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  },[alerts, scrollDivAlerts]);

  // useEffect(() => {
  //   if(authentication.auth){
  //     router.push("/internal/home/home");
  //   }
  // }, [authentication]);

  useEffect(() => {
    const settingsstorage = localStorage.getItem("settings");

    if(settingsstorage){
      setisSettingsDone(true);
      dispatch({
        type: SET_SETTINGS,
        payload: {
          settings: JSON.parse(settingsstorage)
        }
      });
    }
    else{
      setisSettingsDone(false);
    }
  }, []);

  useEffect(() => {
    const settingsstorage = localStorage.getItem("settings");

    if(settingsstorage){
      if(!isSettingsDone){
        if(JSON.parse(settingsstorage).setup === "POS"){
          window.ipcRenderer.send("enable-external", JSON.parse(settingsstorage).setup);
        }
      }
      setisSettingsDone(true);
    }
    else{
      setisSettingsDone(false);
    }
  }, [settings]);

  useEffect(() => {
    const authenticationtoken = localStorage.getItem("authtoken");
    if(authenticationtoken){
      RefreshAuthRequest(authenticationtoken).then((response) => {
        if(response.data.status){
          dispatch({
            type: SET_AUTHENTICATION,
            payload: {
              authentication: {
                auth: true,
                user: response.data.result.data
              }
            }
          });
        }
        else{
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
      }).catch((err) => {
        dispatch({
          type: SET_AUTHENTICATION,
          payload: {
            authentication: {
              auth: false,
              user: authenticationstate.user
            }
          }
        });
      })
      // setisAuthLoading(false);
    }
    else{
      dispatch({
        type: SET_AUTHENTICATION,
        payload: {
          authentication: {
            auth: false,
            user: authenticationstate.user
          }
        }
      });
      // setisAuthLoading(false);
    }
  },[])

  return (
    <div className="flex flex-col h-screen w-full">
      <div id='div_alerts_container' ref={scrollDivAlerts}>
        {alerts.map((al: any, i: number) => {
          return(
            <Alert key={i} al={al} />
          )
        })}
      </div>
      <Routes>
        <Route path='/*' element={isSettingsDone ? authentication.auth !== null ? authentication.auth ? <Home /> : <Navigate to="/login" /> : <Splash /> : <Navigate to="/setup" />} />
        <Route path='/setup/*' element={isSettingsDone ? <Navigate to="/" /> : <Setup />} />
        <Route path='/login' element={authentication.auth !== null ? authentication.auth ? <Navigate to="/" /> : <Login /> : <Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;

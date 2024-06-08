import sign from 'jwt-encode'
import { jwtDecode } from 'jwt-decode'
import { Dispatch } from '@reduxjs/toolkit';
import { AuthenticationInterface, SettingsInterface } from '../variables/interfaces';
import CONFIG from '../variables/config';

const API = CONFIG.NEONSERVICE;
const SECRET = CONFIG.JWTSECRET;

var sseNtfsSource: any = null

const SSENotificationsTRequest = (dispatch: Dispatch<any>, authentication: AuthenticationInterface, settings: SettingsInterface) => {
    sseNtfsSource = new EventSource(`${API}/access/ssehandshake/${settings.connectionToken}`);

    sseNtfsSource.addEventListener('devicefileslist', (e: any) => {
        const parsedresponse = JSON.parse(e.data)
        
        if(parsedresponse.status){
            const decodedresult: any = jwtDecode(parsedresponse.result);
            if(decodedresult.data.deviceID === settings.deviceID){
                try{
                    window.ipcRenderer.send("get-directories", decodeURIComponent(decodedresult.data.path));
                    // window.Main.sendMessage(JSON.stringify({ event: 'get-directories', data: decodeURIComponent(decodedresult.data.path) }));
                }
                catch(err){
                    console.log(err);
                }
            }
        }
    })
}

const CloseSSENotifications = () => {
    if(sseNtfsSource){
        sseNtfsSource.close()
    }
}

export {
    SSENotificationsTRequest,
    CloseSSENotifications
}
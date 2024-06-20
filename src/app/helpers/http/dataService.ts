/* eslint-disable no-param-reassign */
import axios from 'axios';
import CONFIG from '../variables/config';
import { CONFIGURATION, URLTYPE } from '../../lib/typings/DataService';
import getToken from './getToken';

export const API_ENDPOINT_STAGING = import.meta.env.VITE_API_URL;

export const client = axios.create({
  headers: {
    'Content-Type': 'application/json'
  }
});

const BASEURL = CONFIG as CONFIGURATION;

class DataService {
  static get(path = '', type: URLTYPE = 'BACKDOOR') {
    return client({
      method: 'GET',
      baseURL: BASEURL[type],
      url: path,
      headers: {}
    });
  }

  static getMedia(path = '', type: URLTYPE = 'BACKDOOR') {
    return client({
      method: 'GET',
      url: path,
      baseURL: BASEURL[type],
      headers: {},
      responseType: 'blob'
    });
  }

  static post(path = '', data = {}, type: URLTYPE = 'BACKDOOR', optionalHeader = {}) {
    return client({
      method: 'POST',
      url: path,
      baseURL: BASEURL[type],
      data,
      headers: { ...optionalHeader }
    });
  }

  static postMedia(path = '', data = {}, optionalHeader = {}, type: URLTYPE = 'BACKDOOR') {
    return client({
      method: 'POST',
      url: path,
      baseURL: BASEURL[type],
      data,
      headers: { 'Content-Type': 'multipart/form-data', ...optionalHeader }
    });
  }

  static patch(path = '', data = {}, type: URLTYPE = 'BACKDOOR') {
    return client({
      method: 'PATCH',
      url: path,
      baseURL: BASEURL[type],
      data: JSON.stringify(data),
      headers: {}
    });
  }

  static delete(path = '', data = {}, type: URLTYPE = 'BACKDOOR') {
    return client({
      method: 'DELETE',
      url: path,
      baseURL: BASEURL[type],
      data: JSON.stringify(data),
      headers: {}
    });
  }

  static put(path = '', data = {}, type: URLTYPE = 'BACKDOOR') {
    return client({
      method: 'PUT',
      url: path,
      baseURL: BASEURL[type],
      data,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  static putMedia(path = '', data = {}, type: URLTYPE = 'BACKDOOR') {
    return client({
      method: 'PUT',
      url: path,
      baseURL: BASEURL[type],
      data,
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
}

/**
 * axios interceptors runs before and after a request, letting the developer modify req,req more
 * For more details on axios interceptor see https://github.com/axios/axios#interceptors
 */
client.interceptors.request.use((config) => {
  const token = getToken('authentication');

  if (token) {
    config.headers['x-access-token'] = `${token}`;
  }

  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    /**
     * Do something in case the response returns an error code [3**, 4**, 5**] etc
     * For example, on token expiration retrieve a new access token, retry a failed request etc
     */
    const { response } = error;

    if (response) {
      if (response.status === 401) {
        localStorage.clear();

        if (window.location.pathname !== '/login') {
          // window.location.href = '/'
        }
      } else {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);
export { DataService };

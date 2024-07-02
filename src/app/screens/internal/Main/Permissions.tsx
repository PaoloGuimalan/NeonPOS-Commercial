import React, { useEffect, useState } from 'react';
import {
  CreateNewPermissionRequest,
  DeletePermissionRequest,
  GetPermissionsRequest,
  GetSpecificUserRequest
} from '../../../helpers/http/requests';
import { Authentication, Settings, Permission } from '../../../lib/typings/Auth';
import { IoClose } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { dispatchnewalert } from '../../../helpers/utils/alertdispatching';
import Buttonloader from '../../../reusables/loaders/Buttonloader';
import Pageloader from '../../../reusables/loaders/Pageloader';
import { SET_AUTHENTICATION } from '../../../redux/types/types';
import sign from 'jwt-encode';
// import { JWT_SECRET } from '../../../../helpers/typings/keys';
import PermissionItem from '../../../reusables/widgets/PermissionItem';
import { DataService } from '../../../helpers/http/dataService';
import BACKDOOR from '../../../lib/endpoints/Backdoor';
import { Empty } from '../../../reusables/components';

function Permissions() {
  const authentication: Authentication = useSelector((state: any) => state.authentication);
  const settings: Settings = useSelector((state: any) => state.settings);
  const dispatch = useDispatch();

  const [isPermissionSaving, setIsPermissionSaving] = useState<boolean>(false);
  const [isPermissionDeleting, setIsPermissionDeleting] = useState<boolean>(false);

  const [permissions, setPermissions] = useState<Permission[]>([]);

  const [permissionType, setPermissionType] = useState<string>('');
  const [allowedusers, setAllowedUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const GetPermissionsProcess = async () => {
    try {
      const response = await DataService.get(BACKDOOR.GET_PERMISSIONS);
      const { status, result } = response.data || {};

      if (result) {
        setPermissions(result);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const GetSpecificUserProcess = () => {
    GetSpecificUserRequest(settings.userID, authentication.user.accountID)
      .then((response) => {
        if (response.data.status) {
          // alert(JSON.stringify(response.data.result));
          dispatch({
            type: SET_AUTHENTICATION,
            payload: {
              authentication: {
                auth: true,
                user: {
                  ...response.data.result[0]
                }
              }
            }
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const CreateNewPermissionProcess = () => {
    if (permissionType.trim() !== '' && allowedusers.length > 0) {
      setIsPermissionSaving(true);
      CreateNewPermissionRequest({
        permissionType: permissionType,
        allowedUsers: allowedusers,
        userID: settings.userID,
        deviceID: settings.deviceID
      })
        .then((response) => {
          if (response.data.status) {
            GetPermissionsProcess();
            setPermissionType('');
            setAllowedUsers([]);
            dispatchnewalert(dispatch, 'success', 'New permission has been added');
            GetSpecificUserProcess();
          }
          setIsPermissionSaving(false);
        })
        .catch((err) => {
          setIsPermissionSaving(false);
          console.log(err);
        });
    } else {
      dispatchnewalert(dispatch, 'warning', 'Please complete the fields');
    }
  };

  useEffect(() => {
    GetPermissionsProcess();
  }, [settings]);

  return (
    <div className="w-full flex flex-row bg-shade font-Inter">
      <div className="flex flex-1 flex-col p-[20px] gap-[10px]">
        <span className="font-semibold text-[20px]">Permissions</span>
        <div className="w-full flex flex-col gap-[0px] bg-white p-[15px] pt-[0px] h-full overflow-y-scroll">
          <div className="pt-[20px] sticky top-0 bg-white">
            <div className="bg-header border-[1px] p-[15px] flex flex-row">
              <span className="text-[15px] flex flex-1 font-semibold">Type</span>
              <span className="text-[15px] flex flex-1 font-semibold">Allowed Users</span>
              <span className="text-[15px] flex font-semibold w-full max-w-[180px]">Actions</span>
            </div>
          </div>
          {!isLoading ? (
            permissions.length > 0 ? (
              permissions.map((mp: Permission, i: number) => {
                return (
                  <PermissionItem
                    key={mp.permissionID}
                    mp={mp}
                    GetPermissionsProcess={GetPermissionsProcess}
                    GetSpecificUserProcess={GetSpecificUserProcess}
                  />
                );
              })
            ) : (
              <div className="w-full flex flex-1">
                <Empty size="w-20" title="NO Permissions" />
              </div>
            )
          ) : (
            <div className="w-full flex flex-1">
              <Pageloader />
            </div>
          )}
        </div>
      </div>
      <div className="w-full max-w-[450px] bg-shade p-[0px] flex flex-col pt-[20px] pb-[20px] pr-[10px] gap-[10px]">
        <span className="font-semibold text-[20px]">Add Permission</span>
        <div className="shadow-lg border-[1px] w-full flex flex-col gap-[10px] bg-white p-[15px] pt-[20px] h-fit">
          <div className="w-full flex flex-col gap-[5px]">
            <span className="text-[15px] font-semibold">Permission Type</span>
            <input
              type="text"
              value={permissionType}
              onChange={(e) => {
                setPermissionType(e.target.value);
              }}
              placeholder="Input a permission"
              className="w-full border-[1px] h-[35px] text-[14px] pl-[10px] pr-[10px]"
            />
          </div>
          <div className="w-full flex flex-col gap-[5px]">
            <span className="text-[15px] font-semibold">Allowed Users</span>
            <div className="w-full flex flex-row gap-[5px]">
              {allowedusers.map((mp: string, i: number) => {
                return (
                  <div
                    key={i}
                    className="bg-accent-tertiary flex flex-row items-center p-[7px] pl-[15px] rounded-[10px]"
                  >
                    <span className="text-[14px] text-white">{mp}</span>
                    <button
                      className="btn_remove_selected"
                      onClick={() => {
                        const newsetofusers = allowedusers.filter((flt: string) => flt !== mp);
                        setAllowedUsers(newsetofusers);
                      }}
                    >
                      <IoClose style={{ fontSize: '17px', color: 'white' }} />
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="bg-shade p-[20px] flex flex-col gap-[5px]">
              <div className="bg-white w-full p-[10px] flex flex-row h-[60px] gap-[10px] items-center">
                <input
                  type="checkbox"
                  checked={allowedusers.includes('Admin')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setAllowedUsers((prev) => [...prev, 'Admin']);
                    } else {
                      const newsetofusers = allowedusers.filter((flt: string) => flt !== 'Admin');
                      setAllowedUsers(newsetofusers);
                    }
                  }}
                />
                <span className="text-[14px]">Admin / Developer / Technician</span>
              </div>
              <div className="bg-white w-full p-[10px] flex flex-row h-[60px] gap-[10px] items-center">
                <input
                  type="checkbox"
                  checked={allowedusers.includes('Manager')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setAllowedUsers((prev) => [...prev, 'Manager']);
                    } else {
                      const newsetofusers = allowedusers.filter((flt: string) => flt !== 'Manager');
                      setAllowedUsers(newsetofusers);
                    }
                  }}
                />
                <span className="text-[14px]">Manager</span>
              </div>
              <div className="bg-white w-full p-[10px] flex flex-row h-[60px] gap-[10px] items-center">
                <input
                  type="checkbox"
                  checked={allowedusers.includes('Waiter')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setAllowedUsers((prev) => [...prev, 'Waiter']);
                    } else {
                      const newsetofusers = allowedusers.filter((flt: string) => flt !== 'Waiter');
                      setAllowedUsers(newsetofusers);
                    }
                  }}
                />
                <span className="text-[14px]">Waiter</span>
              </div>
              <div className="bg-white w-full p-[10px] flex flex-row h-[60px] gap-[10px] items-center">
                <input
                  type="checkbox"
                  checked={allowedusers.includes('Cashier')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setAllowedUsers((prev) => [...prev, 'Cashier']);
                    } else {
                      const newsetofusers = allowedusers.filter((flt: string) => flt !== 'Cashier');
                      setAllowedUsers(newsetofusers);
                    }
                  }}
                />
                <span className="text-[14px]">Cashier</span>
              </div>
            </div>
          </div>
          <div className="w-full h-fit flex flex-col gap-[5px] pt-[10px]">
            <button
              disabled={isPermissionSaving}
              onClick={CreateNewPermissionProcess}
              className="h-[30px] bg-accent-tertiary cursor-pointer shadow-sm text-white font-semibold rounded-[4px]"
            >
              {isPermissionSaving ? <Buttonloader size="14px" /> : <span className="text-[14px]">Add</span>}
            </button>
            <button className="h-[30px] bg-red-500 cursor-pointer shadow-sm text-white font-semibold rounded-[4px]">
              <span className="text-[14px]">Clear</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Permissions;

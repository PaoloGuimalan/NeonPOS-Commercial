import React, { Dispatch, SetStateAction, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Authentication, Permission } from '../../lib/typings/Auth';
import { dispatchnewalert } from '../../helpers/utils/alertdispatching';
import { Button } from '../components';
import { DataService } from '../../helpers/http/dataService';
import BACKDOOR from '../../lib/endpoints/Backdoor';
import { RootState } from '../../redux/store/store';
import { SET_AUTHENTICATION } from '../../redux/types/types';

type Props = {
  permission: Permission;
  setRefetch: Dispatch<SetStateAction<boolean>>;
};

function PermissionItem({ permission, setRefetch }: Props) {
  const dispatch = useDispatch();
  const authentication: Authentication = useSelector((state: RootState) => state.authentication);
  const [isPermissionDeleting, setIsPermissionDeleting] = useState<boolean>(false);

  const getSpecificUserProcess = async () => {
    try {
      const response = await DataService.get(BACKDOOR.GET_CURRENT_USER(authentication.user.accountID));
      const { result } = response.data || {};

      dispatch({
        type: SET_AUTHENTICATION,
        payload: {
          authentication: {
            auth: true,
            user: {
              ...result[0]
            }
          }
        }
      });
    } catch (err) {
      console.error(err);
      dispatchnewalert(dispatch, 'error', 'Error fetching user data');
    }
  };

  const deletePermission = async () => {
    try {
      setIsPermissionDeleting(true);
      const response = await DataService.delete(BACKDOOR.DELETE_PERMISSION(permission.permissionID));
      const { message } = response?.data || {};
      dispatchnewalert(dispatch, 'success', message);
      getSpecificUserProcess();
      setRefetch((prev) => !prev);
    } catch (err) {
      console.error(err);
      dispatchnewalert(dispatch, 'error', 'Error making deletion request');
    } finally {
      setIsPermissionDeleting(false);
    }
  };

  return (
    <div className="bg-white border-[1px] p-[15px] flex w-full">
      <div className="flex flex-1 gap-[10px] items-center">
        <span className="text-[14px]">{permission.permissionType}</span>
      </div>
      <div className="flex flex-1 flex-row gap-[5px]">
        {permission.allowedUsers.map((user: string) => {
          return (
            <div key={user} className="text-[14px] bg-accent-tertiary text-white flex p-[5px] pl-[8px] pr-[8px]">
              <span>{user}</span>
            </div>
          );
        })}
      </div>
      <div className="w-full max-w-[180px] flex flex-row gap-[5px]">
        <Button className="bg-shade  text-white font-semibold">{permission.isEnabled ? 'Disable' : 'Enable'}</Button>
        <Button
          disabled={isPermissionDeleting}
          loading={isPermissionDeleting}
          onClick={deletePermission}
          className="bg-red-500  text-white font-semibold"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

export default PermissionItem;

import React, { Dispatch, SetStateAction, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dispatchnewalert } from '../../../helpers/utils/alertdispatching';
import { UserAccount } from '../../../lib/typings/Auth';
import { Authentication, Settings } from '../../../lib/typings/Auth';

import { RootState } from '../../../redux/store/store';
import Button from '../button/Button';
import { DataService } from '../../../helpers/http/dataService';
import BACKDOOR from '../../../lib/endpoints/Backdoor';
import RemoveUser from './RemoveUser';

type Props = {
  mp: UserAccount;
  setUpdateUsers: Dispatch<SetStateAction<boolean>>;
};

function User({ mp, setUpdateUsers }: Props) {
  const authentication: Authentication = useSelector((state: RootState) => state.authentication);
  const dispatch = useDispatch();

  const [isRemovingUser, setisRemovingUser] = useState<boolean>(false);

  const RemoveUserProcess = async () => {
    try {
      setisRemovingUser(true);
      const response = await DataService.delete(BACKDOOR.REMOVE_USER(mp.accountID));

      setUpdateUsers((prev) => !prev);
      dispatchnewalert(dispatch, 'success', response.data.message);
    } catch (err) {
      console.log(err);
      dispatchnewalert(dispatch, 'error', 'Failed to delete user. Please try again!');
    } finally {
      setisRemovingUser(false);
    }
  };

  const DisableUserAccountProcess = () => {
    dispatchnewalert(dispatch, 'info', 'Disable account still in progress');
  };

  return (
    <div className="bg-white shadow-md flex flex-col p-[20px] h-fit w-full max-w-[350px]">
      <div className="w-full">
        <span className="font-semibold text-[17px]">
          {mp.accountName.lastname}, {mp.accountName.firstname}, {mp.accountName.middlename}
        </span>
      </div>
      <div className="w-full">
        <span className="text-[14px]">{mp.accountID}</span>
      </div>
      <div className="w-full pt-[15px] flex flex-row">
        <div className="flex flex-1">
          <div className="text-[14px] w-fit bg-accent-tertiary text-white flex p-[5px] pl-[8px] pr-[8px]">
            <span>{mp.accountType}</span>
          </div>
        </div>
        <div className="flex flex-row justify-end gap-[4px]">
          {authentication.user.accountID !== mp.accountID && authentication.user.permissions.includes('disable_user') && (
            <button
              onClick={DisableUserAccountProcess}
              className="text-[14px] w-fit bg-orange-500 text-white flex p-[5px] pl-[8px] pr-[8px] rounded-[4px]"
            >
              <span>Disable</span>
            </button>
          )}
          {authentication.user.accountID !== mp.accountID &&
            authentication.user.permissions.includes('delete_user') && (
              <RemoveUser disabled={isRemovingUser} onConfirm={RemoveUserProcess} />
            )}
        </div>
      </div>
    </div>
  );
}

export default User;

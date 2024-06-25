import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dispatchnewalert } from '../../../helpers/utils/alertdispatching';
import AnimatedLoader from '../../../reusables/AnimatedLoader';
import { User, Button } from '../../../reusables/components';
import { RootState } from '../../../redux/store/store';
import { Authentication, Settings } from '../../../lib/typings/Auth';
import { UserAccount } from '../../../lib/typings/Auth';
import { DataService } from '../../../helpers/http/dataService';
import BACKDOOR from '../../../lib/endpoints/Backdoor';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { UserSchema } from '../../../lib/schema/UserSchema';
import Empty from '../../../reusables/components/empty/Empty';

type UserData = z.infer<typeof UserSchema>;

function Users() {
  const authentication: Authentication = useSelector((state: RootState) => state.authentication);
  const settings: Settings = useSelector((state: RootState) => state.settings);
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [updateUsers, setUpdateUsers] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid }
  } = useForm<UserData>({
    resolver: zodResolver(UserSchema)
  });

  const getUsers = async () => {
    try {
      const response = await DataService.get(BACKDOOR.GET_USER);
      const { result } = response.data;
      setUsers(result);
    } catch (err) {
      console.log(err);
      dispatchnewalert(dispatch, 'error', 'Failed to get list of users. Please refresh the app!');
    } finally {
      setIsLoading(false);
    }
  };

  const registerAccount = async (data: UserData) => {
    try {
      await DataService.post(BACKDOOR.REGISTER, {
        ...data,
        creatorAccountID: authentication.user.accountID,
        deviceID: settings.deviceID,
        userID: settings.userID
      });
      dispatchnewalert(dispatch, 'success', 'Created account successfully');
      reset();

      //   * REFETCH USERS
      setUpdateUsers((prev) => !prev);
    } catch (err) {
      dispatchnewalert(dispatch, 'error', 'Something went wrong. Please try again!');
    }
  };

  useEffect(() => {
    getUsers();
  }, [settings, updateUsers]);

  // console.log(window.location);

  return (
    <div className="w-full flex flex-row bg-shade font-Inter">
      <div className="flex flex-1 flex-col p-[20px] gap-[10px]">
        <span className="font-semibold text-[20px]">Users</span>
        <div className="w-full flex flex-row gap-[5px] p-[15px] pt-[15px] h-full overflow-y-scroll">
          {isLoading ? (
            <AnimatedLoader />
          ) : (
            <div className="w-full h-fit flex flex-row flex-wrap gap-[7px]">
              {users.length ? (
                users.map((mp: UserAccount) => {
                  return <User key={mp.accountID} mp={mp} setUpdateUsers={setUpdateUsers} />;
                })
              ) : (
                <Empty size="w-20" title="NO USERS" />
              )}
            </div>
          )}
        </div>
      </div>
      {authentication.user.permissions.includes('add_new_user') && (
        <div className="w-full max-w-[450px]  p-[0px] flex flex-col pt-[20px] pb-[20px] pr-[10px] gap-[10px]">
          <span className="font-semibold text-[20px]">Add a User</span>
          <div className="shadow-lg border-[1px] w-full flex flex-col gap-[10px] bg-white p-[15px] pt-[20px] h-fit">
            <form onSubmit={handleSubmit(registerAccount)}>
              <div className="w-full flex flex-col gap-[5px]">
                <span className="text-[15px] font-semibold">First Name</span>
                <input
                  type="text"
                  {...register('firstname')}
                  placeholder="Input user first name"
                  className="w-full border-[1px] h-[35px] text-[14px] pl-[10px] pr-[10px]"
                />
                <span className="text-[15px] font-semibold">Middle Name</span>
                <input
                  type="text"
                  {...register('middlename')}
                  placeholder="Input user middle name (optional)"
                  className="w-full border-[1px] h-[35px] text-[14px] pl-[10px] pr-[10px]"
                />
                <span className="text-[15px] font-semibold">Last Name</span>
                <input
                  type="text"
                  {...register('lastname')}
                  placeholder="Input user last name"
                  className="w-full border-[1px] h-[35px] text-[14px] pl-[10px] pr-[10px]"
                />
              </div>
              <div className="w-full flex flex-col gap-[5px]">
                <span className="text-[15px] font-semibold">Account Type</span>
                <div className="w-full flex flex-row gap-[5px]">
                  <select
                    {...register('accountType')}
                    className="w-full border-[1px] h-[35px] text-[14px] pl-[10px] pr-[10px]"
                  >
                    <option value="">--Select Type--</option>
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Cashier">Cashier</option>
                    <option value="Waiter">Waiter</option>
                  </select>
                </div>
              </div>
              <div className="w-full flex flex-col gap-[5px]">
                <span className="text-[15px] font-semibold">Password</span>
                <input
                  type="password"
                  {...register('password')}
                  placeholder="Input desired password"
                  className="w-full border-[1px] h-[35px] text-[14px] pl-[10px] pr-[10px]"
                />
                <span className="text-[15px] font-semibold">Confirm Password</span>
                <input
                  type="password"
                  {...register('confirmPassword')}
                  placeholder="Input desired password"
                  className="w-full border-[1px] h-[35px] text-[14px] pl-[10px] pr-[10px]"
                />
              </div>
              <div className="w-full h-fit flex flex-col gap-[5px] pt-[10px]">
                <Button
                  loading={isSubmitting}
                  disabled={isSubmitting || !isValid}
                  className="h-[30px] bg-accent-tertiary cursor-pointer shadow-sm text-white font-semibold rounded-[4px]"
                >
                  Add
                </Button>
                <Button
                  onClick={() => reset()}
                  className="h-[30px] bg-red-500 cursor-pointer shadow-sm text-white font-semibold  rounded-[4px]"
                >
                  Clear
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;

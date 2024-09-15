import React, { Dispatch, SetStateAction } from 'react';
import Button from '../button/Button';
import ErrorMessageField from '../formfields/ErrorMessageField';
import LabeledInput from '../formfields/LabeledInput';
import Password from '../formfields/Password';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { DataService } from '../../../helpers/http/dataService';
import { dispatchnewalert } from '../../../helpers/utils/alertdispatching';
import BACKDOOR from '../../../lib/endpoints/Backdoor';
import { UserSchema } from '../../../lib/schema/UserSchema';
import { z } from 'zod';
import { useSelector, useDispatch } from 'react-redux';
import { Authentication, Settings } from '../../../lib/typings/Auth';
import { RootState } from '../../../redux/store/store';

type UserData = z.infer<typeof UserSchema>;

type Props = {
  setRefetch: Dispatch<SetStateAction<boolean>>;
};

const CreateUser = ({ setRefetch }: Props) => {
  const dispatch = useDispatch();
  const authentication: Authentication = useSelector((state: RootState) => state.authentication);
  const settings: Settings = useSelector((state: RootState) => state.settings);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid, errors }
  } = useForm<UserData>({
    resolver: zodResolver(UserSchema),
    mode: 'onChange'
  });

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
      setRefetch((prev) => !prev);
    } catch (err) {
      dispatchnewalert(dispatch, 'error', 'Something went wrong. Please try again!');
    }
  };

  return (
    <div className="w-full max-w-[450px]  p-[0px] flex flex-col pt-[20px] pb-[20px] pr-[10px] gap-[10px]">
      <span className="font-semibold text-[20px]">Add a User</span>
      <div className="shadow-lg border-[1px] w-full flex flex-col gap-[10px] bg-white p-[15px] pt-[20px] h-fit">
        <form onSubmit={handleSubmit(registerAccount)}>
          <div className="w-full flex flex-col gap-[6px]">
            <LabeledInput label="Fist Name" {...register('firstname')} placeholder="Input user first name" />
            <LabeledInput
              label="Middle Name"
              type="text"
              {...register('middlename')}
              placeholder="Input user middle name (optional)"
            />
            <LabeledInput label="Last Name" type="text" {...register('lastname')} placeholder="Input user last name" />
          </div>
          <div className="w-full flex flex-col gap-[5px] mt-2">
            <span className="text-[15px] font-semibold">Account Type</span>
            <div className="w-full flex flex-row gap-[5px]">
              <select
                {...register('accountType')}
                className="w-full border-[1px] h-[35px] text-[14px] pl-[10px] pr-[10px] rounded-md"
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
            <Password label="Password" inputProps={{ ...register('password') }} placeholder="Input desired password" />
            <ErrorMessageField errorText={errors.password?.message} />
            <Password
              label="Confirm Password"
              inputProps={{
                ...register('confirmPassword')
              }}
              placeholder="Input desired password"
            />
            <ErrorMessageField errorText={errors.confirmPassword?.message} />
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
  );
};

export default CreateUser;

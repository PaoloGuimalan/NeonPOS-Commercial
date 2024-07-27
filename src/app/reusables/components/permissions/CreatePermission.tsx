import React, { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { allPermissions } from '../../../lib/statics/permissions';
import CheckBox from '../formfields/CheckBox';
import { DataService } from '../../../helpers/http/dataService';
import BACKDOOR from '../../../lib/endpoints/Backdoor';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { PermissionSchema } from '../../../lib/schema/PermissionSchema';
import LabeledInput from '../formfields/LabeledInput';
import Button from '../button/Button';
import { useDispatch } from 'react-redux';
import { dispatchnewalert } from '../../../helpers/utils/alertdispatching';

type PermissionData = z.infer<typeof PermissionSchema>;

type Props = {
  setRefetch: Dispatch<SetStateAction<boolean>>;
};

function CreatePermission({ setRefetch }: Props) {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    trigger,
    formState: { isSubmitting, isValid }
  } = useForm<PermissionData>({
    resolver: zodResolver(PermissionSchema),
    mode: 'onChange',
    defaultValues: {
      allowedUsers: []
    }
  });

  const createNewPermission = async (data: PermissionData) => {
    try {
      await DataService.post(BACKDOOR.CREATE_PERMISSIONS, data);
      dispatchnewalert(dispatch, 'success', 'New permission has been added');
      reset();
      setRefetch((prev) => !prev);
    } catch (err) {
      console.error(err);
      dispatchnewalert(dispatch, 'warning', 'Please complete the fields');
    }
  };

  const addAllowedUser = (e: ChangeEvent<HTMLInputElement>, user: string) => {
    const isChecked = e.target.checked;
    const prevValues = getValues('allowedUsers');

    if (isChecked) {
      setValue('allowedUsers', [...prevValues, user]);
    } else {
      setValue(
        'allowedUsers',
        prevValues.filter((v) => v !== user)
      );
    }
    trigger('allowedUsers');
  };

  return (
    <div className="w-full max-w-[450px] bg-shade p-[0px] flex flex-col pt-[20px] pb-[20px] pr-[10px] gap-[10px]">
      <span className="font-semibold text-[20px]">Add Permission</span>
      <form onSubmit={handleSubmit(createNewPermission)}>
        <div className="shadow-lg border-[1px] w-full flex flex-col gap-[10px] bg-white p-[15px] pt-[20px] h-fit">
          <div className="w-full flex flex-col gap-[5px]">
            <LabeledInput {...register('permissionType')} label="Permission Type" placeholder="Input permission" />
          </div>
          <div className="w-full flex flex-col gap-[5px]">
            <span className="text-[15px] font-semibold mb-[5px]">Allowed Users</span>
            <div className="bg-shade p-[20px] flex flex-col gap-[5px]">
              {allPermissions?.map((permission) => (
                <div
                  key={permission.value}
                  className="bg-white w-full p-[10px] flex flex-row h-[60px] gap-[10px] items-center"
                >
                  <CheckBox
                    onChange={(e) => addAllowedUser(e, permission.value)}
                    label={permission?.label}
                    value={permission.value}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="w-full h-fit flex flex-col gap-[5px] pt-[10px]">
            <Button
              loading={isSubmitting}
              type="submit"
              disabled={!isValid || isSubmitting}
              className=" !bg-accent-tertiary !text-white"
            >
              Add
            </Button>
            <Button disabled={isSubmitting} variant="destructive">
              Clear
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CreatePermission;

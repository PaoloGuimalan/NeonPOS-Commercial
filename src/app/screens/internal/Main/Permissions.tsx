import React, { useEffect } from 'react';
import { Settings, Permission } from '../../../lib/typings/Auth';
import { useSelector } from 'react-redux';
import Pageloader from '../../../reusables/loaders/Pageloader';
import PermissionItem from '../../../reusables/widgets/PermissionItem';
import BACKDOOR from '../../../lib/endpoints/Backdoor';
import { Empty } from '../../../reusables/components';
import CreatePermission from '../../../reusables/components/permissions/CreatePermission';
import { RootState } from '../../../redux/store/store';
import { useFetchData } from '../../../hooks/useFetchData';

function Permissions() {
  const settings: Settings = useSelector((state: RootState) => state.settings);
  const { data, isLoading, setRefetch } = useFetchData<Permission, any>(BACKDOOR.GET_PERMISSIONS);

  const renderPermissions = () => {
    if (isLoading) {
      return <Pageloader className="my-5" />;
    }

    if (!data?.length) {
      return <Empty size="w-20" title="NO Permissions" />;
    }

    return data?.map((permission: Permission) => {
      return <PermissionItem key={permission.permissionID} permission={permission} setRefetch={setRefetch} />;
    });
  };

  useEffect(() => {
    setRefetch((prev) => !prev);
  }, [settings, setRefetch]);

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
          {renderPermissions()}
        </div>
      </div>
      {/* START OF THE FORM */}
      <CreatePermission setRefetch={setRefetch} />
    </div>
  );
}

export default Permissions;

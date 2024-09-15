import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { User, Empty } from '../../../reusables/components';
import { RootState } from '../../../redux/store/store';
import { Authentication, Settings, UserAccount } from '../../../lib/typings/Auth';
import BACKDOOR from '../../../lib/endpoints/Backdoor';
import SidebarLayout from '../../../reusables/components/layout/SidebarLayout';
import Pageloader from '../../../reusables/loaders/Pageloader';
import { useFetchData } from '../../../hooks/useFetchData';
import CreateUser from '../../../reusables/components/user/CreateUser';

const IFailedNotif = 'Failed to get list of users. Please refresh the app!';

function Users() {
  const { data, isLoading, setRefetch } = useFetchData<UserAccount, any>(BACKDOOR.GET_USER, IFailedNotif);
  const authentication: Authentication = useSelector((state: RootState) => state.authentication);
  const settings: Settings = useSelector((state: RootState) => state.settings);

  const renderUsers = () => {
    if (isLoading) {
      return <Pageloader />;
    }

    if (!data?.length) {
      return <Empty size="w-20" title="NO USERS" />;
    }

    return data?.map((mp: UserAccount) => {
      return <User key={mp.accountID} mp={mp} setRefetch={setRefetch} />;
    });
  };

  useEffect(() => {
    setRefetch((prev) => !prev);
  }, [settings]);

  return (
    <SidebarLayout>
      <div className="flex flex-1 flex-col p-[20px] gap-[10px]">
        <span className="font-semibold text-[20px]">Users</span>
        <div className="w-full flex flex-row gap-[5px] p-[15px] pt-[15px] h-full overflow-y-scroll">
          <div className="w-full h-fit flex flex-row flex-wrap gap-[7px]">{renderUsers()}</div>
        </div>
      </div>
      {authentication.user.permissions.includes('add_new_user') && <CreateUser setRefetch={setRefetch} />}
    </SidebarLayout>
  );
}

export default Users;

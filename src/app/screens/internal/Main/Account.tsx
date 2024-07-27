import React from 'react';

import { Authentication } from '../../../lib/typings/Auth';
import { useSelector } from 'react-redux';
import SidebarLayout from '../../../reusables/components/layout/SidebarLayout';
import { RootState } from '../../../redux/store/store';
import { combineName } from '../../../helpers/stringHelpers';
import { Paragraph } from '../../../reusables/components';

function Account() {
  const authentication: Authentication = useSelector((state: RootState) => state.authentication);
  const { accountID, accountName, permissions, dateCreated, accountType } = authentication.user || {};

  return (
    <SidebarLayout>
      <div className="flex flex-1 flex-col p-[20px] gap-[10px]">
        <Paragraph fontSize="xl" className="font-semibold">
          Account{' '}
        </Paragraph>
        <div className="bg-transparent flex flex-row gap-[10px]">
          <div className="flex flex-col w-full bg-header shadow-md border-[1px] p-[15px] rounded-[4px]">
            <Paragraph fontSize="lg" className="font-semibold">
              {accountID}
            </Paragraph>
            <Paragraph fontSize="sm" className="font-semibold">
              {combineName(accountName)}
            </Paragraph>
            <Paragraph fontSize="sm">
              <span className="font-semibold">Date Created:</span> {dateCreated}
            </Paragraph>
          </div>
          <div className="flex flex-row w-full gap-[5px]">
            <div className="bg-header shadow-md border-[1px] p-[15px] rounded-[4px] flex flex-col flex-1 gap-[7px]">
              <Paragraph fontSize="base" className="font-semibold">
                Orders Stat
              </Paragraph>
              <Paragraph fontSize="base" className="text-center">
                You made <span className="font-semibold">--</span> orders
              </Paragraph>
            </div>
            <div className="bg-header shadow-md border-[1px] p-[15px] rounded-[4px] flex flex-1 flex-col">
              <Paragraph fontSize="base" className="text-[16px] font-semibold">
                Details
              </Paragraph>
              <Paragraph fontSize="sm">
                <span className="font-semibold">Account Type:</span> {accountType}
              </Paragraph>
              <Paragraph fontSize="sm">
                <span className="font-semibold">Number of Permissions:</span> {permissions.length}
              </Paragraph>
            </div>
          </div>
        </div>
        <div className="bg-transparent flex flex-row flex-1 gap-[10px]">
          <div className="flex flex-col w-full bg-header shadow-md border-[1px] p-[15px] rounded-[4px] items-center justify-center">
            <Paragraph fontSize="xs" className="text-text-secondary">
              Edit details section
            </Paragraph>
          </div>
          <div className="flex flex-col w-full gap-[5px]">
            <div className="flex flex-col flex-1 w-full bg-header shadow-md border-[1px] p-[15px] rounded-[4px] items-center justify-center">
              <Paragraph fontSize="xs" className="text-text-secondary">
                Action made list
              </Paragraph>
            </div>
            <div className="flex flex-col flex-1 w-full bg-header shadow-md border-[1px] p-[15px] rounded-[4px] items-center justify-center">
              <Paragraph fontSize="xs" className="text-text-secondary">
                Orders made this day
              </Paragraph>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}

export default Account;

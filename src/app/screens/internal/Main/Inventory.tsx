import React from 'react';
import { UnderDevelopment } from '../../../reusables/components';
import SidebarLayout from '../../../reusables/components/layout/SidebarLayout';

function Inventory() {
  return (
    <SidebarLayout>
      <div className="flex flex-1 flex-col p-[20px] gap-[10px]">
        <span className="font-semibold text-[20px]">Inventory</span>
        <UnderDevelopment header="Inventory is still in progress" message="Will be available soon." />
      </div>
    </SidebarLayout>
  );
}

export default Inventory;

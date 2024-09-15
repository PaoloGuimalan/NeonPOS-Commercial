import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '../../../reusables/components';
import Order from '../../../reusables/components/order/Order';
import { Settings } from '../../../lib/typings/Auth';
import { OrderList } from '../../../lib/typings/Orders';
import { DataService } from '../../../helpers/http/dataService';
import BACKDOOR from '../../../lib/endpoints/Backdoor';
import sign from 'jwt-encode';
import CONFIG from '../../../helpers/variables/config';
import { dateGetter } from '../../../helpers/utils/generatefns';
import { cn } from '../../../lib/utils';

function Orders() {
  const settings: Settings = useSelector((state: any) => state.settings);

  const [orderIDInput, setorderIDInput] = useState<string>('');
  const [orderlist, setOrderlist] = useState<OrderList[]>([]);

  const [ordersFilter, setordersFilter] = useState<string>('Pending');

  const [isOrdersLoading, setIsOrdersLoading] = useState<boolean>(false);

  const getOrdersListProcess = async (orderID: string) => {
    try {
      const SECRET = `${CONFIG.JWTSECRET}`;
      const encodeuserID = sign({ userID: settings.userID, orderID: orderID, datescope: dateGetter() }, SECRET);
      const response = await DataService.get(BACKDOOR.GET_ORDERS(encodeuserID));
      const { result } = response?.data || {};

      setOrderlist(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsOrdersLoading(false);
    }
  };

  useEffect(() => {
    getOrdersListProcess('');
  }, []);

  return (
    <div className="w-full h-full flex flex-row bg-shade font-Inter">
      <div className="flex flex-1 flex-col p-[20px] gap-[10px]">
        <span className="font-semibold text-[20px]">Orders</span>
        <div className="w-full flex flex-row gap-[7px] mb-[20px]">
          <input
            type="text"
            placeholder="Search an order using Order ID"
            value={orderIDInput}
            onChange={(e) => {
              setorderIDInput(e.target.value);
            }}
            className="w-full max-w-[400px] border-[1px] h-[35px] text-[14px] pl-[10px] pr-[10px]"
          />
          <Button
            disabled={isOrdersLoading}
            loading={isOrdersLoading}
            onClick={() => {
              getOrdersListProcess(orderIDInput);
            }}
            className="h-[35px] w-[120px] bg-accent-tertiary cursor-pointer shadow-sm text-white font-semibold rounded-[0px] flex items-center justify-center"
          >
            Search
          </Button>
          <Button
            disabled={isOrdersLoading}
            loading={isOrdersLoading}
            onClick={() => {
              getOrdersListProcess('');
              setorderIDInput('');
            }}
            className="h-[35px] w-[120px] bg-header border-[1px] cursor-pointer shadow-sm text-black font-semibold rounded-[0px] flex items-center justify-center"
          >
            <span className="text-[14px]">{orderIDInput.trim() !== '' ? 'Clear' : 'Refresh'}</span>
          </Button>
        </div>
        <div className="w-full flex flex-row gap-[4px]">
          <Button
            onClick={() => {
              setordersFilter('Pending');
            }}
            className={cn(
              'border-[1px] min-h-[40px] bg-white min-w-[130px]',
              ordersFilter === 'Pending' && 'bg-[#12051c] text-white'
            )}
          >
            Pending
          </Button>
          <Button
            onClick={() => {
              setordersFilter('Closed');
            }}
            className={cn(
              'border-[1px] min-h-[40px] bg-white min-w-[130px]',
              ordersFilter === 'Closed' && 'bg-[#12051c] text-white'
            )}
          >
            Closed
          </Button>
        </div>
        <div className="w-full flex flex-col flex-1 pt-[0px] h-full overflow-y-scroll">
          <div className="w-full bg-white flex flex-col flex-1 p-[15px] pt-[0px]">
            <div className="w-full sticky top-0 pt-[15px] bg-white">
              <div className="bg-header border-[1px] p-[15px] flex flex-row w-full h-fit">
                <span className="text-[15px] flex flex-1 font-semibold">Order ID</span>
                <span className="text-[15px] flex flex-1 font-semibold justify-center">Order Details</span>
                <span className="text-[15px] flex flex-1 font-semibold justify-end">Date Made</span>
              </div>
            </div>
            {/* {orderlist.length > 0 ? (
              <div className='flex flex-col gap-[0px]'>
                {orderlist.filter((flt: OrdersListInterface) => {
                  if(ordersFilter === "Closed"){
                    return flt.status === "Renewed" || flt.status === "Initial" || flt.status === "Voided";
                  }
                  else{
                    return flt.status === ordersFilter;
                  }
                }).map((mp: OrdersListInterface, i: number) => {
                  return(
                    <Order key={i} mp={mp} getOrdersListProcess={GetOrdersListProcess} />
                  )
                })}
              </div>
            ) : (
              <div className='w-full flex flex-1'>
                <Pageloader />
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orders;

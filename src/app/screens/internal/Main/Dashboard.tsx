import React, { useEffect, useState } from 'react';
import { Authentication, DailyReport, Settings } from '../../../lib/typings/Auth';
import { useDispatch, useSelector } from 'react-redux';
import { GenerateDailyReport } from '../../../helpers/http/requests';
import { dispatchnewalert } from '../../../helpers/utils/alertdispatching';
import sign from 'jwt-encode';
import { dateGetter, timeGetter } from '../../../helpers/utils/generatefns';
import { DataService } from '../../../helpers/http/dataService';
import BACKDOOR from '../../../lib/endpoints/Backdoor';
import CONFIG from '../../../helpers/variables/config';
import { Button } from '../../../reusables/components';

function Dashboard() {
  const authentication: Authentication = useSelector((state: any) => state.authentication);
  const settings: Settings = useSelector((state: any) => state.settings);
  const dispatch = useDispatch();

  const [dailyReportDisplay, setdailyReportDisplay] = useState<DailyReport>({
    accountID: '',
    deviceID: '',
    dateMade: '',
    numberofsales: 0,
    totalsales: 0,
    discount: 0,
    discounttotal: 0,
    saleswdiscount: 0,
    taxtotal: 0,
    taxedsales: 0
  });

  const PrintDailyReportProcess = async () => {
    try {
      const response = await DataService.get(BACKDOOR.GENERATE_REPORT(dateGetter(), timeGetter()));

      const { status, result, message } = response.data || {};
      console.log(status, result);

      if (status && result > 0) {
        const printTemplateData: DailyReport = {
          accountID: authentication.user.accountID,
          deviceID: settings.deviceID,
          dateMade: result[0].dateMade || '',
          numberofsales: result[0].numberofsales,
          totalsales: result[0].totalsales.toFixed(2),
          discount: result[0].discount.toFixed(0),
          discounttotal: result[0].discounttotal.toFixed(2),
          saleswdiscount: result[0].saleswdiscount.toFixed(2),
          taxtotal: result[0].taxtotal.toFixed(2),
          taxedsales: result[0].taxedsales.toFixed(2)
        };

        // @ts-ignore
        window.ipc.send('ready-generate', JSON.stringify(printTemplateData));
      } else {
        dispatchnewalert(dispatch, 'error', 'Error making request to generate report');
      }
    } catch (error) {
      dispatchnewalert(dispatch, 'error', 'Error making request to generate report');
      console.log(error);
    }
  };

  const getDailyReportProcess = async () => {
    try {
      const response = await DataService.get(BACKDOOR.GENERATE_REPORT(dateGetter(), timeGetter()));

      const { status, result } = response.data || {};

      if (status.length > 0) {
        setdailyReportDisplay({
          accountID: authentication.user.accountID,
          deviceID: settings.deviceID,
          dateMade: result[0].dateMade,
          numberofsales: result[0].numberofsales,
          totalsales: result[0].totalsales.toFixed(2),
          discount: result[0].discount.toFixed(0),
          discounttotal: result[0].discounttotal.toFixed(2),
          saleswdiscount: result[0].saleswdiscount.toFixed(2),
          taxtotal: result[0].taxtotal.toFixed(2),
          taxedsales: result[0].taxedsales.toFixed(2)
        });
      } else {
        setdailyReportDisplay({
          // @ts-ignore
          accountID: authentication.user.accountID,
          // @ts-ignore
          deviceID: settings.deviceID,
          ...dailyReportDisplay
        });
        dispatchnewalert(dispatch, 'warning', 'No records to generate yet');
      }
    } catch (error) {
      dispatchnewalert(dispatch, 'error', 'Error making request to generate report');
      console.log(error);
    }
  };

  useEffect(() => {
    getDailyReportProcess();
  }, []);

  return (
    <div className="w-full h-full flex flex-row bg-shade font-Inter">
      <div className="flex flex-1 flex-col p-[20px] gap-[10px]">
        <span className="font-semibold text-[20px]">Dashboard</span>
        <div className="bg-transparent flex flex-col flex-1 gap-[10px]">
          <div className="w-full flex flex-row gap-[10px]">
            <div className="flex flex-row w-full max-w-[400px] bg-header shadow-md border-[1px] p-[15px] rounded-[4px]">
              <div className="w-full flex flex-col">
                <span className="text-[17px] font-semibold">{settings.userID}</span>
                <div>
                  <span className="text-[14px] font-semibold">Total Sales: </span>
                  <span className="text-[14px]">&#8369; --</span>
                </div>
                <div>
                  <span className="text-[14px] font-semibold">Orders Made: </span>
                  <span className="text-[14px]">--</span>
                </div>
              </div>
              <div className="flex items-end w-full max-w-[150px]">
                <Button
                  onClick={PrintDailyReportProcess}
                  className="bg-accent-tertiary text-white w-full text-[12px] font-semibold "
                >
                  Print Today's Report
                </Button>
              </div>
            </div>
            <div className="flex flex-col flex-1 gap-[4px]">
              <div className="flex flex-1 gap-[4px]">
                <div className="flex flex-row w-full max-w-[200px] bg-header shadow-md border-[1px] p-[15px] rounded-[4px] gap-[4px]">
                  <span className="text-[14px] font-semibold">Number of Users: </span>
                  <span className="text-[14px]">--</span>
                </div>
                <div className="flex flex-row flex-wrap flex-1 bg-header shadow-md border-[1px] p-[15px] rounded-[4px] gap-[4px] justify-between">
                  <div className="flex flex-row gap-[4px]">
                    <span className="text-[14px] font-semibold">Avg. orders per month: </span>
                    <span className="text-[14px]">--</span>
                  </div>
                  <div className="flex flex-row gap-[4px]">
                    <span className="text-[14px] font-semibold">Avg. inventory cost per month: </span>
                    <span className="text-[14px]">&#8369;--</span>
                  </div>
                  <div className="flex flex-row gap-[4px]">
                    <span className="text-[14px] font-semibold">Total current inventory cost: </span>
                    <span className="text-[14px]">&#8369;--</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-1 gap-[4px]">
                <div className="flex flex-row flex-1 bg-header shadow-md border-[1px] p-[15px] rounded-[4px] gap-[4px]">
                  <span className="text-[14px] font-semibold">Sales this day: </span>
                  <span className="text-[14px]">&#8369; {dailyReportDisplay.totalsales}</span>
                </div>
                <div className="flex flex-row flex-1 bg-header shadow-md border-[1px] p-[15px] rounded-[4px] gap-[4px]">
                  <span className="text-[14px] font-semibold">
                    Discounted Sales this day ({dailyReportDisplay.discount}%):{' '}
                  </span>
                  <span className="text-[14px]">&#8369; {dailyReportDisplay.saleswdiscount}</span>
                </div>
                <div className="flex flex-row flex-1 bg-header shadow-md border-[1px] p-[15px] rounded-[4px] gap-[4px]">
                  <span className="text-[14px] font-semibold">VAT Total this day: </span>
                  <span className="text-[14px]">&#8369; {dailyReportDisplay.taxtotal}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-row flex-1 gap-[4px]">
            <div className="flex flex-1 flex-col gap-[4px]">
              <div className="flex flex-col flex-1 items-center justify-center w-full bg-header shadow-md border-[1px] p-[15px] rounded-[4px]">
                <span className="text-[12px] text-text-secondary">Graph of sales report this month | week | year</span>
              </div>
              <div className="flex flex-row flex-1 w-full gap-[4px]">
                <div className="flex flex-col flex-1 w-full bg-header shadow-md border-[1px] p-[15px] rounded-[4px] items-center justify-center">
                  <span className="text-[12px] text-text-secondary">Graph of orders per day | month | year</span>
                </div>
                <div className="flex flex-col flex-1 w-full bg-header shadow-md border-[1px] p-[15px] rounded-[4px] items-center justify-center">
                  <span className="text-[12px] text-text-secondary">Graph of inventory expenses per month | year</span>
                </div>
              </div>
            </div>
            <div className="w-full max-w-[300px] flex flex-1">
              <div className="flex flex-col flex-1 w-full bg-header shadow-md border-[1px] p-[15px] rounded-[4px] items-center justify-center">
                <span className="text-[12px] text-text-secondary">List of orders made this day</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

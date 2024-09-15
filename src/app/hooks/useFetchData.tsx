/* 
    ADD PAGINATION IF NEEDED

*/

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DataService } from '../helpers/http/dataService';
import { useDispatch } from 'react-redux';
import { dispatchnewalert as toast } from '../helpers/utils/alertdispatching';

const defaultNotification = 'Something went wrong. Please reload the page!';

export const useFetchData = <
  IData,
  IResponse extends {
    result: IData[];
  }
>(
  endpoint: string,
  notification: string = defaultNotification
) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<IData[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [refetch, setRefetch] = useState<boolean>(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const url = `${endpoint}?${searchParams.toString()}`;
        const response = await DataService.get<IResponse>(url);

        const { result } = response.data;
        setData(result);
      } catch (err) {
        console.error(err);
        toast(dispatch, 'error', notification);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, [refetch, setRefetch, searchParams, setSearchParams, endpoint]);

  return {
    isLoading,
    data,
    searchParams,
    setSearchParams,
    refetch,
    setRefetch
  };
};

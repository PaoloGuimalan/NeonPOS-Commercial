import { AccountName } from '../lib/typings/Auth';

export const combineName = (accountName: AccountName) => {
  const { firstname, middlename, lastname } = accountName;

  return `${lastname} ${firstname}, ${middlename}`;
};

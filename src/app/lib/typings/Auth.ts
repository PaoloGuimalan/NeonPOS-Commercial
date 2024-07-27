export type Session = {
  isFromSession: boolean;
  namePreview: string;
};

export interface SavedAccountSessions {
  accountID: string;
  accountName: AccountName;
  deviceID: string;
  userID: string;
}

export interface Settings {
  userID: string;
  deviceID: string;
  connectionToken: string;
  setup: string;
  posType?: string;
}
export interface Authentication {
  auth: boolean | null;
  user: {
    accountID: string;
    accountType: string;
    accountName: AccountName;
    permissions: string[];
    dateCreated: string;
    createdBy: {
      accountID: string;
      deviceID: string;
    };
  };
}
export interface Permission {
  permissionID: string;
  permissionType: string;
  allowedUsers: string[];
  isEnabled: boolean;
}

export interface PermissionItemProp {
  mp: Permission;
  GetPermissionsProcess: () => void;
  GetSpecificUserProcess: () => void;
}

export interface RegisterAccount {
  firstname: string;
  middlename: string;
  lastname: string;
  accountType: string;
  password: string;
  creatorAccountID: string;
  userID: string;
  deviceID: string;
}

export interface UserAccount {
  accountID: string;
  accountType: string;
  accountName: AccountName;
  dateCreated: string;
  createdBy: {
    accountID: string;
    deviceID: string;
  };
}

export interface DailyReport {
  accountID: string;
  deviceID: string;
  dateMade: string;
  numberofsales: number;
  totalsales: number;
  discount: number;
  discounttotal: number;
  saleswdiscount: number;
  taxtotal: number;
  taxedsales: number;
}

export type AccountName = {
  firstname: string;
  middlename: string;
  lastname: string;
};

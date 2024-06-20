export type Session = {
  isFromSession: boolean;
  namePreview: string;
};

export interface SavedAccountSessions {
  accountID: string;
  accountName: {
    firstname: string;
    middlename: string;
    lastname: string;
  };
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
    accountName: {
      firstname: string;
      middlename: string;
      lastname: string;
    };
    permissions: string[];
    dateCreated: string;
    createdBy: {
      accountID: string;
      deviceID: string;
    };
  };
}

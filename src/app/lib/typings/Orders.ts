export type OrderList = {
  orderID: string;
  orderSet: CartItem[];
  dateMade: string;
  timeMade?: string;
  totalAmount: number;
  receivedAmount: number;
  tableNumber?: string;
  orderMadeBy: {
    accountID: string;
    userID: string;
    deviceID: string;
  };
  dateUpdated: string;
  status?: string;
  voidedFrom?: string;
  discount?: string;
};

export type CartItem = {
  pendingID?: number;
  product: ProductData;
  quantity: number;
};

export type ProductData = {
  addedBy: {
    accountID: string;
    userID: string;
    deviceID: string;
  };
  category: string;
  dateAdded: string;
  previews: string[];
  productID: string;
  productName: string;
  productPrice: number;
  productQuantity: number;
};

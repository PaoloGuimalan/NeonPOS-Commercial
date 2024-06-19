type Item = {
  title: 'Success' | 'Info' | 'Warning' | 'Error' | 'Incoming Call';
  component: React.ReactNode | null;
};

export type Alerts = {
  success: Item;
  info: Item;
  warning: Item;
  error: Item;
  incomingcall: Item;
};

export type AlertItem = {
  id: number;
  type: 'success' | 'info' | 'warning' | 'error' | 'incomingcall';
  content: string;
};

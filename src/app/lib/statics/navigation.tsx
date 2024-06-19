import React from 'react';
import { IoReceiptSharp } from 'react-icons/io5';
import {
  MdDashboard,
  MdOutlineRestaurantMenu,
  MdInventory,
  MdLock,
  MdAccountBox,
  MdAccountCircle
} from 'react-icons/md';
import { routing } from '../../helpers/variables/constants';

export const NAVIGATIONS = [
  {
    label: 'Dashboard',
    navigation: routing.DASHBOARD_ROUTE,
    permission: 'navigate_dashboard',
    icon: <MdDashboard style={{ fontSize: '30px' }} />
  },
  {
    label: 'Menu',
    navigation: routing.MENU_ROUTE,
    permission: 'navigate_menu',
    icon: <MdOutlineRestaurantMenu style={{ fontSize: '30px' }} />
  },
  {
    label: 'Orders',
    navigation: routing.ORDERS_ROUTE,
    permission: 'navigate_orders',
    icon: <IoReceiptSharp style={{ fontSize: '30px' }} />
  },
  {
    label: 'Inventory',
    navigation: routing.INVENTORY_ROUTE,
    permission: 'navigate_inventory',
    icon: <MdInventory style={{ fontSize: '30px' }} />
  },
  {
    label: 'Permissions',
    navigation: routing.PERMISSIONS_ROUTE,
    permission: 'navigate_permissions',
    icon: <MdLock style={{ fontSize: '30px' }} />
  },
  {
    label: 'Users',
    navigation: routing.USERS_ROUTE,
    permission: 'navigate_users',
    icon: <MdAccountBox style={{ fontSize: '30px' }} />
  },
  {
    label: 'Account',
    navigation: routing.ACCOUNT_ROUTE,
    permission: 'navigate_account',
    icon: <MdAccountCircle style={{ fontSize: '30px' }} />
  }
];

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

export const NAVIGATIONS = [
  {
    label: 'Dashboard',
    navigation: 'dashboard',
    permission: 'navigate_dashboard',
    icon: <MdDashboard style={{ fontSize: '30px' }} />
  },
  {
    label: 'Menu',
    navigation: 'menu',
    permission: 'navigate_menu',
    icon: <MdOutlineRestaurantMenu style={{ fontSize: '30px' }} />
  },
  {
    label: 'Orders',
    navigation: 'orders',
    permission: 'navigate_orders',
    icon: <IoReceiptSharp style={{ fontSize: '30px' }} />
  },
  {
    label: 'Inventory',
    navigation: 'inventory',
    permission: 'navigate_inventory',
    icon: <MdInventory style={{ fontSize: '30px' }} />
  },
  {
    label: 'Permissions',
    navigation: 'permissions',
    permission: 'navigate_permissions',
    icon: <MdLock style={{ fontSize: '30px' }} />
  },
  {
    label: 'Users',
    navigation: 'users',
    permission: 'navigate_users',
    icon: <MdAccountBox style={{ fontSize: '30px' }} />
  },
  {
    label: 'Account',
    navigation: 'account',
    permission: 'navigate_account',
    icon: <MdAccountCircle style={{ fontSize: '30px' }} />
  }
];

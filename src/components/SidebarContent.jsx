import React, { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import classNames from 'classnames';
import { ChevronDown } from 'react-feather';
import { Image, Text } from '@mantine/core';
import { Link, useLocation } from 'react-router-dom';
import NestedSidebarContent from './NestedSidebarContent';
import HomeIcon from '../assets/home-default.svg';
import HomeActiveIcon from '../assets/home-active.svg';
import InventoryIcon from '../assets/inventory-default.svg';
import InventoryActiveIcon from '../assets/inventory-active.svg';
import BookingIcon from '../assets/booking-default.svg';
import BookingActiveIcon from '../assets/booking-active.svg';
import ProposalIcon from '../assets/proposal-default.svg';
import ProposalActiveIcon from '../assets/proposal-active.svg';
import UsersIcon from '../assets/users-default.svg';
import UsersActiveIcon from '../assets/users-active.svg';
import MastersIcon from '../assets/masters-default.svg';
import MastersActiveIcon from '../assets/masters-active.svg';
import CampaignIcon from '../assets/campaign-default.svg';
import CampaignActiveIcon from '../assets/campaign-active.svg';
import ReportIcon from '../assets/report-default.svg';
import ReportActiveIcon from '../assets/report-active.svg';
import FinanceIcon from '../assets/finance-default.svg';
import FinanceActiveIcon from '../assets/finance-active.svg';
import RoleBased from './RoleBased';
import { masterTypes, ROLES, serialize } from '../utils';
import { useFetchMastersTypes } from '../hooks/masters.hooks';

const SidebarContent = ({ className }) => {
  const { pathname } = useLocation();

  const { data, isSuccess: isMasterLoaded, isLoading } = useFetchMastersTypes();

  const renderList = useMemo(() => {
    const queries = serialize({
      parentId: null,
      limit: 10,
      page: 1,
    });

    const tempList = [];
    if (data) {
      const values = Object.values(data);
      values.map(key => {
        tempList.push({
          label: masterTypes[key],
          type: key,
          subPath: `?type=${key}&${queries}`,
        });
        return tempList;
      });
    }

    return tempList;
  }, [data]);

  const checkActive = path => {
    if (pathname === '/' && path === '/') return true;

    if (path !== '/' && pathname.includes(path)) return true;

    return false;
  };

  const sidebarMenuList = useMemo(
    () => [
      {
        label: 'Home',
        path: '/home',
        icon: HomeIcon,
        activeIcon: HomeActiveIcon,
        acceptedRoles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.SUPERVISOR, ROLES.ASSOCIATE],
      },
      {
        label: 'Inventory',
        path: '/inventory',
        icon: InventoryIcon,
        activeIcon: InventoryActiveIcon,
        acceptedRoles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.SUPERVISOR, ROLES.ASSOCIATE],
      },
      {
        label: 'Bookings',
        path: '/bookings',
        icon: BookingIcon,
        activeIcon: BookingActiveIcon,
        acceptedRoles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.SUPERVISOR, ROLES.ASSOCIATE],
      },
      {
        label: 'Proposals',
        path: '/proposals',
        icon: ProposalIcon,
        activeIcon: ProposalActiveIcon,
        acceptedRoles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.SUPERVISOR, ROLES.ASSOCIATE],
      },
      {
        label: 'Users',
        path: '/users',
        icon: UsersIcon,
        activeIcon: UsersActiveIcon,
        acceptedRoles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.SUPERVISOR],
      },
      {
        label: 'Masters',
        path: '/masters',
        nested: renderList || [],
        icon: MastersIcon,
        activeIcon: MastersActiveIcon,
        acceptedRoles: [ROLES.ADMIN],
      },
      {
        label: 'Campaigns',
        path: '/campaigns',
        icon: CampaignIcon,
        activeIcon: CampaignActiveIcon,
        acceptedRoles: [ROLES.ADMIN],
      },
      {
        label: 'Reports',
        path: '/reports',
        nested: [
          { label: 'Campaign Reports', subPath: '/campaign' },
          { label: 'Revenue Reports', subPath: '/revenue' },
          { label: 'Inventory Reports', subPath: '/inventories' },
        ],
        icon: ReportIcon,
        activeIcon: ReportActiveIcon,
        acceptedRoles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.SUPERVISOR],
      },
      {
        label: 'Finance',
        path: '/finance',
        icon: FinanceIcon,
        activeIcon: FinanceActiveIcon,
        acceptedRoles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.SUPERVISOR],
      },
    ],
    [isMasterLoaded],
  );

  return (
    <div className={classNames('flex flex-col items-start', className)}>
      {isLoading ? (
        <Text mt="xl" px="xl">
          Loading...
        </Text>
      ) : null}
      {sidebarMenuList.map(item => (
        <RoleBased acceptedRoles={item.acceptedRoles} key={uuidv4()}>
          <div className="w-full flex flex-col border-gray-450 border">
            <div
              className={classNames(
                'flex items-center justify-between',
                pathname.includes(item.path) && item.nested && 'bg-gray-100',
              )}
            >
              <div className="pl-3 pr-1">
                <Image
                  src={checkActive(item.path) ? item.activeIcon : item.icon}
                  height={24}
                  width={24}
                  fit="contain"
                />
              </div>
              <Link
                to={item.nested ? `${item.path}${item.nested[0]?.subPath}` : item.path}
                className={classNames('p-2 flex w-full h-[40px]')}
              >
                <span
                  className={classNames(
                    checkActive(item.path) ? 'text-purple-450' : 'text-gray-400',
                    'font-medium text-base',
                  )}
                >
                  {item.label}
                </span>
              </Link>
              {item?.nested ? <ChevronDown className="h-4 mr-5" /> : null}
            </div>
            <NestedSidebarContent list={item.nested || []} path={item.path} />
          </div>
        </RoleBased>
      ))}
    </div>
  );
};

export default SidebarContent;

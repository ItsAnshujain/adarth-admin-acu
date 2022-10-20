import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Image } from '@mantine/core';
import { ChevronDown } from 'react-feather';
import classNames from 'classnames';
import { useMemo } from 'react';
import { useFetchMastersTypes } from '../hooks/masters.hooks';
import { masterTypes, serialize } from '../utils';
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
import LandlordsIcon from '../assets/landlords-default.svg';
import LandlordsActiveIcon from '../assets/landlords-active.svg';
import FinanceIcon from '../assets/finance-default.svg';
import FinanceActiveIcon from '../assets/finance-active.svg';

const Sidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { data, isSuccess: isMasterLoaded } = useFetchMastersTypes(!!pathname.includes('/masters'));

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

  if (pathname.includes('login')) return null;

  const handleNavigate = (path, subPath) => {
    navigate(path);

    if (subPath) {
      navigate(`${path}${subPath}`);
    } else {
      navigate(path);
    }
  };

  const checkActive = path => {
    if (pathname === '/' && path === '/') return true;

    if (path !== '/' && pathname === path) return true;

    return false;
  };

  const sidebarMenuList = useMemo(
    () => [
      {
        label: 'Home',
        path: '/home',
        icon: HomeIcon,
        activeIcon: HomeActiveIcon,
      },
      {
        label: 'Inventory',
        path: '/inventory',
        icon: InventoryIcon,
        activeIcon: InventoryActiveIcon,
      },
      {
        label: 'Bookings',
        path: '/bookings',
        icon: BookingIcon,
        activeIcon: BookingActiveIcon,
      },
      {
        label: 'Proposals',
        path: '/proposals',
        icon: ProposalIcon,
        activeIcon: ProposalActiveIcon,
      },
      {
        label: 'Users',
        path: '/users',
        icon: UsersIcon,
        activeIcon: UsersActiveIcon,
      },
      {
        label: 'Masters',
        path: '/masters',
        nested: renderList || [],
        icon: MastersIcon,
        activeIcon: MastersActiveIcon,
      },
      {
        label: 'Campaigns',
        path: '/campaigns',
        icon: CampaignIcon,
        activeIcon: CampaignActiveIcon,
      },
      {
        label: 'Reports',
        path: '/reports',
        nested: [
          { label: 'Campaign Report', subPath: '/campaign' },
          { label: 'Revenue Reports', subPath: '/revenue' },
          { label: 'Inventory Report', subPath: '/inventory' },
        ],
        icon: ReportIcon,
        activeIcon: ReportActiveIcon,
      },
      {
        label: 'Landlords',
        path: '/landlords',
        icon: LandlordsIcon,
        activeIcon: LandlordsActiveIcon,
      },
      {
        label: 'Finance',
        path: '/finance',
        icon: FinanceIcon,
        activeIcon: FinanceActiveIcon,
      },
    ],
    [isMasterLoaded],
  );

  return (
    <div className="hidden lg:block lg:col-span-2 mt-4">
      <div className="flex flex-col items-start gap-2 px-5">
        {sidebarMenuList.map(item => (
          <div className="w-full flex flex-col border-gray-450 border" key={item.label}>
            <div className="flex items-center justify-between ">
              <Button
                onClick={() => {
                  if (isMasterLoaded && item.nested) {
                    navigate(`${item.path}${item.nested[0]?.subPath}`);
                  } else {
                    handleNavigate(item.path);
                  }
                }}
                className="p-2 flex w-full h-[40px]"
              >
                <Image
                  src={checkActive(item.path) ? item.activeIcon : item.icon}
                  height={24}
                  width={24}
                  className="mr-2"
                  fit="contain"
                />
                <span
                  className={classNames(
                    checkActive(item.path) ? 'text-purple-450' : 'text-gray-400',
                    'font-medium text-sm',
                  )}
                >
                  {item.label}
                </span>
              </Button>
              {item?.nested ? <ChevronDown className="h-4 mr-5" /> : null}
            </div>
            <NestedSidebarContent
              list={item.nested || []}
              path={item.path}
              onNavigate={handleNavigate}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

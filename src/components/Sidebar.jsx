import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@mantine/core';
import { Mail, ChevronDown } from 'react-feather';
import classNames from 'classnames';
import { useMemo } from 'react';
import { useFetchMastersTypes } from '../hooks/masters.hooks';
import { masterTypes } from '../utils';
import NestedSidebarContent from './NestedSidebarContent';

const Sidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { data, isSuccess: isMasterLoaded } = useFetchMastersTypes(!!pathname.includes('/masters'));

  const renderList = useMemo(() => {
    const tempList = [];
    if (data) {
      const values = Object.values(data);
      values.map(key => {
        tempList.push({
          label: masterTypes[key],
          type: key,
          subPath: `?type=${key}&parentId=null&limit=10&page=1&limit=10`,
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
      },
      {
        label: 'Inventory',
        path: '/inventory',
      },
      {
        label: 'Bookings',
        path: '/bookings',
      },
      {
        label: 'Proposals',
        path: '/proposals',
      },
      {
        label: 'Users',
        path: '/users',
      },
      {
        label: 'Masters',
        path: '/masters',
        nested: renderList || [],
      },
      {
        label: 'Campaigns',
        path: '/campaigns',
      },
      {
        label: 'Reports',
        path: '/reports',
        nested: [
          { label: 'Campaign Report', subPath: '/campaign' },
          { label: 'Revenue Reports', subPath: '/revenue' },
          { label: 'Inventory Report', subPath: '/inventory' },
        ],
      },
      {
        label: 'Landlords',
        path: '/landlords',
      },
      {
        label: 'Finance',
        path: '/finance',
      },
    ],
    [isMasterLoaded],
  );

  return (
    <div className="hidden lg:block lg:col-span-2 mt-4">
      <div className="flex flex-col items-start gap-2 px-5">
        {sidebarMenuList.map(item => (
          <div className="w-full flex flex-col border-gray-450 border">
            <div className="flex items-center justify-between ">
              <Button
                onClick={() => {
                  if (isMasterLoaded && item.nested) {
                    navigate(`${item.path}${item.nested[0]?.subPath}`);
                  } else {
                    handleNavigate(item.path);
                  }
                }}
                className="p-2 flex w-full "
              >
                <Mail
                  className={classNames(
                    `mr-2 h-5 ${checkActive(item.path) ? 'text-purple-350' : 'text-gray-500'}`,
                  )}
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

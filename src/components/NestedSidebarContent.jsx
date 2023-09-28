import { Collapse } from '@mantine/core';
import classNames from 'classnames';
import React from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { masterTypes } from '../utils';

const NestedSidebarContent = ({ list, path, toggleNestedTab }) => {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');

  const isActive = React.useMemo(() => {
    const [_, pathName, subPathName] = pathname.split('/');
    if (pathName === 'reports' && path === '/masters') {
      return false;
    }
    return path.includes(pathName) || list.some(item => item.subPath.includes(subPathName));
  }, [list, pathname]);

  const checkActive = (label, subPath) => {
    if (pathname.includes(subPath)) return true;
    if (masterTypes[type] === label) return true;
    return false;
  };

  return (
    <Collapse in={isActive && toggleNestedTab}>
      <div className="flex flex-col items-start pl-5 py-3 bg-darkPurple-450 overflow-y-auto max-h-[260px] rounded-b-[4px]">
        {list.map(item => (
          <Link
            key={uuidv4()}
            to={item.subPath ? `${path}${item.subPath}` : path}
            className={classNames(
              checkActive(item?.label, item?.subPath) ? 'text-white' : 'text-gray-550',
              pathname.includes('masters') ? 'mb-2' : pathname.includes('reports') ? 'mb-2' : '',
              item?.label === 'Payment Status' ? 'hidden' : '',
              'font-medium text-base pl-[28px]',
            )}
          >
            {item?.label}
          </Link>
        ))}
      </div>
    </Collapse>
  );
};

export default NestedSidebarContent;

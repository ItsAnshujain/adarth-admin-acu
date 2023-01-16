import { Button, Collapse } from '@mantine/core';
import classNames from 'classnames';
import React from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { masterTypes } from '../utils';

const NestedSidebarContent = ({ list, path, onNavigate }) => {
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
    <Collapse in={isActive}>
      <div className="flex flex-col items-start pl-5 bg-gray-100">
        {list.map(item => (
          <Button
            key={item.label}
            onClick={() => onNavigate(path, item.subPath)}
            className={classNames(
              `${checkActive(item?.label, item?.subPath) ? 'text-black' : 'text-gray-400'}`,
              'font-normal text-sm',
            )}
          >
            {item?.label}
          </Button>
        ))}
      </div>
    </Collapse>
  );
};

export default NestedSidebarContent;

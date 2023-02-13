import { Link } from 'react-router-dom';
import { useState } from 'react';
import classNames from 'classnames';
import { Text, Button, Image } from '@mantine/core';
import { Plus, ChevronDown, Server, Grid } from 'react-feather';
import shallow from 'zustand/shallow';
import { useClickOutside } from '@mantine/hooks';
import Filter from './Filter';
import useLayoutView from '../../store/layout.store';
import calendar from '../../assets/data-table.svg';
import DateRange from '../DateRange';

const Header = ({ text }) => {
  const [showFilter, setShowFilter] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const ref = useClickOutside(() => setShowDatePicker(false));

  const { activeLayout, setActiveLayout } = useLayoutView(
    state => ({
      activeLayout: state.activeLayout,
      setActiveLayout: state.setActiveLayout,
    }),
    shallow,
  );

  const toggleDatePicker = () => setShowDatePicker(!showDatePicker);
  const handleListClick = () => setActiveLayout({ ...activeLayout, proposal: 'list' });
  const handleGridClick = () => setActiveLayout({ ...activeLayout, proposal: 'grid' });

  const toggleFilter = () => setShowFilter(!showFilter);

  return (
    <div className="h-[60px] border-b border-gray-450 flex justify-between items-center pl-5 pr-5">
      <Text weight="bold" size="md">
        {text}
      </Text>
      <div className="mr-2 flex gap-2">
        <div className="flex">
          <Button
            className={classNames(
              'px-4 border-gray-300 border rounded-md',
              activeLayout.proposal === 'grid' ? 'bg-white' : 'bg-purple-450',
            )}
            onClick={handleListClick}
          >
            <Server
              strokeWidth="3px"
              className={classNames(
                'max-h-5',
                activeLayout.proposal === 'grid' ? 'text-black' : 'text-white',
              )}
            />
          </Button>
          <Button
            className={classNames(
              'text-white border-gray-300 border px-4 rounded-md',
              activeLayout.proposal === 'list' ? 'bg-white' : 'bg-purple-450',
            )}
            onClick={handleGridClick}
          >
            <Grid
              strokeWidth="3px"
              className={classNames(
                activeLayout.proposal === 'list' ? 'text-black' : 'text-white',
                'max-h-5',
              )}
            />
          </Button>
        </div>

        <div ref={ref} className="relative">
          <Button onClick={toggleDatePicker} variant="default">
            <Image src={calendar} className="h-5" alt="calendar" />
          </Button>
          {showDatePicker && (
            <div className="absolute z-20 -translate-x-[450px] bg-white -top-0.3">
              <DateRange handleClose={toggleDatePicker} dateKeys={['from', 'to']} />
            </div>
          )}
        </div>

        <Button onClick={toggleFilter} variant="default" className="font-medium">
          <ChevronDown size={16} className="mt-[1px] mr-1" /> Filter
        </Button>
        {showFilter && <Filter isOpened={showFilter} setShowFilter={setShowFilter} />}
        <div>
          <Link
            to="/proposals/create-proposals"
            className="bg-purple-450 flex items-center text-white rounded-md px-4 h-full font-medium"
          >
            <Plus size={16} className="mr-1" />
            <span className="text-sm">Create Proposals</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;

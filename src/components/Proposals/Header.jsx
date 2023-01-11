import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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
  const handleCreateProposal = () => navigate('create-proposals');

  return (
    <div className="h-[60px] border-b border-gray-450 flex justify-between items-center pl-5 pr-5">
      <Text weight="bold" size="md">
        {text}
      </Text>
      <div className="mr-2 flex gap-2">
        <div className="flex">
          <Button
            className={classNames(
              `px-4 border-gray-300 border rounded-md ${
                activeLayout.proposal === 'grid' ? 'bg-white' : 'bg-purple-450'
              }`,
            )}
            onClick={handleListClick}
          >
            <Server
              strokeWidth="3px"
              className={`max-h-5 ${classNames(
                activeLayout.proposal === 'grid' ? 'text-black' : 'text-white',
              )}`}
            />
          </Button>
          <Button
            className={classNames(
              `text-white border-gray-300 border px-4 rounded-md ${
                activeLayout.proposal === 'list' ? 'bg-white' : 'bg-purple-450'
              }`,
            )}
            onClick={handleGridClick}
          >
            <Grid
              strokeWidth="3px"
              className={`max-h-5 ${classNames(
                activeLayout.proposal === 'list' ? 'text-black' : 'text-white',
              )}`}
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

        <Button
          onClick={handleCreateProposal}
          className="bg-purple-450 flex align-center py-2 text-white rounded-md px-4"
        >
          <Plus size={16} className="mt-[1px] mr-1" /> Create Proposals
        </Button>
      </div>
    </div>
  );
};

export default Header;

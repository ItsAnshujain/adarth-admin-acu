import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mantine/core';
import { Plus, ChevronDown } from 'react-feather';
import { useClickOutside } from '@mantine/hooks';
import calendar from '../../assets/data-table.svg';
import DateRange from '../DateRange';
import Filter from './Filter';
import RoleBased from '../RoleBased';
import { ROLES } from '../../utils';

const AreaHeader = ({ text }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const ref = useClickOutside(() => setShowDatePicker(false));

  const toggleFilter = () => setShowFilter(!showFilter);
  const toggleDatePicker = () => setShowDatePicker(!showDatePicker);

  return (
    <div className="h-[60px] border-b border-gray-450 flex justify-between items-center">
      <div className="pl-5">
        <p className="text-lg font-bold">{text}</p>
      </div>
      <div className="flex justify-around mr-7">
        <div ref={ref} className="mr-2 relative">
          <Button onClick={toggleDatePicker} variant="default">
            <img src={calendar} className="h-5" alt="calendar" />
          </Button>
          {showDatePicker && (
            <div className="absolute z-20 -translate-x-1/2 bg-white -top-0.3">
              <DateRange handleClose={toggleDatePicker} dateKeys={['from', 'to']} />
            </div>
          )}
        </div>
        <div className="mr-2">
          <Button onClick={toggleFilter} variant="default">
            <ChevronDown size={16} className="mt-[1px] mr-1" /> Filter
          </Button>
          {showFilter && <Filter isOpened={showFilter} setShowFilter={setShowFilter} />}
        </div>
        <RoleBased acceptedRoles={[ROLES.ADMIN, ROLES.SUPERVISOR, ROLES.MANAGER]}>
          <div>
            <Link
              to="/bookings/create-order"
              className="bg-purple-450 flex items-center text-white rounded-md px-4 h-full font-medium"
            >
              <Plus size={16} className="mr-1" />
              <span className="text-sm">Create Order</span>
            </Link>
          </div>
        </RoleBased>
      </div>
    </div>
  );
};

export default AreaHeader;

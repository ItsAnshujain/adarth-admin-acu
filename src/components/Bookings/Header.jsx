import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mantine/core';
import { Plus, ChevronDown } from 'react-feather';
import { useClickOutside } from '@mantine/hooks';
import calendar from '../../assets/data-table.svg';
import DateRange from '../DateRange';
import Filter from './Filter';

const AreaHeader = ({ text }) => {
  const navigate = useNavigate();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const ref = useClickOutside(() => setShowDatePicker(false));

  const toggleFilter = () => setShowFilter(!showFilter);
  const openDatePicker = () => setShowDatePicker(!showDatePicker);
  const handleCreateOrder = () => navigate('create-order');

  return (
    <div className="h-[60px] border-b border-gray-450 flex justify-between items-center">
      <div className="pl-5">
        <p className="text-lg font-bold">{text}</p>
      </div>
      <div className="flex justify-around mr-7">
        <div ref={ref} className="mr-2 relative">
          <Button onClick={openDatePicker} variant="default">
            <img src={calendar} className="h-5" alt="calendar" />
          </Button>
          {showDatePicker && (
            <div className="absolute z-20 -translate-x-1/2 bg-white -top-0.3">
              <DateRange handleClose={openDatePicker} />
            </div>
          )}
        </div>
        <div className="mr-2">
          <Button onClick={toggleFilter} variant="default">
            <ChevronDown size={16} className="mt-[1px] mr-1" /> Filter
          </Button>
          {showFilter && <Filter isOpened={showFilter} setShowFilter={setShowFilter} />}
        </div>
        <div className="relative">
          <Button
            onClick={handleCreateOrder}
            className="bg-purple-450 flex align-center py-2 text-white rounded-md px-4"
          >
            <Plus size={16} className="mt-[1px] mr-1" /> Create Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AreaHeader;

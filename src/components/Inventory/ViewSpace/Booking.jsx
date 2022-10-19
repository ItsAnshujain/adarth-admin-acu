import { useState } from 'react';
import { Text, Button } from '@mantine/core';
import { ChevronDown } from 'react-feather';
import DateRange from '../../DateRange';
import Filter from '../../Filter';
import calendar from '../../../assets/data-table.svg';
import Table from '../../Table/Table';
import dummy from '../../../Dummydata/BOOKING_DATA.json';
import COLUMNS from './column';

const Booking = ({ count }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const openDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };
  return (
    <div className="flex flex-col">
      <div className="flex justify-between py-4 pl-5 pr-7">
        <div>
          <Text weight="bold">List of bookings / Order</Text>
        </div>
        <div className="flex">
          <div className="mr-2 relative">
            <Button onClick={openDatePicker} variant="default" type="button">
              <img src={calendar} className="h-5" alt="calendar" />
            </Button>
            {showDatePicker && (
              <div className="absolute z-20 -translate-x-3/4 bg-white -top-0.3">
                <DateRange handleClose={openDatePicker} />
              </div>
            )}
          </div>
          <div className="mr-2">
            <Button onClick={() => setShowFilter(!showFilter)} variant="default" type="button">
              <ChevronDown size={16} className="mt-[1px] mr-1" /> Filter
            </Button>
            {showFilter && <Filter isOpened={showFilter} setShowFilter={setShowFilter} />}
          </div>
        </div>
      </div>
      <Table data={dummy} COLUMNS={COLUMNS} count={count} allowRowsSelect />
    </div>
  );
};

export default Booking;

import { useState } from 'react';
import { Text, Button } from '@mantine/core';
import { ChevronDown } from 'react-feather';
import Filter from '../../Filter';
import DateRange from '../../DateRange';
import Search from '../../Search';
import calendar from '../../../assets/data-table.svg';
import toIndianCurrency from '../../../utils/currencyFormat';
import Table from '../../Table/Table';

const Spaces = ({ data, column }) => {
  const [search, setSearch] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const openDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  return (
    <>
      <div className="flex gap-2 pt-4 flex-col pl-5 pr-7">
        <div className="flex justify-between items-center">
          <Text size="lg" weight="bold">
            Select Place for Campaign
          </Text>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Button onClick={openDatePicker} variant="default" type="button">
                <img src={calendar} className="h-5" alt="calendar" />
              </Button>
              {showDatePicker && (
                <div className="absolute z-20 -translate-x-3/4 bg-white -top-0.3">
                  <DateRange handleClose={openDatePicker} />
                </div>
              )}
            </div>
            <Button onClick={() => setShowFilter(!showFilter)} variant="default" type="button">
              <ChevronDown size={16} className="mt-[1px] mr-1" /> Filter
            </Button>
            {showFilter && <Filter isOpened={showFilter} setShowFilter={setShowFilter} />}
          </div>
        </div>
        <div className="flex gap-4">
          <div>
            <Text color="gray">Selected Places</Text>
            <Text weight="bold">12</Text>
          </div>
          <div>
            <Text color="gray">Total Price</Text>
            <Text weight="bold">{toIndianCurrency(20000)}</Text>
          </div>
        </div>
        <div className="flex justify-between mb-4 items-center">
          <Text size="sm" className="text-purple-450">
            Total Places{' '}
            <span className="bg-purple-450 text-white py-1 px-2 rounded-full ml-2">12</span>
          </Text>

          <Search search={search} setSearch={setSearch} />
        </div>
      </div>
      <Table data={data} COLUMNS={column} allowRowsSelect />
    </>
  );
};

export default Spaces;

import { useState } from 'react';
import { Button } from '@mantine/core';
import { ChevronDown } from 'react-feather';
import Filter from '../../Filter';
import Search from '../../Search';
import toIndianCurrency from '../../../utils/currencyFormat';
import Table from '../../Table/Table';
import useCreateBookingSelectSpaceState from '../../../store/createBookingSelectSpace.store';

const SelectSpace = ({ data, column }) => {
  const [search, setSearch] = useState('');
  const selectedSpace = useCreateBookingSelectSpaceState(state => state.selectedSpace);
  const [showFilter, setShowFilter] = useState(false);

  return (
    <>
      <div className="flex gap-2 pt-4 flex-col pl-5 pr-7">
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold">Select Place for Order</p>
          <div>
            <Button onClick={() => setShowFilter(!showFilter)} variant="default" type="button">
              <ChevronDown size={16} className="mt-[1px] mr-1" /> Filter
            </Button>
            {showFilter && <Filter isOpened={showFilter} setShowFilter={setShowFilter} />}
          </div>
        </div>
        <div className="flex gap-4">
          <div>
            <p className="text-slate-400">Selected Places</p>
            <p className="font-bold">{selectedSpace.length}</p>
          </div>
          <div>
            <p className="text-slate-400">Total Price</p>
            <p className="font-bold">{toIndianCurrency(20000)}</p>
          </div>
        </div>
        <div className="flex justify-between mb-4 items-center">
          <p className="text-purple-450 text-sm">
            Total Places{' '}
            <span className="bg-purple-450 text-white py-1 px-2 rounded-full ml-2">12</span>
          </p>

          <Search search={search} setSearch={setSearch} />
        </div>
      </div>
      <Table data={data} COLUMNS={column} allowRowsSelect isBookingTable />
    </>
  );
};

export default SelectSpace;

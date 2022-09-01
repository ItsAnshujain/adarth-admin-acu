/* eslint-disable */
import { useState } from 'react';
import { Button, Text } from '@mantine/core';
import { ChevronDown } from 'react-feather';
import RowsPerPage from '../../RowsPerPage';
import Search from '../../Search';
import Header from './Header';
import Details from './Details';
import Filter from '../../Filter';
import DateRange from '../../DateRange';
import calendar from '../../../assets/data-table.svg';
import Table from '../../Table/Table';
import COLUMNS from '../shared/column';
import dummy from '../../../Dummydata/CREATE_PROPOSAL_DATA.json';

const ProposalDetails = () => {
  const [search, setSearch] = useState('');
  const [count, setCount] = useState('20');
  const [showShare, setShowShare] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const openDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  return (
    <div onClick={() => setShowShare(false)}>
      <Header showShare={showShare} setShowShare={setShowShare} />
      <Details />
      <div className="pl-5 pr-7 flex justify-between mt-4">
        <Text size="xl" weight="bolder">
          Selected Inventory
        </Text>
        <div className="flex gap-2">
          <div className="mr-2 relative">
            <Button onClick={openDatePicker} variant="default" type="button">
              <img src={calendar} className="h-5" alt="calendar" />
            </Button>
            {showDatePicker && (
              <div className="absolute z-20 -translate-x-2/3 bg-white -top-0.3">
                <DateRange handleClose={openDatePicker} />
              </div>
            )}
          </div>
          <div>
            <Button onClick={() => setShowFilter(!showFilter)} variant="default" type="button">
              <ChevronDown size={16} className="mt-[1px] mr-1" /> Filter
            </Button>
            {showFilter && <Filter isOpened={showFilter} setShowFilter={setShowFilter} />}
          </div>
        </div>
      </div>

      <div className="flex justify-between h-20 items-center">
        <RowsPerPage setCount={setCount} count={count} />
        <Search search={search} setSearch={setSearch} />
      </div>
      <div>
        <Table COLUMNS={COLUMNS} dummy={dummy} />
      </div>
    </div>
  );
};

export default ProposalDetails;

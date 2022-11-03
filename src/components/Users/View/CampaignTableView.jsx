import React, { useState } from 'react';
import RowsPerPage from '../../RowsPerPage';
import Search from '../../Search';
import Table from '../../Table/Table';
import dummy from '../../../Dummydata/ORDER_DATA.json';
import column from './column';

const CampaignTableView = () => {
  const [search, setSearch] = useState('');
  const [count, setCount] = useState('20');

  return (
    <div className="pr-7">
      <div className="flex justify-between h-20 items-center">
        <RowsPerPage setCount={setCount} count={count} />
        <Search search={search} setSearch={setSearch} />
      </div>
      <Table data={dummy} COLUMNS={column} />
    </div>
  );
};

export default CampaignTableView;

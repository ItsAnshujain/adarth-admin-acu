import { useState } from 'react';
import Header from './Header';
import RowsPerPage from '../RowsPerPage';
import Search from '../Search';
import Table from '../Table/Table';
import data from '../../Dummydata/MOCK_DATA.json';
import COLUMNS from './column';

const Category = ({ s = [] }) => {
  const [search, setSearch] = useState('');
  const [count, setCount] = useState('20');
  // console.log(data);
  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto ">
      <Header text="Category" />
      <div className="flex justify-between h-20 items-center pr-7">
        <RowsPerPage setCount={setCount} count={count} />
        <Search search={search} setSearch={setSearch} />
      </div>
      <Table dummy={data} COLUMNS={COLUMNS} />
    </div>
  );
};

export default Category;

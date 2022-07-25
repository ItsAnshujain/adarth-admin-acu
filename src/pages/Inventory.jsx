import { useEffect, useState } from 'react';
import { Pagination } from '@mantine/core';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import AreaHeader from '../components/AreaHeader';
import RowsPerPage from '../components/RowsPerPage';
import Search from '../components/Search';
import GridView from '../components/GridView';

const Inventory = () => {
  const [activePage, setPage] = useState(1);
  const [count, setCount] = useState(20);
  const [view, setView] = useState('list');

  useEffect(() => {}, [count, activePage]);
  return (
    <>
      <Header title="Inventory" />
      <div className="grid grid-cols-12">
        <Sidebar />
        <div className="col-span-10 border-gray-450 border-l">
          <AreaHeader text="List of spaces" setView={setView} />
          <div className="flex justify-between h-20 items-center">
            <RowsPerPage setCount={setCount} />
            <Search />
          </div>
          {view === 'grid' ? <GridView count={count} page={activePage} /> : null}
          <Pagination
            className="absolute right-0 mx-5 mt-2"
            page={activePage}
            onChange={setPage}
            total={10}
          />
        </div>
      </div>
    </>
  );
};

export default Inventory;

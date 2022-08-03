import { useState } from 'react';
import Table from '../components/Table/Table';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import AreaHeader from '../components/Inventory/InventoryHeader';
import RowsPerPage from '../components/RowsPerPage';
import Search from '../components/Search';
import GridView from '../components/GridView';
import COLUMNS from '../components/Inventory/column';
import dummy from '../Dummydata/Inventory.json';

const Inventory = () => {
  const [search, setSearch] = useState('');
  const [count, setCount] = useState(20);
  const [view, setView] = useState('list');
  const [selectAll, setSelectAll] = useState(false);

  return (
    <>
      <Header title="Inventory" />
      <div className="grid grid-cols-12">
        <Sidebar />
        <div className="col-span-10 border-gray-450 border-l ">
          <AreaHeader
            selectAll={selectAll}
            setSelectAll={setSelectAll}
            text="List of spaces"
            setView={setView}
          />
          <div className="flex justify-between h-20 items-center">
            <RowsPerPage setCount={setCount} />
            <Search search={search} setSearch={setSearch} />
          </div>
          {view === 'grid' ? (
            <GridView selectAll={selectAll} count={count} />
          ) : view === 'list' ? (
            <Table COLUMNS={COLUMNS} dummy={dummy} count={count} allowRowsSelect />
          ) : (
            'null'
          )}
        </div>
      </div>
    </>
  );
};

export default Inventory;

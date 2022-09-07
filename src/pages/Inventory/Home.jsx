import { useState } from 'react';
import Table from '../../components/Table/Table';
import AreaHeader from '../../components/Inventory/AreaHeader';
import RowsPerPage from '../../components/RowsPerPage';
import Search from '../../components/Search';
import GridView from '../../components/GridView';
import COLUMNS from '../../components/Inventory/column';
import dummy from '../../Dummydata/Inventory.json';
import Card from '../../components/Inventory/Card';
import MapView from '../../components/Inventory/MapView';

const Home = () => {
  const [search, setSearch] = useState('');
  const [count, setCount] = useState('20');
  const [view, setView] = useState('list');
  const [selectAll, setSelectAll] = useState(false);

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto">
      <AreaHeader
        selectAll={selectAll}
        setSelectAll={setSelectAll}
        text="List of spaces"
        setView={setView}
      />
      {view !== 'map' && (
        <div className="flex justify-between h-20 items-center pr-7">
          <RowsPerPage setCount={setCount} count={count} />
          <Search search={search} setSearch={setSearch} />
        </div>
      )}
      {view === 'grid' ? (
        <GridView selectAll={selectAll} count={count} Card={Card} />
      ) : view === 'list' ? (
        <Table COLUMNS={COLUMNS} dummy={dummy} count={count} allowRowsSelect />
      ) : (
        <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto mt-5">
          <MapView />
        </div>
      )}
    </div>
  );
};

export default Home;

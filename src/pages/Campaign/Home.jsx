import { useState } from 'react';
import AreaHeader from '../../components/Campaigns/Header';
import GridView from '../../components/GridView';
import COLUMNS from '../../components/Campaigns/column';
import dummy from '../../Dummydata/CAMPAIGN_DATA.json';
import Table from '../../components/Table/Table';
import Card from '../../components/Campaigns/Card';
import RowsPerPage from '../../components/RowsPerPage';
import Search from '../../components/Search';

const Home = () => {
  const [search, setSearch] = useState('');
  const [count, setCount] = useState(20);
  const [view, setView] = useState('list');
  return (
    <div className="col-span-10 border-gray-450 border-l">
      <AreaHeader text="Campaign List" setView={setView} />
      <div className="flex justify-between h-20 items-center">
        <RowsPerPage setCount={setCount} />
        <Search search={search} setSearch={setSearch} />
      </div>
      {view === 'grid' ? (
        <GridView count={count} Card={Card} />
      ) : (
        <Table COLUMNS={COLUMNS} dummy={dummy} count={count} allowRowsSelect />
      )}
    </div>
  );
};

export default Home;

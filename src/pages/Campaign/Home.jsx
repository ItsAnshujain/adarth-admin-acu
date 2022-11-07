import { useState } from 'react';
import AreaHeader from '../../components/Campaigns/Header';
import GridView from '../../components/GridView';
// import COLUMNS from '../../components/Campaigns/column';
import dummy from '../../Dummydata/CAMPAIGN_DATA.json';
import Table from '../../components/Table/Table';
import Card from '../../components/Campaigns/Card';
import RowsPerPage from '../../components/RowsPerPage';
import Search from '../../components/Search';

const Home = () => {
  const [search, setSearch] = useState('');
  const [count, setCount] = useState('20');
  const [view, setView] = useState('list');
  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto">
      <AreaHeader text="Campaign List" setView={setView} />
      <div className="flex justify-between h-20 items-center">
        <RowsPerPage setCount={setCount} count={count} />
        <Search search={search} setSearch={setSearch} />
      </div>
      {view === 'grid' ? (
        <GridView count={count} Card={Card} />
      ) : (
        <Table COLUMNS={[]} data={dummy} count={count} allowRowsSelect />
      )}
    </div>
  );
};

export default Home;

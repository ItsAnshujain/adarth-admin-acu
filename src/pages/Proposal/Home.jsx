import { useEffect, useState } from 'react';
import AreaHeader from '../../components/Proposals/Header';
import RowsPerPage from '../../components/RowsPerPage';
import Search from '../../components/Search';
import Table from '../../components/Table/Table';
import DATA from '../../Dummydata/PROPOSAL_DATA.json';
import columns from '../../components/Proposals/column';
import useSideBarState from '../../store/sidebar.store';
import GridView from '../../components/Proposals/Grid';
import Card from '../../components/Proposals/Card';

const Proposals = () => {
  const [search, setSearch] = useState('');
  const [count, setCount] = useState(20);
  const [view, setView] = useState('list');

  const setColor = useSideBarState(state => state.setColor);
  useEffect(() => {
    setColor(2);
  }, []);

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto">
      <AreaHeader text="Proposals List" setView={setView} />
      <div className="flex justify-between h-20 items-center pr-7">
        <RowsPerPage setCount={setCount} />
        <Search search={search} setSearch={setSearch} />
      </div>
      {view === 'list' ? (
        <Table count={count} dummy={DATA} COLUMNS={columns} />
      ) : (
        <GridView Card={Card} />
      )}
    </div>
  );
};

export default Proposals;

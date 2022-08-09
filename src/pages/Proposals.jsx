import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import AreaHeader from '../components/Proposals/Header';
import RowsPerPage from '../components/RowsPerPage';
import Search from '../components/Search';
import Table from '../components/Table/Table';
import DATA from '../Dummydata/PROPOSAL_DATA.json';
import columns from '../components/Proposals/column';
import useSideBarState from '../store/sidebar.the.store';

const Proposals = () => {
  const [search, setSearch] = useState('');
  const [count, setCount] = useState(20);
  const setColor = useSideBarState(state => state.setColor);
  useEffect(() => {
    setColor(2);
  }, []);
  return (
    <>
      <Header title="Proposals" />
      <div className="grid grid-cols-12">
        <Sidebar />
        <div className="col-span-10 border-gray-450 border-l">
          <AreaHeader text="Proposals List" />
          <div className="flex justify-between h-20 items-center">
            <RowsPerPage setCount={setCount} />
            <Search search={search} setSearch={setSearch} />
          </div>
          <Table count={count} dummy={DATA} COLUMNS={columns} />
        </div>
      </div>
    </>
  );
};

export default Proposals;

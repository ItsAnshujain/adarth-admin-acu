import { useEffect, useState } from 'react';
import { Pagination } from '@mantine/core';
import AreaHeader from '../../components/Users/Header';
import RowsPerPage from '../../components/RowsPerPage';
import Search from '../../components/Search';
import useSideBarState from '../../store/sidebar.the.store';
import user from '../../assets/user.png';
import Card from '../../components/Users/UI/Card';

const cardData = {
  image: user,
  name: 'Peter Williams',
  designation: 'Management',
  company: 'Adarth',
  email: 'dmcooper@adarth.com',
  phone: '938499918',
};
const CardData = new Array(12).fill(cardData);

const paginationStyles = {
  item: {
    fontSize: 12,
  },
};

const Inventory = () => {
  const [search, setSearch] = useState('');
  const [_, setCount] = useState(20);
  const [activePage, setPage] = useState(1);

  const setColor = useSideBarState(state => state.setColor);
  useEffect(() => {
    setColor(3);
  }, []);

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto">
      <AreaHeader text="Team" />
      <div className="flex justify-between h-20 items-center pr-7">
        <RowsPerPage setCount={setCount} />
        <Search search={search} setSearch={setSearch} />
      </div>
      <div className="flex  flex-wrap pr-7 pl-5 relative mb-10">
        {CardData.map(data => (
          <Card {...data} />
        ))}
        <Pagination
          styles={paginationStyles}
          className="absolute bottom-0 right-10 text-sm"
          page={activePage}
          onChange={setPage}
          total={2}
        />
      </div>
    </div>
  );
};

export default Inventory;

import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Pagination, Skeleton } from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import AreaHeader from '../../components/Users/Header';
import RowsPerPage from '../../components/RowsPerPage';
import Search from '../../components/Search';
import useSideBarState from '../../store/sidebar.store';
import Card from '../../components/Users/UI/Card';
import { useFetchUsers } from '../../hooks/users.hooks';
import { serialize } from '../../utils';

const paginationStyles = {
  item: {
    fontSize: 12,
  },
};

const skeletonList = () =>
  // eslint-disable-next-line react/no-array-index-key
  Array.apply('', Array(8)).map((_, index) => <Skeleton height={178} radius="sm" key={index} />);

const Home = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [search, setSearch] = useDebouncedState('', 1000);
  const [count, setCount] = useState('10');
  const [filter, setFilter] = useState('team');

  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    sortOrder: 'asc',
    sortBy: 'createdAt',
    filter: 'team',
  });

  const { data, isLoading } = useFetchUsers(serialize(query));

  const page = searchParams.get('page');
  const role = searchParams.get('role');
  const setColor = useSideBarState(state => state.setColor);
  useEffect(() => {
    setColor(4);
  }, []);

  const handlePagination = currentPage => {
    const queries = serialize({
      ...query,
      limit: page,
      page: currentPage,
    });
    navigate(`/users?${queries}`);
  };

  useEffect(() => {
    setQuery({ ...query, filter });
  }, [filter]);

  useEffect(() => {
    setQuery({ ...query, search });
  }, [search]);

  useEffect(() => {
    const limit = parseInt(count, 10);
    setQuery({ ...query, limit });
  }, [count]);

  useEffect(() => {
    if (page) setQuery({ ...query, page });
  }, [page]);

  useEffect(() => {
    if (role) {
      setQuery({ ...query, role });
    }
  }, [role]);

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto">
      <AreaHeader text="Team" setFilter={setFilter} />
      <div className="flex justify-between h-20 items-center pr-7">
        <RowsPerPage setCount={setCount} count={count} />
        <Search search={search} setSearch={setSearch} />
      </div>
      <div className="relative pb-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 md:gap-3 pr-7 pl-5 relative mb-20">
          {data?.docs?.map(user => (
            <Link to={`view-details/${user?._id}`} key={user?._id}>
              <Card {...user} />
            </Link>
          ))}
          {isLoading ? skeletonList() : null}
        </div>
        <Pagination
          styles={paginationStyles}
          className="absolute bottom-0 right-10 text-sm mb-10"
          page={data?.page || 1}
          onChange={handlePagination}
          total={data?.totalPages || 1}
        />
      </div>
    </div>
  );
};

export default Home;

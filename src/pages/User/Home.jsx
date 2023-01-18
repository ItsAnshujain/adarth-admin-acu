import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Pagination, Skeleton } from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import { v4 as uuidv4 } from 'uuid';
import AreaHeader from '../../components/Users/Header';
import RowsPerPage from '../../components/RowsPerPage';
import Search from '../../components/Search';
import Card from '../../components/Users/UI/Card';
import { useFetchUsers } from '../../hooks/users.hooks';

const paginationStyles = {
  item: {
    fontSize: 12,
  },
};

const skeletonList = () =>
  Array.apply('', Array(8)).map(_ => <Skeleton height={178} radius="sm" key={uuidv4()} />);

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams({
    'page': 1,
    'limit': 10,
    'sortOrder': 'desc',
    'sortBy': 'createdAt',
    'filter': 'team',
  });
  const [searchInput, setSearchInput] = useDebouncedState('', 1000);
  const { data: userData, isLoading: isLoadingUserData } = useFetchUsers(searchParams.toString());

  const filter = searchParams.get('filter');
  const limit = searchParams.get('limit');

  const handleSearch = () => {
    searchParams.set('search', searchInput);
    searchParams.set('page', 1);
    setSearchParams(searchParams);
  };
  const handleFilter = currentVal => {
    searchParams.set('filter', currentVal);
    setSearchParams(searchParams);
  };
  const handleRowCount = currentLimit => {
    searchParams.set('limit', currentLimit);
    setSearchParams(searchParams);
  };
  const handlePagination = currentPage => {
    searchParams.set('page', currentPage);
    setSearchParams(searchParams);
  };

  useEffect(() => {
    handleSearch();
    if (searchInput === '') {
      searchParams.delete('search');
      setSearchParams(searchParams);
    }
  }, [searchInput]);

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto">
      <AreaHeader text="Team" setFilter={handleFilter} filter={filter} />
      <div className="flex justify-between h-20 items-center pr-7">
        <RowsPerPage setCount={handleRowCount} count={limit} />
        <Search search={searchInput} setSearch={setSearchInput} />
      </div>
      <div className="relative pb-10">
        {userData?.docs?.length === 0 && !isLoadingUserData ? (
          <div className="w-full min-h-[400px] flex justify-center items-center">
            <p className="text-xl">No records found</p>
          </div>
        ) : null}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 md:gap-3 pr-7 pl-5 relative mb-20">
          {userData?.docs?.map(user => (
            <Link to={`view-details/${user?._id}`} key={user?._id}>
              <Card {...user} />
            </Link>
          ))}
          {isLoadingUserData ? skeletonList() : null}
        </div>
        <Pagination
          styles={paginationStyles}
          className="absolute bottom-0 right-10 text-sm mb-10"
          page={userData?.page || 1}
          onChange={handlePagination}
          total={userData?.totalPages || 1}
        />
      </div>
    </div>
  );
};

export default Home;

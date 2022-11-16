import { useMemo, useEffect } from 'react';
import { useDebouncedState } from '@mantine/hooks';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Loader } from '@mantine/core';
import Header from './Header';
import RowsPerPage from '../RowsPerPage';
import Search from '../Search';
import Table from '../Table/Table';
import MenuPopover from './MenuPopover';
import { useFetchMasters } from '../../hooks/masters.hooks';
import { masterTypes } from '../../utils';

const Category = () => {
  const [searchInput, setSearchInput] = useDebouncedState('', 1000);
  const [searchParams, setSearchParams] = useSearchParams({
    'type': 'category',
    'parentId': null,
    'limit': 10,
    'page': 1,
    'sortOrder': 'desc',
    'sortBy': 'name',
  });
  const navigate = useNavigate();
  const { data: masterData, isLoading: isMasterDataLoading } = useFetchMasters(
    searchParams.toString(),
  );

  const type = searchParams.get('type');
  const parentId = searchParams.get('parentId');
  const page = searchParams.get('page');
  const limit = searchParams.get('limit');

  const handleSearch = () => {
    searchParams.set('name', searchInput);
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

  const COLUMNS = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id',
        disableSortBy: true,
        Cell: ({ row }) =>
          useMemo(() => {
            let currentPage = page;
            let rowCount = 0;
            if (page < 1) {
              currentPage = 1;
            }
            rowCount = (currentPage - 1) * limit;
            return <div className="pl-2">{rowCount + row.index + 1}</div>;
          }, []),
      },
      {
        Header: 'NAME',
        accessor: 'name',
        Cell: ({
          row: {
            original: { _id, name },
          },
        }) =>
          useMemo(
            () => (
              <Button
                className={
                  (parentId === 'null' ? 'cursor-pointer' : 'cursor-text',
                  'text-black font-normal p-0')
                }
                onClick={
                  parentId === 'null'
                    ? () => {
                        navigate(`/masters?type=${searchParams.get('type')}&parentId=${_id}`, {
                          replace: true,
                        });
                      }
                    : () => {}
                }
              >
                {name}
              </Button>
            ),
            [],
          ),
      },
      {
        Header: 'ACTION',
        accessor: 'action',
        footer: props => props.column.id,
        disableSortBy: true,
        Cell: ({ row }) => useMemo(() => <MenuPopover row={row} />, []),
      },
    ],
    [masterData],
  );

  const handleSortByColumn = colId => {
    if (searchParams.get('sortBy') === colId && searchParams.get('sortOrder') === 'desc') {
      searchParams.set('sortOrder', 'asc');
      setSearchParams(searchParams);
      return;
    }
    if (searchParams.get('sortBy') === colId && searchParams.get('sortOrder') === 'asc') {
      searchParams.set('sortOrder', 'desc');
      setSearchParams(searchParams);
      return;
    }

    searchParams.set('sortBy', colId);
    setSearchParams(searchParams);
  };

  useEffect(() => {
    handleSearch();
    if (searchInput === '') {
      searchParams.delete('name');
      setSearchParams(searchParams);
    }
  }, [searchInput]);

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto ">
      <Header text={masterTypes[type]} />
      <div className="flex justify-between h-20 items-center pr-7">
        <RowsPerPage setCount={handleRowCount} count={limit} />
        <Search search={searchInput} setSearch={setSearchInput} />
      </div>
      {isMasterDataLoading ? (
        <div className="flex justify-center items-center h-[400px]">
          <Loader />
        </div>
      ) : null}
      {masterData?.docs?.length === 0 && !isMasterDataLoading ? (
        <div className="w-full min-h-[400px] flex justify-center items-center">
          <p className="text-xl">No records found</p>
        </div>
      ) : null}
      {masterData?.docs?.length ? (
        <Table
          data={masterData?.docs || []}
          COLUMNS={COLUMNS}
          activePage={masterData?.page || 1}
          totalPages={masterData?.totalPages || 1}
          setActivePage={handlePagination}
          rowCountLimit={limit}
          handleSorting={handleSortByColumn}
        />
      ) : null}
    </div>
  );
};

export default Category;

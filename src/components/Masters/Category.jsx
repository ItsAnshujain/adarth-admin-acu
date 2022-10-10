import { useState, useMemo, useEffect } from 'react';
import { useDebouncedState } from '@mantine/hooks';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@mantine/core';
import Header from './Header';
import RowsPerPage from '../RowsPerPage';
import Search from '../Search';
import Table from '../Table/Table';
import MenuPopover from './MenuPopover';
import { useFetchMasters } from '../../hooks/masters.hooks';
import { serialize, masterTypes } from '../../utils';

const Category = () => {
  const [search, setSearch] = useDebouncedState('', 1000);
  const [count, setCount] = useState('10');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState({
    type: 'category',
    parentId: null,
    limit: 10,
    page: 1,
  });
  const { data } = useFetchMasters(serialize(query));

  const type = searchParams.get('type');
  const parentId = searchParams.get('parentId');
  const page = searchParams.get('page');

  const handlePagination = currentPage => {
    const queries = serialize({
      ...query,
      limit: page,
      page: currentPage,
    });
    navigate(`/masters?${queries}`);
  };

  const COLUMNS = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id',
        Cell: ({ row }) =>
          useMemo(() => {
            let currentPage = page;
            let rowCount = 0;
            if (page < 1) {
              currentPage = 1;
            }
            rowCount = (currentPage - 1) * count;
            return <div className="pl-2">{rowCount + row.index + 1}</div>;
          }, []),
      },
      {
        Header: 'NAME',
        accessor: 'name',
        Cell: tableProps =>
          useMemo(() => {
            const {
              row: {
                original: { _id, name },
              },
            } = tableProps;

            return (
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
            );
          }, []),
      },
      {
        Header: '',
        accessor: '_id',
        footer: props => props.column.id,
        disableSortBy: true,
        Cell: ({ row }) => useMemo(() => <MenuPopover row={row} />, []),
      },
    ],
    [data],
  );

  useEffect(() => {
    setQuery({ ...query, type, parentId, name: search });
  }, [type, search, parentId]);

  useEffect(() => {
    const limit = parseInt(count, 10);
    setQuery({ ...query, limit });
  }, [count]);

  useEffect(() => {
    if (parentId !== 'null') {
      setQuery({ ...query, type, parentId, page });
    } else {
      setQuery({ ...query, type, parentId: null, page });
    }
  }, [type, parentId, page]);

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto ">
      <Header text={masterTypes[query.type]} />
      <div className="flex justify-between h-20 items-center pr-7">
        <RowsPerPage setCount={setCount} count={count} />
        <Search search={search} setSearch={setSearch} />
      </div>
      <Table
        dummy={data?.docs || []}
        COLUMNS={COLUMNS}
        activePage={data?.page || 1}
        totalPages={data?.totalPages || 1}
        setActivePage={handlePagination}
        rowCountLimit={count}
      />
    </div>
  );
};

export default Category;

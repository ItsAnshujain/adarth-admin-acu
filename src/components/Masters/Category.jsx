import React from 'react';
import { useDebouncedState } from '@mantine/hooks';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Header from './Header';
import RowsPerPage from '../RowsPerPage';
import Search from '../Search';
import Table from '../Table/Table';
import MenuPopover from './MenuPopover';
import { useFetchMasters } from '../../hooks/masters.hooks';
import { serialize } from '../../utils';

const Category = () => {
  const [search, setSearch] = useDebouncedState('', 1000);
  const [count, setCount] = React.useState('20');
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = React.useState({
    type: 'category',
  });
  const { data } = useFetchMasters(serialize(query));

  const COLUMNS = React.useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id',
        Cell: ({ row }) => React.useMemo(() => <div className="pl-2">{row.index + 1}</div>, []),
      },
      {
        Header: 'NAME',
        accessor: 'name',
        Cell: tableProps =>
          React.useMemo(() => {
            const {
              row: {
                original: { _id, name },
              },
            } = tableProps;

            return (
              <button
                type="button"
                className="cursor-pointer"
                onClick={() => navigate(`/masters?id=brand&parentId=${_id}`, { replace: true })}
              >
                {name}
              </button>
            );
          }, []),
      },
      {
        Header: '',
        accessor: '_id',
        footer: props => props.column.id,
        disableSortBy: true,
        Cell: ({ row }) => React.useMemo(() => <MenuPopover row={row} />, []),
      },
    ],
    [],
  );

  React.useEffect(() => {
    setQuery({ ...query, name: search });
  }, [search]);

  React.useEffect(() => {
    const type = searchParams.get('id');
    setQuery({ type });
  }, [location.search, searchParams]);

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto ">
      <Header text="Category" />
      <div className="flex justify-between h-20 items-center pr-7">
        <RowsPerPage setCount={setCount} count={count} />
        <Search search={search} setSearch={setSearch} />
      </div>
      <Table dummy={data?.docs} COLUMNS={COLUMNS} query={query} />
    </div>
  );
};

export default Category;

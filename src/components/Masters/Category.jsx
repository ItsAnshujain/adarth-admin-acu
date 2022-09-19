import { useState, useMemo, useEffect } from 'react';
import { useDebouncedState } from '@mantine/hooks';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import classnames from 'classnames';
import Header from './Header';
import RowsPerPage from '../RowsPerPage';
import Search from '../Search';
import Table from '../Table/Table';
import MenuPopover from './MenuPopover';
import { useFetchMasters } from '../../hooks/masters.hooks';
import { serialize } from '../../utils';

const Category = () => {
  const [search, setSearch] = useDebouncedState('', 1000);
  const [count, setCount] = useState('20');
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState({
    type: 'category',
    parentId: null,
  });
  const { data } = useFetchMasters(serialize(query));

  const hasParentId = searchParams.has('parentId');

  const COLUMNS = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id',
        Cell: ({ row }) => useMemo(() => <div className="pl-2">{row.index + 1}</div>, []),
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
              <button
                type="button"
                className={classnames(hasParentId ? 'cursor-text' : 'cursor-pointer')}
                onClick={
                  hasParentId
                    ? () => {}
                    : () => {
                        navigate(`/masters?type=${searchParams.get('type')}&parentId=${_id}`, {
                          replace: true,
                        });
                      }
                }
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
        Cell: ({ row }) => useMemo(() => <MenuPopover row={row} />, []),
      },
    ],
    [hasParentId, data],
  );

  useEffect(() => {
    const parentId = searchParams.get('parentId');
    if (parentId) {
      setQuery({ ...query, parentId, name: search });
      return;
    }

    setQuery({ ...query, name: search });
  }, [search]);

  useEffect(() => {
    const type = searchParams.get('type');
    const parentId = searchParams.get('parentId');
    if (parentId) {
      setQuery({ ...query, type, parentId });
      return;
    }

    setQuery({ ...query, type });
  }, [location.search]);

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto ">
      <Header text="Category" />
      <div className="flex justify-between h-20 items-center pr-7">
        <RowsPerPage setCount={setCount} count={count} />
        <Search search={search} setSearch={setSearch} />
      </div>
      <Table
        dummy={data?.docs || []}
        COLUMNS={COLUMNS}
        activePage={data?.page}
        totalPage={data?.totalPage}
      />
    </div>
  );
};

export default Category;

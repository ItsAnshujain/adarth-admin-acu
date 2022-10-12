import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDebouncedState } from '@mantine/hooks';
import { Button } from '@mantine/core';
import AreaHeader from '../../components/Proposals/Header';
import RowsPerPage from '../../components/RowsPerPage';
import Search from '../../components/Search';
import Table from '../../components/Table/Table';
import GridView from '../../components/Proposals/Grid';
import { useFetchProposals } from '../../hooks/proposal.hooks';
import { serialize } from '../../utils';
import MenuPopover from './MenuPopover';
import useLayoutView from '../../store/layout.store';
import toIndianCurrency from '../../utils/currencyFormat';

const Proposals = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useDebouncedState('', 1000);
  const [count, setCount] = useState('10');
  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    sort: 'createdAt',
  });
  const page = searchParams.get('page');
  const { data: proposalsData, isLoading: isLoadingProposalsData } = useFetchProposals(
    serialize(query),
  );

  const viewType = useLayoutView(state => state.activeLayout);

  // TODO: use one store for multiple pages view
  const handlePagination = currentPage => {
    const queries = serialize({
      ...query,
      limit: count,
      page: currentPage,
    });
    navigate(`/proposals?${queries}`);
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
        Header: 'PROPOSAL NAME',
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
                className="text-black font-medium"
                onClick={() => navigate(`view-details/${_id}`, { replace: true })}
              >
                {name}
              </Button>
            );
          }, []),
      },
      {
        Header: 'Creator',
        accessor: 'creator',
      },
      {
        Header: 'STATUS',
        accessor: 'status',
        Cell: ({ row }) =>
          useMemo(() => <div className="pl-2">{row?.original?.status?.name}</div>, []),
      },
      {
        Header: 'CLIENT',
        accessor: 'client',
      },
      {
        Header: 'TOTAL PLACES',
        accessor: 'totalPlaces',
      },
      {
        Header: 'PRICING',
        accessor: 'price',
        Cell: ({ row }) =>
          useMemo(
            () => (
              <div className="pl-2">
                {row.original.price ? toIndianCurrency(row?.original?.price) : 0}
              </div>
            ),
            [],
          ),
      },
      {
        Header: '',
        accessor: 'details',
        disableSortBy: true,
        Cell: ({ row }) => useMemo(() => <MenuPopover itemId={row?.original?._id} />, []),
      },
    ],
    [proposalsData],
  );

  useEffect(() => {
    const limit = parseInt(count, 10);
    setQuery({ ...query, limit, search });
  }, [count, search]);

  useEffect(() => {
    if (page) setQuery({ ...query, page });
  }, [page]);

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto">
      <AreaHeader text="Proposals List" />
      <div className="flex justify-between h-20 items-center pr-7">
        <RowsPerPage setCount={setCount} count={count} />
        <Search search={search} setSearch={setSearch} />
      </div>
      {viewType === 'list' ? (
        <Table
          dummy={proposalsData?.docs || []}
          COLUMNS={COLUMNS}
          activePage={proposalsData?.page || 1}
          totalPages={proposalsData?.totalPages || 1}
          setActivePage={handlePagination}
          rowCountLimit={count}
        />
      ) : (
        <GridView
          count={count}
          list={proposalsData?.docs || []}
          activePage={proposalsData?.page}
          totalPages={proposalsData?.totalPages}
          setActivePage={handlePagination}
          isLoadingList={isLoadingProposalsData}
        />
      )}
    </div>
  );
};

export default Proposals;

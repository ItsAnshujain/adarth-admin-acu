import { useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDebouncedState } from '@mantine/hooks';
import { Button, Loader } from '@mantine/core';
import dayjs from 'dayjs';
import AreaHeader from '../../components/Proposals/Header';
import RowsPerPage from '../../components/RowsPerPage';
import Search from '../../components/Search';
import Table from '../../components/Table/Table';
import GridView from '../../components/Proposals/Grid';
import { useFetchProposals } from '../../hooks/proposal.hooks';
import MenuPopover from './MenuPopover';
import useLayoutView from '../../store/layout.store';
import toIndianCurrency from '../../utils/currencyFormat';

const DATE_FORMAT = 'DD MMM YYYY';

const Proposals = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams({
    'page': 1,
    'limit': 10,
    'sort': 'createdAt',
  });
  const page = searchParams.get('page');
  const limit = searchParams.get('limit');

  const [searchInput, setSearchinput] = useDebouncedState('', 1000);

  const { data: proposalsData, isLoading: isLoadingProposalsData } = useFetchProposals(
    `${searchParams.toString()}`,
  );

  const viewType = useLayoutView(state => state.activeLayout);

  const handleSearch = () => {
    searchParams.set('search', searchInput);
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
        Header: 'PROPOSAL NAME',
        accessor: 'name',
        Cell: ({
          row: {
            original: { _id, name },
          },
        }) =>
          useMemo(
            () => (
              <Button
                className="text-black font-medium max-w-[250px] capitalize"
                onClick={() => navigate(`view-details/${_id}`, { replace: true })}
              >
                {name}
              </Button>
            ),
            [],
          ),
      },
      {
        Header: 'CREATOR',
        accessor: 'creator',
        Cell: ({
          row: {
            original: { creator },
          },
        }) =>
          useMemo(
            () => <p className="text-black font-medium max-w-[250px]">{creator?.name}</p>,
            [],
          ),
      },
      {
        Header: 'STATUS',
        accessor: 'status',
        Cell: ({
          row: {
            original: { status },
          },
        }) =>
          useMemo(
            () => <p className="pl-2 font-bold text-purple-350">{status?.name || '-'}</p>,
            [],
          ),
      },
      {
        Header: 'START DATE',
        accessor: 'startDate',
        Cell: ({
          row: {
            original: { startDate },
          },
        }) =>
          useMemo(
            () => (
              <p className="font-medium bg-gray-450 px-2 rounded-sm">
                {dayjs(startDate).format(DATE_FORMAT)}
              </p>
            ),
            [],
          ),
      },
      {
        Header: 'END DATE',
        accessor: 'endDate',
        Cell: ({
          row: {
            original: { endDate },
          },
        }) =>
          useMemo(
            () => (
              <p className="font-medium bg-gray-450 px-2 rounded-sm">
                {dayjs(endDate).format(DATE_FORMAT)}
              </p>
            ),
            [],
          ),
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
        Cell: ({
          row: {
            original: { price },
          },
        }) => useMemo(() => <p className="pl-2">{price ? toIndianCurrency(price) : 0}</p>, []),
      },
      {
        Header: '',
        accessor: 'details',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { _id },
          },
        }) => useMemo(() => <MenuPopover itemId={_id} />, []),
      },
    ],
    [proposalsData, limit],
  );

  useEffect(() => {
    handleSearch();
    if (searchInput === '') {
      searchParams.delete('search');
      setSearchParams(searchParams);
    }
  }, [searchInput]);

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto">
      <AreaHeader text="Proposals List" />
      <div className="flex justify-between h-20 items-center pr-7">
        <RowsPerPage setCount={handleRowCount} count={limit} />
        <Search search={searchInput} setSearch={setSearchinput} />
      </div>
      {isLoadingProposalsData && viewType === 'list' ? (
        <div className="flex justify-center items-center h-[400px]">
          <Loader />
        </div>
      ) : null}
      {viewType === 'list' && proposalsData?.docs?.length ? (
        <Table
          data={proposalsData?.docs || []}
          COLUMNS={COLUMNS}
          activePage={proposalsData?.page || 1}
          totalPages={proposalsData?.totalPages || 1}
          setActivePage={handlePagination}
          rowCountLimit={limit}
        />
      ) : viewType === 'grid' ? (
        <GridView
          count={limit}
          list={proposalsData?.docs || []}
          activePage={proposalsData?.page}
          totalPages={proposalsData?.totalPages}
          setActivePage={handlePagination}
          isLoadingList={isLoadingProposalsData}
        />
      ) : null}
    </div>
  );
};

export default Proposals;

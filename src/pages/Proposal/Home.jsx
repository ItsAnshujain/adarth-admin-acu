import { useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDebouncedState } from '@mantine/hooks';
import { Loader, Select, Text } from '@mantine/core';
import dayjs from 'dayjs';
import { ChevronDown } from 'react-feather';
import AreaHeader from '../../components/Proposals/Header';
import RowsPerPage from '../../components/RowsPerPage';
import Search from '../../components/Search';
import Table from '../../components/Table/Table';
import GridView from '../../components/Proposals/Grid';
import { useFetchProposals, useUpdateProposal } from '../../hooks/proposal.hooks';
import useLayoutView from '../../store/layout.store';
import toIndianCurrency from '../../utils/currencyFormat';
import { serialize } from '../../utils';
import { useFetchMasters } from '../../hooks/masters.hooks';
import ProposalsMenuPopover from '../../components/Popovers/ProposalsMenuPopover';

const nativeSelectStyles = {
  rightSection: { pointerEvents: 'none' },
};
const DATE_FORMAT = 'DD MMM YYYY';

const Proposals = () => {
  const [searchParams, setSearchParams] = useSearchParams({
    'page': 1,
    'limit': 10,
    'sortBy': 'createdAt',
    'sortOrder': 'desc',
  });
  const page = searchParams.get('page');
  const limit = searchParams.get('limit');
  const [searchInput, setSearchinput] = useDebouncedState('', 1000);

  const { mutate: update, isLoading: isUpdateProposalLoading } = useUpdateProposal();
  const { data: proposalsData, isLoading: isLoadingProposalsData } = useFetchProposals(
    searchParams.toString(),
  );
  const { data: proposalStatusData, isLoading: isProposalStatusLoading } = useFetchMasters(
    serialize({ type: 'proposal_status', parentId: null, limit: 100, page: 1 }),
  );

  const viewType = useLayoutView(state => state.activeLayout);

  const handleSearch = () => {
    searchParams.set('search', searchInput);
    searchParams.set('page', 1);
    setSearchParams(searchParams);
  };

  const handlePagination = (key, val) => {
    if (val !== '') searchParams.set(key, val);
    else searchParams.delete(key);
    setSearchParams(searchParams);
  };

  const handleUpdateStatus = (proposalId, statusId) => {
    const data = { status: statusId };
    update({ proposalId, data });
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
        Header: 'PROPOSAL NAME',
        accessor: 'name',
        Cell: ({
          row: {
            original: { _id, name },
          },
        }) =>
          useMemo(
            () => (
              <Link to={`view-details/${_id}`} className="text-purple-450 font-medium">
                <Text
                  className="overflow-hidden text-ellipsis max-w-[180px] underline"
                  lineClamp={1}
                  title={name}
                >
                  {name || '-'}
                </Text>
              </Link>
            ),
            [],
          ),
      },
      {
        Header: 'CREATOR',
        accessor: 'creator.name',
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
        accessor: 'status.name',
        Cell: ({
          row: {
            original: { _id, status },
          },
        }) =>
          useMemo(
            () => (
              <Select
                className="mr-2"
                value={status?._id || ''}
                onChange={e => handleUpdateStatus(_id, e)}
                data={
                  proposalStatusData?.docs?.map(item => ({
                    label: item?.name,
                    value: item?._id,
                  })) || []
                }
                styles={nativeSelectStyles}
                rightSection={<ChevronDown size={16} className="mt-[1px] mr-1" />}
                rightSectionWidth={40}
                disabled={isProposalStatusLoading || isUpdateProposalLoading}
              />
            ),
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
        accessor: 'client.name',
        Cell: ({
          row: {
            original: { client },
          },
        }) => useMemo(() => <p className="pl-2">{client?.company || '-'}</p>, []),
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
        }) =>
          useMemo(
            () => (
              <p className="pl-2">{price ? toIndianCurrency(Number.parseInt(price, 10)) : 0}</p>
            ),
            [],
          ),
      },
      {
        Header: 'ACTION',
        accessor: 'action',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { _id },
          },
        }) => useMemo(() => <ProposalsMenuPopover itemId={_id} />, []),
      },
    ],
    [proposalsData?.docs, limit, proposalStatusData],
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
      searchParams.delete('search');
      setSearchParams(searchParams);
    }
  }, [searchInput]);

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto">
      <AreaHeader text="Proposals List" />
      <div className="flex justify-between h-20 items-center pr-7">
        <RowsPerPage
          setCount={currentLimit => handlePagination('limit', currentLimit)}
          count={limit}
        />
        <Search search={searchInput} setSearch={setSearchinput} />
      </div>
      {isLoadingProposalsData && viewType.proposal === 'list' ? (
        <div className="flex justify-center items-center h-[400px]">
          <Loader />
        </div>
      ) : null}
      {!proposalsData?.docs?.length && !isLoadingProposalsData ? (
        <div className="w-full min-h-[400px] flex justify-center items-center">
          <p className="text-xl">No records found</p>
        </div>
      ) : null}
      {viewType.proposal === 'list' && proposalsData?.docs?.length ? (
        <Table
          data={proposalsData?.docs || []}
          COLUMNS={COLUMNS}
          activePage={proposalsData?.page || 1}
          totalPages={proposalsData?.totalPages || 1}
          setActivePage={currentPage => handlePagination('page', currentPage)}
          rowCountLimit={limit}
          handleSorting={handleSortByColumn}
        />
      ) : viewType.proposal === 'grid' && proposalsData?.docs?.length ? (
        <GridView
          count={limit}
          list={proposalsData?.docs || []}
          activePage={proposalsData?.page}
          totalPages={proposalsData?.totalPages}
          setActivePage={currentPage => handlePagination('page', currentPage)}
          isLoadingList={isLoadingProposalsData}
        />
      ) : null}
    </div>
  );
};

export default Proposals;

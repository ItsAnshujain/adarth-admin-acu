import { Button, Loader } from '@mantine/core';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useFetchProposals } from '../../../hooks/proposal.hooks';
import MenuPopover from '../../../pages/Proposal/MenuPopover';
import toIndianCurrency from '../../../utils/currencyFormat';
import Table from '../../Table/Table';

const DATE_FORMAT = 'DD MMM YYYY';

const ProposalTableView = ({ viewType, userId = null }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams({
    'page': 1,
    'limit': 10,
    'sortBy': 'createdAt',
    'sortOrder': 'desc',
    'userId': userId,
  });

  const { data: proposalsData, isLoading: isLoadingProposalsData } = useFetchProposals(
    viewType ? searchParams.toString() : null,
    viewType,
  );

  const page = searchParams.get('page');
  const limit = searchParams.get('limit');

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
            original: { _id, status },
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
        Cell: ({
          row: {
            original: { client },
          },
        }) => useMemo(() => <p className="pl-2">{client?.company}</p>, []),
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
        Header: 'ACTION',
        accessor: 'action',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { _id },
          },
        }) => useMemo(() => <MenuPopover itemId={_id} />, []),
      },
    ],
    [proposalsData?.docs, limit],
  );

  return (
    <div className="mt-8">
      {isLoadingProposalsData ? (
        <div className="flex justify-center items-center h-[400px]">
          <Loader />
        </div>
      ) : null}
      {proposalsData?.docs?.length === 0 && !isLoadingProposalsData ? (
        <div className="w-full min-h-[400px] flex justify-center items-center">
          <p className="text-xl">No records found</p>
        </div>
      ) : null}
      {proposalsData?.docs?.length ? (
        <Table
          data={proposalsData?.docs || []}
          COLUMNS={COLUMNS}
          activePage={proposalsData?.page || 1}
          totalPages={proposalsData?.totalPages || 1}
          setActivePage={handlePagination}
          rowCountLimit={limit}
        />
      ) : null}
    </div>
  );
};

export default ProposalTableView;

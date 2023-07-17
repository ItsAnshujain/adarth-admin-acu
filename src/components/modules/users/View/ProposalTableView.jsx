import { Loader, Select, Text } from '@mantine/core';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { ChevronDown } from 'react-feather';
import { Link, useSearchParams } from 'react-router-dom';
import { useFetchMasters } from '../../../../apis/queries/masters.queries';
import { useUpdateProposal } from '../../../../apis/queries/proposal.queries';
import { serialize } from '../../../../utils';
import toIndianCurrency from '../../../../utils/currencyFormat';
import ProposalsMenuPopover from '../../../Popovers/ProposalsMenuPopover';
import Table from '../../../Table/Table';

const nativeSelectStyles = {
  rightSection: { pointerEvents: 'none' },
};

const sortOrders = order => {
  switch (order) {
    case 'asc':
      return 'desc';
    case 'desc':
      return 'asc';

    default:
      return 'asc';
  }
};

const DATE_FORMAT = 'DD MMM YYYY';

const ProposalTableView = ({ data, isLoading }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { mutate: update, isLoading: isUpdateProposalLoading } = useUpdateProposal();
  const { data: proposalStatusData, isLoading: isProposalStatusLoading } = useFetchMasters(
    serialize({ type: 'proposal_status', parentId: null, limit: 100, page: 1 }),
  );

  const handleSortByColumn = colId => {
    searchParams.set('sortBy', colId);
    searchParams.set(
      'sortOrder',
      searchParams.get('sortBy') === colId ? sortOrders(searchParams.get('sortOrder')) : 'asc',
    );

    setSearchParams(searchParams);
  };

  const handlePagination = (key, val) => {
    if (val !== '') searchParams.set(key, val);
    else searchParams.delete(key);

    setSearchParams(searchParams);
  };

  const handleUpdateStatus = (proposalId, statusId) =>
    update({ proposalId, data: { status: statusId } });

  const COLUMNS = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id',
        disableSortBy: true,
        Cell: ({ row }) =>
          useMemo(() => {
            const currentPage = data?.page < 1 ? 1 : data.page;
            const rowCount = (currentPage - 1) * data.limit;

            return <p>{rowCount + row.index + 1}</p>;
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
              <Link to={`/bookings/view-details/${_id}`} className="font-medium underline">
                <Text
                  className="overflow-hidden text-ellipsis max-w-[180px] text-purple-450"
                  lineClamp={1}
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
        }) => useMemo(() => <p>{client?.company}</p>, []),
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
        }) => useMemo(() => <p>{price ? toIndianCurrency(price) : 0}</p>, []),
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
    [data?.docs, proposalStatusData],
  );

  return (
    <div className="mt-8">
      {isLoading ? (
        <div className="flex justify-center items-center h-[380px]">
          <Loader />
        </div>
      ) : null}
      {!data?.docs?.length && !isLoading ? (
        <div className="w-full min-h-[380px] flex justify-center items-center">
          <p className="text-xl">No records found</p>
        </div>
      ) : null}
      {data?.docs?.length ? (
        <Table
          data={data?.docs || []}
          COLUMNS={COLUMNS}
          activePage={data?.page || 1}
          totalPages={data?.totalPages || 1}
          setActivePage={page => handlePagination('page', page)}
          rowCountLimit={data.limit || 10}
          handleSorting={handleSortByColumn}
        />
      ) : null}
    </div>
  );
};

export default ProposalTableView;

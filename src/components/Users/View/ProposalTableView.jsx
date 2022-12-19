import { Button, Loader, Select } from '@mantine/core';
import dayjs from 'dayjs';
import React, { useEffect, useMemo } from 'react';
import { ChevronDown } from 'react-feather';
import { useSearchParams } from 'react-router-dom';
import { useFetchMasters } from '../../../hooks/masters.hooks';
import { useFetchProposals, useUpdateProposal } from '../../../hooks/proposal.hooks';
import MenuPopover from '../../../pages/Proposal/MenuPopover';
import { serialize } from '../../../utils';
import toIndianCurrency from '../../../utils/currencyFormat';
import Table from '../../Table/Table';

const nativeSelectStyles = {
  rightSection: { pointerEvents: 'none' },
};
const DATE_FORMAT = 'DD MMM YYYY';

const ProposalTableView = ({ viewType, userId = null, setCounts }) => {
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

  const { mutate: update, isLoading: isUpdateProposalLoading } = useUpdateProposal();
  const { data: proposalStatusData, isLoading: isProposalStatusLoading } = useFetchMasters(
    serialize({ type: 'proposal_status', parentId: null, limit: 100, page: 1 }),
  );

  const page = searchParams.get('page');
  const limit = searchParams.get('limit');

  const handlePagination = currentPage => {
    searchParams.set('page', currentPage);
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
              <Button className="text-black font-medium max-w-[250px] capitalize">{name}</Button>
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
    [proposalsData?.docs, limit, proposalStatusData],
  );

  useEffect(() => {
    if (proposalsData)
      setCounts(prevState => ({ ...prevState, proposals: proposalsData?.totalDocs }));
  }, [proposalsData]);

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

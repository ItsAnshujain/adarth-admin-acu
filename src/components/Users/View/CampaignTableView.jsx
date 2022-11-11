import { Button, Image, Menu, NativeSelect, Progress } from '@mantine/core';
import { useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames';
import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Eye, Trash, Download } from 'react-feather';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCampaigns, useDeleteCampaign } from '../../../hooks/campaigns.hooks';
import { serialize } from '../../../utils';
import toIndianCurrency from '../../../utils/currencyFormat';
import MenuIcon from '../../Menu';
import RowsPerPage from '../../RowsPerPage';
import Search from '../../Search';
import Table from '../../Table/Table';

const CampaignTableView = ({ viewType }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams({
    'page': 1,
    'limit': 10,
    'sortBy': 'createdAt',
    'sortOrder': 'asc',
  });
  const [searchInput, setSearchInput] = useState('');
  const { data: campaignData, isLoading: isLoadingCampaignData } = useCampaigns(
    viewType ? searchParams.toString() : null,
    viewType,
  );

  const { mutate: delCampaign } = useDeleteCampaign();

  const page = searchParams.get('page');
  const limit = searchParams.get('limit');

  const invalidate = () => {
    queryClient.invalidateQueries(['campaigns', searchParams.toString()]);
  };

  const deleteCampaign = id => {
    delCampaign(serialize({ id }), {
      onSuccess: invalidate,
    });
  };

  const COLUMNS = useMemo(
    () => [
      {
        Header: '#',
        accessor: '_id',
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
        Header: 'CLIENT',
        accessor: 'client',
        Cell: () => useMemo(() => <p className="pl-2">-</p>, []),
      },
      {
        Header: 'ORDER DATE',
        accessor: 'orderDate',
        Cell: () => useMemo(() => <p className="pl-2">-</p>, []),
      },
      {
        Header: 'ORDER TYPE',
        accessor: 'orderType',
        Cell: () => useMemo(() => <p className="pl-2">-</p>, []),
      },
      {
        Header: 'CAMPAIGN NAME',
        accessor: 'name',
        Cell: ({
          row: {
            original: { name, _id, thumbnail },
          },
        }) =>
          useMemo(
            () => (
              <div
                aria-hidden="true"
                onClick={() => navigate(`view-details/${_id}`)}
                className="flex gap-2 items-center cursor-pointer"
              >
                <div className="flex flex-1 gap-2 items-center ">
                  <Image
                    height={30}
                    width={32}
                    alt={name}
                    fit="cover"
                    withPlaceholder
                    src={thumbnail}
                    className="rounded-md overflow-hidden"
                  />
                  <span className="truncate w-[100px]" title={name}>
                    {name}
                  </span>
                </div>
              </div>
            ),
            [],
          ),
      },
      {
        Header: 'CAMPAIGN TYPE',
        accessor: 'type',
        Cell: ({
          row: {
            original: { isFeatured },
          },
        }) =>
          useMemo(
            () => (
              <div className={classNames(`w-fit ${isFeatured ? 'text-purple-450' : 'text-black'}`)}>
                {isFeatured ? 'Featured' : 'Predefine'}
              </div>
            ),
            [isFeatured],
          ),
      },
      {
        Header: 'HEALTH',
        accessor: 'healthStatus',
        Cell: ({ cell: { value } }) =>
          useMemo(
            () => (
              <div className="w-24">
                <Progress
                  sections={[
                    { value, color: 'green' },
                    { value: 100 - value, color: 'red' },
                  ]}
                />
              </div>
            ),
            [],
          ),
      },
      {
        Header: 'CAMPAIGN STATUS',
        accessor: 'campaignStatus',
        Cell: () =>
          useMemo(
            () => (
              <NativeSelect
                className="mr-2"
                data={[]}
                styles={{
                  rightSection: { pointerEvents: 'none' },
                }}
                rightSection={<ChevronDown size={16} className="mt-[1px] mr-1" />}
                rightSectionWidth={40}
              />
            ),
            [],
          ),
      },
      {
        Header: 'PAYMENT STATUS',
        accessor: 'paymentStatus',
        Cell: () =>
          useMemo(
            () => (
              <NativeSelect
                data={[]}
                styles={{
                  rightSection: { pointerEvents: 'none' },
                }}
                rightSection={<ChevronDown size={16} className="mt-[1px] mr-1" />}
                rightSectionWidth={40}
              />
            ),
            [],
          ),
      },
      {
        Header: 'PRINTING STATUS',
        accessor: 'printingStatus',
        Cell: () =>
          useMemo(
            () => (
              <NativeSelect
                className="mr-2"
                data={[]}
                styles={{
                  rightSection: { pointerEvents: 'none' },
                }}
                rightSection={<ChevronDown size={16} className="mt-[1px] mr-1" />}
                rightSectionWidth={40}
              />
            ),
            [],
          ),
      },
      {
        Header: 'MOUNTING STATUS',
        accessor: 'mountingStatus',
        Cell: () =>
          useMemo(
            () => (
              <NativeSelect
                className="mr-2"
                data={[]}
                styles={{
                  rightSection: { pointerEvents: 'none' },
                }}
                rightSection={<ChevronDown size={16} className="mt-[1px] mr-1" />}
                rightSectionWidth={40}
              />
            ),
            [],
          ),
      },
      {
        Header: 'PAYMENT TYPE',
        accessor: 'paymentType',
        Cell: () => useMemo(() => <p className="w-36 capitalize">-</p>, []),
      },
      {
        Header: 'SCHEDULE',
        accessor: 'schedule',
        Cell: () =>
          useMemo(
            () => (
              <div className="flex items-center text-xs w-max">
                <span className="py-1 px-1 bg-slate-200 mr-2  rounded-md ">-</span>
                &gt;
                <span className="py-1 px-1 bg-slate-200 mx-2  rounded-md">-</span>
              </div>
            ),
            [],
          ),
      },
      {
        Header: 'TOTAL PLACES',
        accessor: 'place',

        Cell: ({ cell: { value } }) => value?.length || 0,
      },
      {
        Header: 'PRICING',
        accessor: 'price',
        Cell: ({ cell: { value } }) => toIndianCurrency(value || 0),
      },
      {
        Header: 'PURCHASE ORDER',
        accessor: 'purchaseOrder',
        Cell: () => useMemo(() => <Button className="text-purple-350">Download</Button>, []),
      },
      {
        Header: 'RELEASE ORDER',
        accessor: 'releaseOrder',
        Cell: () => useMemo(() => <Button className="text-purple-350">Download</Button>, []),
      },
      {
        Header: 'INVOICE',
        accessor: 'invoice',
        Cell: () => useMemo(() => <Button className="text-purple-350 px-0">Download</Button>, []),
      },
      {
        Header: 'ACTION',
        accessor: 'action',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { _id, isFeatured },
          },
        }) =>
          useMemo(
            () => (
              <Menu shadow="md" width={150}>
                <Menu.Target>
                  <button type="button">
                    <MenuIcon />
                  </button>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item>
                    <div
                      aria-hidden
                      onClick={() => navigate(`view-details/${_id}`)}
                      className="cursor-pointer flex items-center gap-1"
                    >
                      <Eye className="h-4" />
                      <span className="ml-1">View Details</span>
                    </div>
                  </Menu.Item>
                  <Menu.Item aria-hidden>
                    <div className="cursor-pointer flex items-center gap-1">
                      <Download className="h-4" />
                      <span className="ml-1">Download</span>
                    </div>
                  </Menu.Item>
                  <Menu.Item aria-hidden onClick={() => deleteCampaign(_id)}>
                    <div className="cursor-pointer flex items-center gap-1">
                      <Trash className="h-4" />
                      <span className="ml-1">Delete</span>
                    </div>
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ),
            [isFeatured, _id],
          ),
      },
    ],
    [campaignData?.docs],
  );

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

  useEffect(() => {
    handleSearch();
    if (searchInput === '') {
      searchParams.delete('search');
      setSearchParams(searchParams);
    }
  }, [searchInput]);

  return (
    <div className="pr-7">
      <div className="flex justify-between h-20 items-center">
        <RowsPerPage setCount={handleRowCount} count={limit} />
        <Search search={searchInput} setSearch={setSearchInput} />
      </div>
      {campaignData?.docs?.length === 0 && !isLoadingCampaignData ? (
        <div className="w-full min-h-[400px] flex justify-center items-center">
          <p className="text-xl">No records found</p>
        </div>
      ) : null}
      {campaignData?.docs?.length ? (
        <Table
          COLUMNS={COLUMNS}
          data={campaignData?.docs || []}
          activePage={campaignData?.page || 1}
          totalPages={campaignData?.totalPages || 1}
          setActivePage={handlePagination}
          rowCountLimit={limit}
        />
      ) : null}
    </div>
  );
};

export default CampaignTableView;

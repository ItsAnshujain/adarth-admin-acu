import { useMemo, useEffect, useState } from 'react';
import { NativeSelect, Progress, Image, Loader, Text } from '@mantine/core';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronDown } from 'react-feather';
import { useQueryClient } from '@tanstack/react-query';
import { useDebouncedValue } from '@mantine/hooks';
import classNames from 'classnames';
import { useCampaigns, useUpdateCampaign } from '../../hooks/campaigns.hooks';
import AreaHeader from '../../components/Campaigns/Header';
import GridView from '../../components/Campaigns/GridView';
import Table from '../../components/Table/Table';
import RowsPerPage from '../../components/RowsPerPage';
import Search from '../../components/Search';
import { serialize } from '../../utils/index';
import toIndianCurrency from '../../utils/currencyFormat';
import { useFetchMasters } from '../../hooks/masters.hooks';
import useLayoutView from '../../store/layout.store';
import CampaignsMenuPopover from '../../components/Popovers/CampaignsMenuPopover';

const statusSelectStyle = {
  rightSection: { pointerEvents: 'none' },
};

const initialState = {
  page: 1,
  limit: '10',
  sortBy: 'name',
  sortOrder: 'desc',
  type: 'predefined',
};

const Home = () => {
  const queryClient = useQueryClient();
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchInput, 800);
  const viewType = useLayoutView(state => state.activeLayout);
  const [searchParams, setSearchParams] = useSearchParams(initialState);

  const { data: campaignData, isLoading } = useCampaigns(searchParams.toString());
  const { mutate } = useUpdateCampaign();

  const { data: campaignStatus } = useFetchMasters(
    serialize({ type: 'campaign_status', parentId: null, limit: 100, page: 1 }),
  );

  const invalidate = () => queryClient.invalidateQueries(['campaigns', searchParams.toString()]);

  const updateCampaign = (id, data) => {
    mutate(
      { id, data },
      {
        onSuccess: invalidate,
      },
    );
  };

  const campaignList = useMemo(
    () => campaignStatus?.docs?.map(item => ({ label: item.name, value: item._id })) || [],
    [campaignStatus],
  );

  const COLUMNS = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id',
        disableSortBy: true,
        Cell: ({ row: { index } }) =>
          useMemo(() => {
            const currentPage = Math.max(searchParams.get('page'), 1);
            const rowCount = (currentPage - 1) * +(searchParams.get('limit') || 0);
            return <div className="pl-2">{rowCount + index + 1}</div>;
          }, []),
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
              <Link
                to={`/campaigns/view-details/${_id}`}
                className="flex items-center cursor-pointer underline"
              >
                <div className="flex flex-1 gap-2 items-center">
                  <Image
                    height={30}
                    width={32}
                    alt={name}
                    fit="cover"
                    withPlaceholder
                    src={thumbnail}
                    className="rounded-md overflow-hidden"
                  />
                  <Text
                    className="w-[200px] text-purple-450 font-medium"
                    title={name}
                    lineClamp={1}
                  >
                    {name}
                  </Text>
                </div>
              </Link>
            ),
            [_id, thumbnail, name],
          ),
      },
      {
        Header: 'TYPE',
        accessor: 'type',
        Cell: ({
          row: {
            original: { type, isFeatured },
          },
        }) =>
          useMemo(
            () => (
              <p
                className={classNames(
                  isFeatured ? 'text-purple-450 font-medium' : 'text-black',
                  'w-24 capitalize',
                )}
              >
                {isFeatured ? 'Featured' : type}
              </p>
            ),
            [],
          ),
      },
      {
        Header: 'HEALTH',
        accessor: 'healthStatus',
        Cell: ({
          row: {
            original: { healthStatus },
          },
        }) =>
          useMemo(
            () => (
              <div className="w-24">
                <Progress
                  sections={[
                    { value: healthStatus, color: 'green' },
                    { value: 100 - (healthStatus || 0), color: 'red' },
                  ]}
                />
              </div>
            ),
            [],
          ),
      },
      {
        Header: 'STATUS',
        accessor: 'createStatus.name',
        Cell: ({
          row: {
            original: { _id, createStatus },
          },
        }) =>
          useMemo(() => {
            const updatedCampaignList = [...campaignList];
            if (!createStatus) {
              updatedCampaignList.unshift({ label: 'Select', value: '' });
            }

            return (
              <NativeSelect
                defaultValue={createStatus?._id || ''}
                onChange={e => updateCampaign(_id, { createStatus: e.target.value })}
                data={updatedCampaignList}
                styles={statusSelectStyle}
                rightSection={<ChevronDown size={16} className="mt-[1px] mr-1" />}
                rightSectionWidth={40}
              />
            );
          }, [createStatus, _id]),
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
        }) => toIndianCurrency(price || 0),
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
              <CampaignsMenuPopover
                itemId={_id}
                isFeatured={isFeatured}
                onClickSetAsFeature={() =>
                  updateCampaign(_id, {
                    isFeatured: !isFeatured,
                  })
                }
              />
            ),
            [isFeatured, _id],
          ),
      },
    ],
    [campaignStatus, campaignData?.docs],
  );

  const setQuery = (key, val) => {
    if (![undefined, '', null].includes(val)) searchParams.set(key, val);
    else searchParams.delete(key);
    setSearchParams(searchParams);
  };

  const { limit, page } = useMemo(
    () => ({
      limit: searchParams.get('limit'),
      page: Number(searchParams.get('page')),
    }),
    [searchParams],
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
    if (debouncedSearch) {
      searchParams.set('search', debouncedSearch);
      searchParams.set('page', 1);
    } else searchParams.delete('search');

    setSearchParams(searchParams);
  }, [debouncedSearch]);

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 border-l border-gray-450 overflow-y-auto">
      <AreaHeader text="Campaign List" />
      <div className="flex justify-between h-20 items-center pr-7">
        <RowsPerPage setCount={data => setQuery('limit', data)} count={limit} />
        <Search search={searchInput} setSearch={setSearchInput} />
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-[400px]">
          <Loader />
        </div>
      ) : null}
      {!campaignData?.docs?.length && !isLoading ? (
        <div className="w-full min-h-[400px] flex justify-center items-center">
          <p className="text-xl">No records found</p>
        </div>
      ) : null}
      {viewType.campaign === 'grid' && campaignData?.docs?.length ? (
        <GridView
          count={limit}
          activePage={page}
          totalPages={campaignData?.totalPages || 1}
          list={campaignData?.docs || []}
          setActivePage={data => setQuery('page', data)}
          isLoadingList={isLoading}
        />
      ) : viewType.campaign === 'list' && campaignData?.docs?.length ? (
        <Table
          COLUMNS={COLUMNS}
          data={campaignData?.docs || []}
          activePage={page}
          totalPages={campaignData?.totalPages || 1}
          setActivePage={data => setQuery('page', data)}
          handleSorting={handleSortByColumn}
        />
      ) : null}
    </div>
  );
};

export default Home;

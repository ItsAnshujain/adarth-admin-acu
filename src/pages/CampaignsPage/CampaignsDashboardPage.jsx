import { useMemo, useEffect, useState } from 'react';
import { NativeSelect, Image, Loader, Text, Box } from '@mantine/core';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronDown } from 'react-feather';
import { useQueryClient } from '@tanstack/react-query';
import { useDebouncedValue } from '@mantine/hooks';
import classNames from 'classnames';
import { useModals } from '@mantine/modals';
import { useCampaigns, useUpdateCampaign } from '../../apis/queries/campaigns.queries';
import AreaHeader from '../../components/modules/campaigns/Header';
import GridView from '../../components/modules/campaigns/GridView';
import Table from '../../components/Table/Table';
import RowsPerPage from '../../components/RowsPerPage';
import Search from '../../components/Search';
import { generateSlNo, serialize } from '../../utils/index';
import toIndianCurrency from '../../utils/currencyFormat';
import { useFetchMasters } from '../../apis/queries/masters.queries';
import useLayoutView from '../../store/layout.store';
import CampaignsMenuPopover from '../../components/Popovers/CampaignsMenuPopover';
import modalConfig from '../../utils/modalConfig';

const updatedModalConfig = {
  ...modalConfig,
  classNames: {
    title: 'font-dmSans text-xl px-4',
    header: 'px-4 pt-4',
    body: '',
    close: 'mr-4',
  },
};

const initialState = {
  page: 1,
  limit: '10',
  sortBy: 'name',
  sortOrder: 'desc',
  type: 'predefined',
};

const CampaignsDashboardPage = () => {
  const queryClient = useQueryClient();
  const modals = useModals();
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchInput, 800);
  const viewType = useLayoutView(state => state.activeLayout);
  const [searchParams, setSearchParams] = useSearchParams(initialState);

  const { data: campaignData, isLoading } = useCampaigns(searchParams.toString());
  const { mutate } = useUpdateCampaign();

  const { data: campaignStatus } = useFetchMasters(
    serialize({ type: 'campaign_status', parentId: null, limit: 100, page: 1 }),
  );

  const { limit, page } = useMemo(
    () => ({
      limit: searchParams.get('limit'),
      page: Number(searchParams.get('page')),
    }),
    [searchParams],
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

  const togglePreviewModal = imgSrc =>
    modals.openModal({
      title: 'Preview',
      children: (
        <Image src={imgSrc || null} height={580} alt="preview" withPlaceholder={!!imgSrc} />
      ),
      ...updatedModalConfig,
    });

  const COLUMNS = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id',
        disableSortBy: true,
        Cell: info => useMemo(() => <p>{generateSlNo(info.row.index, page, limit)}</p>, []),
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
              <div className="flex flex-1 gap-2 items-center">
                <Box
                  className={classNames(
                    'bg-white border rounded-md',
                    thumbnail ? 'cursor-zoom-in' : '',
                  )}
                  onClick={() => (thumbnail ? togglePreviewModal(thumbnail) : null)}
                >
                  {thumbnail ? (
                    <Image src={thumbnail} alt="thumbnail" height={32} width={32} />
                  ) : (
                    <Image src={null} withPlaceholder height={32} width={32} alt="card" />
                  )}
                </Box>
                <Link
                  to={`/campaigns/view-details/${_id}`}
                  className="flex items-center cursor-pointer underline"
                >
                  <Text
                    className="w-[200px] text-purple-450 font-medium"
                    title={name}
                    lineClamp={1}
                  >
                    {name}
                  </Text>
                </Link>
              </div>
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
                classNames={{ rightSection: 'pointer-events-none' }}
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
    <div className="col-span-12 md:col-span-12 lg:col-span-10 border-l border-gray-450 overflow-y-auto px-5">
      <AreaHeader text="Campaign List" />
      <div className="flex justify-between h-20 items-center">
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
          className="max-h-[72vh]"
        />
      ) : null}
    </div>
  );
};

export default CampaignsDashboardPage;

import { useMemo, useState, useEffect } from 'react';
import { NativeSelect, Menu, Progress, Image } from '@mantine/core';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Trash, Edit2, Eye, Bookmark, ChevronDown } from 'react-feather';
import classNames from 'classnames';
import { useQueryClient } from '@tanstack/react-query';
import { useDebouncedState } from '@mantine/hooks';
import { useCampaigns, useDeleteCampaign, useUpdateCampaign } from '../../hooks/campaigns.hooks';
import AreaHeader from '../../components/Campaigns/Header';
import GridView from '../../components/GridView';
import MenuIcon from '../../components/Menu';
import Table from '../../components/Table/Table';
import Card from '../../components/Campaigns/Card';
import RowsPerPage from '../../components/RowsPerPage';
import Search from '../../components/Search';
import { serialize } from '../../utils/index';
import toIndianCurrency from '../../utils/currencyFormat';
import { useFetchMasters } from '../../hooks/masters.hooks';

const initialState = {
  page: 1,
  limit: 10,
  sortBy: 'name',
  sortOrder: 'asc',
};

const Home = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useDebouncedState('', 500);
  const [view, setView] = useState('list');

  const [searchParams, setSearchParams] = useSearchParams(initialState);

  const [query, setQuery] = useState(initialState);

  const { data: campaignData } = useCampaigns(serialize(search ? { ...query, search } : query));
  const { mutate } = useUpdateCampaign();
  const { mutate: delCampaign } = useDeleteCampaign();

  const { data: campaignStatus } = useFetchMasters(serialize({ type: 'campaign_status' }));

  const invalidate = () => {
    queryClient.invalidateQueries(['campaigns', serialize(search ? { ...query, search } : query)]);
  };

  const updateCampaign = (id, data) => {
    mutate(
      { id, data },
      {
        onSuccess: invalidate,
      },
    );
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
        Cell: ({ row: { index } }) => index + 1,
      },
      {
        Header: 'CAMPAIGN NAME',
        accessor: 'name',
        Cell: tableProps => {
          const navigate = useNavigate();
          const { name, _id, thumbnail } = tableProps.row.original;
          return useMemo(
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
          );
        },
      },
      {
        Header: 'TYPE',
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
        Header: 'STATUS',
        accessor: 'status',
        Cell: ({
          row: {
            original: { _id, status },
          },
        }) =>
          useMemo(
            () => (
              <NativeSelect
                defaultValue={status}
                onChange={e => updateCampaign(_id, { status: e.target.value })}
                data={campaignStatus?.docs?.map(item => item.name) || []}
                styles={{
                  rightSection: { pointerEvents: 'none' },
                }}
                rightSection={<ChevronDown size={16} className="mt-[1px] mr-1" />}
                rightSectionWidth={40}
              />
            ),
            [status, _id],
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
        Header: '',
        accessor: 'details',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { _id, isFeatured },
          },
        }) => {
          const navigate = useNavigate();
          return useMemo(
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
                  <Menu.Item>
                    <div
                      aria-hidden
                      onClick={() => navigate(`edit-details/${_id}`)}
                      className="cursor-pointer flex items-center gap-1"
                    >
                      <Edit2 className="h-4" />
                      <span className="ml-1">Edit</span>
                    </div>
                  </Menu.Item>
                  <Menu.Item aria-hidden onClick={() => deleteCampaign(_id)}>
                    <div className="cursor-pointer flex items-center gap-1">
                      <Trash className="h-4" />
                      <span className="ml-1">Delete</span>
                    </div>
                  </Menu.Item>
                  <Menu.Item>
                    <div
                      className={classNames(
                        'bg-white cursor-pointer flex items-center text',
                        isFeatured ? 'text-purple-450' : '',
                      )}
                      aria-hidden
                      onClick={() => updateCampaign(_id, { isFeatured: !isFeatured })}
                    >
                      <Bookmark className="h-4 mr-2" />
                      <span>Set as Featured</span>
                    </div>
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ),
            [isFeatured, _id],
          );
        },
      },
    ],
    [campaignStatus],
  );

  const onApplyFilter = data => {
    setSearchParams(serialize({ ...query, ...data }));
    setQuery(p => ({ ...p, ...data }));
  };

  const onResetFilter = () => {
    setSearchParams(serialize(initialState));
    setQuery(initialState);
  };

  useEffect(() => {
    const obj = {};
    searchParams.forEach((val, key) => {
      if (val !== undefined) {
        if (typeof initialState[key] === 'number') {
          obj[key] = Number(val) || 0;
        } else {
          obj[key] = val || '';
        }
      }
    });

    setSearchParams(serialize(obj));
    setQuery(obj);
  }, []);

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto">
      <AreaHeader
        text="Campaign List"
        setView={setView}
        onApplyFilter={onApplyFilter}
        onResetFilter={onResetFilter}
      />
      <div className="flex justify-between h-20 items-center">
        <RowsPerPage
          setCount={data => setQuery(prev => ({ ...prev, limit: Number(data) }))}
          count={`${query.limit}`}
        />
        <Search search={search} setSearch={setSearch} />
      </div>
      {view === 'grid' ? (
        <GridView count={query.limit} Card={Card} list={campaignData?.docs || []} />
      ) : (
        <Table
          COLUMNS={COLUMNS}
          data={campaignData?.docs || []}
          allowRowsSelect
          activePage={campaignData?.page || 1}
          totalPages={campaignData?.totalPages || 1}
          setActivePage={data => setQuery(prev => ({ ...prev, page: data }))}
          rowCountLimit={query.limit}
        />
      )}
    </div>
  );
};

export default Home;

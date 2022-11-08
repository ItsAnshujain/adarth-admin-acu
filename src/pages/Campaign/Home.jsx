import { useMemo, useState } from 'react';
import { NativeSelect, Menu, Progress } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { Trash, Edit2, Eye, Bookmark, ChevronDown } from 'react-feather';
import classNames from 'classnames';
import { useCampaigns } from '../../hooks/campaigns.hooks';
import AreaHeader from '../../components/Campaigns/Header';
import GridView from '../../components/GridView';
import MenuIcon from '../../components/Menu';
import Table from '../../components/Table/Table';
import Card from '../../components/Campaigns/Card';
import RowsPerPage from '../../components/RowsPerPage';
import Search from '../../components/Search';
import { serialize } from '../../utils/index';
import toIndianCurrency from '../../utils/currencyFormat';

const Home = () => {
  const [search, setSearch] = useState('');
  const [view, setView] = useState('list');

  const [query, setQuery] = useState({ page: 1, limit: 10, sortBy: 'name', sortOrder: 'asc' });

  const { data: campaignData } = useCampaigns(serialize(query));

  const COLUMNS = useMemo(() => [
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
        const { name, _id: id } = tableProps.row.original;
        // const color =
        //   status === 'Available' ? 'green' : status === 'Unavailable' ? 'orange' : 'primary';
        return useMemo(
          () => (
            <div
              aria-hidden="true"
              onClick={() => navigate(`view-details/${id}`)}
              className="flex gap-2 items-center cursor-pointer"
            >
              <div className="flex flex-1 gap-2 items-center ">
                <div className="bg-white h-8 w-8 border rounded-md">
                  {/* <img className="h-8 w-8 mx-auto" src={thumbnail} alt="banner" /> */}
                </div>
                <p>{name}</p>
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
      Cell: tableProps => {
        const {
          row: {
            original: { type },
          },
        } = tableProps;
        return useMemo(
          () => (
            <div
              className={classNames(
                `w-fit ${type === 'Featured' ? 'text-purple-450' : 'text-black'}`,
              )}
            >
              {type}
            </div>
          ),
          [],
        );
      },
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
      Cell: tableProps => {
        const {
          row: {
            original: { pricing },
          },
        } = tableProps;

        const [value, setValue] = useState(pricing);

        return useMemo(
          () => (
            <NativeSelect
              value={value}
              onChange={e => setValue(e.target.value)}
              data={['Published', 'Unpublished']}
              styles={{
                rightSection: { pointerEvents: 'none' },
              }}
              rightSection={<ChevronDown size={16} className="mt-[1px] mr-1" />}
              rightSectionWidth={40}
            />
          ),
          [],
        );
      },
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
      Cell: tableProps => {
        const navigate = useNavigate();
        const { id } = tableProps.row.original;
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
                    onClick={() => navigate(`view-details/${id}`)}
                    className="cursor-pointer flex items-center gap-1"
                  >
                    <Eye className="h-4" />
                    <span className="ml-1">View Details</span>
                  </div>
                </Menu.Item>
                <Menu.Item>
                  <div
                    aria-hidden
                    onClick={() => navigate(`edit-details/${id}`)}
                    className="cursor-pointer flex items-center gap-1"
                  >
                    <Edit2 className="h-4" />
                    <span className="ml-1">Edit</span>
                  </div>
                </Menu.Item>
                <Menu.Item>
                  <div className="cursor-pointer flex items-center gap-1">
                    <Trash className="h-4" />
                    <span className="ml-1">Delete</span>
                  </div>
                </Menu.Item>
                <Menu.Item>
                  <div className="bg-white cursor-pointer flex items-center ">
                    <Bookmark className="h-4 mr-2" />
                    <span>Set as Featured</span>
                  </div>
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ),
          [],
        );
      },
    },
  ]);

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto">
      <AreaHeader text="Campaign List" setView={setView} />
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

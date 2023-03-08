import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { Badge, Image, Loader, Progress, Tabs, Text } from '@mantine/core';
import { Link, useSearchParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import DomToPdf from 'dom-to-pdf';
import { useDebouncedState } from '@mantine/hooks';
import Header from '../../components/Reports/Header';
import Table from '../../components/Table/Table';
// import RowsPerPage from '../../components/RowsPerPage';
// import Search from '../../components/Search';
import BestIcon from '../../assets/best-performing-inventory.svg';
import WorstIcon from '../../assets/worst-performing-inventory.svg';
import toIndianCurrency from '../../utils/currencyFormat';
import SpacesMenuPopover from '../../components/Popovers/SpacesMenuPopover';
import {
  useFetchInventoryReportList,
  useInventoryReport,
  useInventoryStats,
} from '../../hooks/inventory.hooks';
import ViewByFilter from '../../components/Reports/ViewByFilter';
import InventoryStatsContent from '../../components/Reports/Inventory/InventoryStatsContent';
// import SubHeader from '../../components/Reports/Inventory/SubHeader';
import { categoryColors, monthsInShort, serialize } from '../../utils';

dayjs.extend(quarterOfYear);

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
);

const DATE_FORMAT = 'YYYY-MM-DD';

const options = {
  responsive: true,
};

const config = {
  type: 'line',
  options: { responsive: true },
};

const InventoryReport = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const chartRef = useRef(null);
  // eslint-disable-next-line no-unused-vars
  const [searchInput, setSearchInput] = useDebouncedState('', 1000);
  const [inventoryQuery, setInventoryQuery] = useState({
    'limit': 10,
    'page': 1,
    'sortOrder': 'desc',
    'sortBy': 'basicInformation.spaceName',
  });

  // eslint-disable-next-line no-unused-vars
  const [count, setCount] = useState('20');
  const [areaData, setAreaData] = useState({
    id: uuidv4(),
    labels: monthsInShort,
    datasets: [
      {
        label: 'Revenue',
        data: Array.from({ length: 12 }, () => 0),
        borderColor: '#914EFB',
        cubicInterpolationMode: 'monotone',
      },
    ],
  });

  const { data: inventoryStats, isLoading: isInventoryStatsLoading } = useInventoryStats('');
  const {
    data: inventoryReports,
    isLoading: isInventoryReportLoading,
    isSuccess,
  } = useInventoryReport('');
  const { data: inventoryReportList, isLoading: inventoryReportListLoading } =
    useFetchInventoryReportList(serialize(inventoryQuery));
  const page = searchParams.get('page');
  const limit = searchParams.get('limit');

  const handleViewBy = viewType => {
    if (viewType === 'reset') {
      searchParams.delete('startDate');
      searchParams.delete('endDate');
    }
    if (viewType === 'week' || viewType === 'month' || viewType === 'year') {
      searchParams.set('startDate', dayjs().format(DATE_FORMAT));
      searchParams.set('endDate', dayjs().add(1, viewType).format(DATE_FORMAT));
    }
    if (viewType === 'quarter') {
      searchParams.set('startDate', dayjs().format(DATE_FORMAT));
      searchParams.set(
        'endDate',
        dayjs(dayjs().format(DATE_FORMAT)).quarter(2).format(DATE_FORMAT),
      );
    }
    setSearchParams(searchParams);
  };

  const inventoryHealthStatus = useMemo(
    () => ({
      datasets: [
        {
          data: [inventoryStats?.unHealthy ?? 0, inventoryStats?.healthy ?? 0],
          backgroundColor: ['#914EFB', '#FF900E'],
          borderColor: ['#914EFB', '#FF900E'],
          borderWidth: 1,
        },
      ],
    }),
    [inventoryStats],
  );

  // TODO: kept it for demo purpose will remove later
  // disabled sortBy for now
  const inventoryColumn = [
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
      Header: 'SPACE NAME & PHOTO',
      accessor: 'basicInformation.spaceName',
      disableSortBy: true,
      Cell: ({
        row: {
          original: { _id, basicInformation, isUnderMaintenance },
        },
      }) =>
        useMemo(
          () => (
            <div className="flex items-center gap-2">
              <div className="bg-white border rounded-md cursor-zoom-in">
                {basicInformation?.spacePhoto ? (
                  <Image src={basicInformation?.spacePhoto} alt="banner" height={32} width={32} />
                ) : (
                  <Image src={null} withPlaceholder height={32} width={32} />
                )}
              </div>
              <Link
                to={`/inventory/view-details/${_id}`}
                className="font-medium px-2 max-w-[180px] underline"
              >
                <Text className="overflow-hidden text-ellipsis text-purple-450" lineClamp={1}>
                  {basicInformation?.spaceName}
                </Text>
              </Link>
              <Badge
                className="capitalize"
                variant="filled"
                color={isUnderMaintenance ? 'yellow' : 'green'}
              >
                {isUnderMaintenance ? 'Under Maintenance' : 'Available'}
              </Badge>
            </div>
          ),
          [],
        ),
    },
    {
      Header: 'MEDIA OWNER NAME',
      accessor: 'basicInformation.mediaOwner.name',
      disableSortBy: true,
      Cell: ({
        row: {
          original: { basicInformation },
        },
      }) => useMemo(() => <p className="w-fit">{basicInformation?.mediaOwner?.name || '-'}</p>, []),
    },
    {
      Header: 'CATEGORY',
      accessor: 'basicInformation.category.name',
      disableSortBy: true,
      Cell: ({
        row: {
          original: { basicInformation },
        },
      }) =>
        useMemo(() => {
          const colorType = Object.keys(categoryColors).find(
            key => categoryColors[key] === basicInformation?.category?.name,
          );

          return (
            <div>
              {basicInformation?.category?.name ? (
                <Badge color={colorType} size="lg" className="capitalize">
                  {basicInformation.category.name}
                </Badge>
              ) : (
                '-'
              )}
            </div>
          );
        }, []),
    },
    {
      Header: 'TOTAL REVENUE',
      accessor: 'revenue',
      disableSortBy: true,
      Cell: ({
        row: {
          original: { revenue },
        },
      }) => useMemo(() => <p className="w-fit mr-2">{toIndianCurrency(revenue ?? 0)}</p>, []),
    },
    {
      Header: 'TOTAL BOOKING',
      accessor: 'totalBookings',
      disableSortBy: true,
      Cell: ({
        row: {
          original: { totalBookings },
        },
      }) => useMemo(() => <p className="w-fit">{totalBookings}</p>, []),
    },
    {
      Header: 'TOTAL OPERATIONAL COST',
      accessor: 'operationalCost',
      disableSortBy: true,
      Cell: ({
        row: {
          original: { operationalCost },
        },
      }) =>
        useMemo(() => <p className="w-fit mr-2">{toIndianCurrency(operationalCost ?? 0)}</p>, []),
    },
    {
      Header: 'DIMENSION',
      accessor: 'specifications.size.min',
      disableSortBy: true,
      Cell: ({
        row: {
          original: { specifications },
        },
      }) =>
        useMemo(
          () => (
            <p>{`${specifications?.size?.height || 0}ft x ${
              specifications?.size?.width || 0
            }ft`}</p>
          ),
          [],
        ),
    },
    {
      Header: 'IMPRESSION',
      accessor: 'specifications.impressions.max',
      disableSortBy: true,
      Cell: ({
        row: {
          original: { specifications },
        },
      }) => useMemo(() => <p>{`${specifications?.impressions?.max || 0}+`}</p>, []),
    },
    {
      Header: 'HEALTH STATUS',
      accessor: 'specifications.health',
      disableSortBy: true,
      Cell: ({
        row: {
          original: { specifications },
        },
      }) =>
        useMemo(
          () => (
            <div className="w-24">
              <Progress
                sections={[
                  { value: specifications?.health, color: 'green' },
                  { value: 100 - (specifications?.health || 0), color: 'red' },
                ]}
              />
            </div>
          ),
          [],
        ),
    },
    {
      Header: 'LOCATION',
      accessor: 'location.city',
      disableSortBy: true,
      Cell: ({
        row: {
          original: { location },
        },
      }) => useMemo(() => <p>{location?.city || '-'}</p>, []),
    },
    {
      Header: 'PRICING',
      accessor: 'basicInformation.price',
      disableSortBy: true,
      Cell: ({
        row: {
          original: { basicInformation },
        },
      }) =>
        useMemo(
          () => (
            <p className="pl-2">
              {basicInformation?.price
                ? toIndianCurrency(Number.parseInt(basicInformation?.price, 10))
                : 0}
            </p>
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
      }) =>
        useMemo(
          () => <SpacesMenuPopover itemId={_id} enableEdit={false} enableDelete={false} />,
          [],
        ),
    },
  ];

  const performingInventoryColumn = [
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
      Header: 'SPACE NAME & PHOTO',
      accessor: 'basicInformation.spaceName',
      disableSortBy: true,
      Cell: ({
        row: {
          original: { _id, basicInformation, isUnderMaintenance },
        },
      }) =>
        useMemo(
          () => (
            <div className="flex items-center gap-2">
              <div className="bg-white border rounded-md">
                {basicInformation?.spacePhoto ? (
                  <Image src={basicInformation?.spacePhoto} alt="banner" height={32} width={32} />
                ) : (
                  <Image src={null} withPlaceholder height={32} width={32} />
                )}
              </div>
              <Link
                to={`/inventory/view-details/${_id}`}
                className="font-medium px-2 max-w-[180px] underline"
              >
                <Text className="overflow-hidden text-ellipsis text-purple-450" lineClamp={1}>
                  {basicInformation?.spaceName}
                </Text>
              </Link>
              <Badge
                className="capitalize"
                variant="filled"
                color={isUnderMaintenance ? 'yellow' : 'green'}
              >
                {isUnderMaintenance ? 'Under Maintenance' : 'Available'}
              </Badge>
            </div>
          ),
          [],
        ),
    },
    {
      Header: 'MEDIA OWNER NAME',
      accessor: 'basicInformation.landlord',
      disableSortBy: true,
      Cell: ({
        row: {
          original: { basicInformation },
        },
      }) => useMemo(() => <p className="w-fit">{basicInformation?.landlord}</p>, []),
    },
    {
      Header: 'CATEGORY',
      accessor: 'category',
      disableSortBy: true,
      Cell: ({
        row: {
          original: { basicInformation },
        },
      }) => useMemo(() => <p className="w-fit">{basicInformation?.category}</p>, []),
    },
    {
      Header: 'DIMENSION',
      accessor: 'specifications.size.min',
      disableSortBy: true,
      Cell: ({
        row: {
          original: { specifications },
        },
      }) =>
        useMemo(
          () => (
            <p>{`${specifications?.size?.height || 0}ft x ${
              specifications?.size?.width || 0
            }ft`}</p>
          ),
          [],
        ),
    },
    {
      Header: 'IMPRESSION',
      accessor: 'specifications.impressions.max',
      disableSortBy: true,
      Cell: ({
        row: {
          original: { specifications },
        },
      }) => useMemo(() => <p>{`${specifications?.impressions?.max || 0}+`}</p>, []),
    },
    {
      Header: 'HEALTH STATUS',
      accessor: 'specifications.health',
      disableSortBy: true,
      Cell: ({
        row: {
          original: { specifications },
        },
      }) =>
        useMemo(
          () => (
            <div className="w-24">
              <Progress
                sections={[
                  { value: specifications?.health, color: 'green' },
                  { value: 100 - (specifications?.health || 0), color: 'red' },
                ]}
              />
            </div>
          ),
          [],
        ),
    },
    {
      Header: 'LOCATION',
      accessor: 'location.city',
      disableSortBy: true,
      Cell: ({
        row: {
          original: { location },
        },
      }) => useMemo(() => <p>{location?.city || '-'}</p>, []),
    },
    {
      Header: 'PRICING',
      accessor: 'basicInformation.price',
      disableSortBy: true,
      Cell: ({
        row: {
          original: { basicInformation },
        },
      }) =>
        useMemo(
          () => (
            <p className="pl-2">
              {basicInformation?.price
                ? toIndianCurrency(Number.parseInt(basicInformation?.price, 10))
                : 0}
            </p>
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
      }) =>
        useMemo(
          () => <SpacesMenuPopover itemId={_id} enableEdit={false} enableDelete={false} />,
          [],
        ),
    },
  ];

  const calculateLineData = useCallback(() => {
    setAreaData(prevState => {
      const tempAreaData = { ...prevState, id: uuidv4() };

      if (inventoryReports) {
        inventoryReports?.revenue?.forEach(item => {
          if (item._id.month) {
            tempAreaData.datasets[0].data[item._id.month - 1] = item.price;
          }
        });
      }

      return tempAreaData;
    });
  }, [inventoryReports]);

  const downloadPdf = () => {
    const element = document.getElementById('inventory-pdf');
    const option = {
      filename: 'inventory.pdf',
    };
    DomToPdf(element, option);
  };

  const handleSearch = () => {
    setInventoryQuery(prevState => ({ ...prevState, search: searchInput, page: 1 }));
    // searchParams.set('search', searchInput);
    // searchParams.set('page', 1);
    // setSearchParams(searchParams);
  };

  useEffect(() => {
    handleSearch();
    if (searchInput === '') {
      setInventoryQuery({
        'limit': 10,
        'page': 1,
        'sortOrder': 'desc',
        'sortBy': 'basicInformation.spaceName',
      });
    }
  }, [searchInput]);

  useEffect(() => {
    const chart = chartRef.current;

    if (!chart) {
      return;
    }

    calculateLineData();
  }, [inventoryReports, isSuccess]);

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto">
      <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto">
        <Header text="Inventory Report" onClickDownloadPdf={downloadPdf} />
        <div className="pr-7 pl-5 mt-5 mb-10" id="inventory-pdf">
          <InventoryStatsContent
            inventoryReports={inventoryReports}
            inventoryStats={inventoryStats}
          />
          <div className="flex w-full gap-4">
            <div className="w-[70%]">
              <div className="flex justify-between">
                <p className="font-bold">Revenue Graph</p>
                <ViewByFilter handleViewBy={handleViewBy} />
              </div>
              {isInventoryReportLoading ? (
                <Loader className="mx-auto mt-10" />
              ) : (
                <Line
                  height="120"
                  data={areaData}
                  options={options}
                  ref={chartRef}
                  key={areaData.id}
                />
              )}
            </div>

            <div className="w-[30%] flex gap-8 h-[50%] p-4 border rounded-md">
              <div className="w-[40%]">
                {isInventoryStatsLoading ? (
                  <Loader className="mx-auto" />
                ) : (
                  <Doughnut options={config.options} data={inventoryHealthStatus} />
                )}
              </div>
              <div className="flex flex-col">
                <p className="font-medium">Health Status</p>
                <div className="flex flex-col gap-8 mt-4">
                  <div className="flex gap-2 items-center">
                    <div className="h-2 w-1 p-2 bg-orange-350 rounded-full" />
                    <div>
                      <p className="my-2 text-xs font-light text-slate-400">Healthy</p>
                      <p className="font-bold text-lg">{inventoryStats?.healthy ?? 0}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="h-2 w-1 p-2 rounded-full bg-purple-350" />
                    <div>
                      <p className="my-2 text-xs font-light text-slate-400">Unhealthy</p>
                      <p className="font-bold text-lg">{inventoryStats?.unHealthy ?? 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between gap-4 flex-wrap my-8">
            <div className="border rounded p-8  flex-1">
              <Image src={BestIcon} alt="folder" fit="contain" height={24} width={24} />
              <p className="my-2 text-sm font-light text-slate-400">Best Performing Inventory</p>
              <p className="font-bold">
                {inventoryStats?.best?.[0]?.basicInformation?.spaceName || '--'}
              </p>
            </div>
            <div className="border rounded p-8 flex-1">
              <Image src={WorstIcon} alt="folder" fit="contain" height={24} width={24} />
              <p className="my-2 text-sm font-light text-slate-400">Worst Performing Inventory</p>
              <p className="font-bold">
                {inventoryStats?.worst?.at(-1)?.basicInformation?.spaceName || '--'}
              </p>
            </div>
          </div>
          <div className="col-span-12 md:col-span-12 lg:col-span-10 border-gray-450 mt-10">
            <Tabs defaultValue="gallery">
              <Tabs.List>
                <Tabs.Tab value="gallery">
                  <Text size="md" weight="bold">
                    Inventory Report
                  </Text>
                </Tabs.Tab>
                <Tabs.Tab value="messages">
                  <Text size="md" weight="bold">
                    Best Performing Inventory
                  </Text>
                </Tabs.Tab>
                <Tabs.Tab value="settings">
                  <Text size="md" weight="bold">
                    Worst Performing Inventory
                  </Text>
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="gallery" pt="lg">
                {/* TODO: kept it for demo purpose will remove later */}
                {/* <SubHeader />
                <div className="flex justify-between h-20 items-center pr-7">
                  <RowsPerPage setCount={setCount} count={count} />
                  <Search search={searchInput} setSearch={setSearchInput} />
                </div> */}
                {inventoryReportList?.docs?.length === 0 && !inventoryReportListLoading ? (
                  <div className="w-full min-h-[400px] flex justify-center items-center">
                    <p className="text-xl">No records found</p>
                  </div>
                ) : null}
                {inventoryReportList?.docs?.length ? (
                  <Table COLUMNS={inventoryColumn} data={inventoryReportList?.docs} count={count} />
                ) : null}
              </Tabs.Panel>
              <Tabs.Panel value="messages" pt="lg">
                {inventoryStats?.best?.length === 0 && !isInventoryStatsLoading ? (
                  <div className="w-full min-h-[400px] flex justify-center items-center">
                    <p className="text-xl">No records found</p>
                  </div>
                ) : null}
                {inventoryStats?.best?.length ? (
                  <Table
                    COLUMNS={performingInventoryColumn}
                    data={inventoryStats?.best || []}
                    showPagination={false}
                  />
                ) : null}
              </Tabs.Panel>
              <Tabs.Panel value="settings" pt="lg">
                {inventoryStats?.worst?.length === 0 && !isInventoryStatsLoading ? (
                  <div className="w-full min-h-[400px] flex justify-center items-center">
                    <p className="text-xl">No records found</p>
                  </div>
                ) : null}
                {inventoryStats?.worst?.length ? (
                  <Table
                    COLUMNS={performingInventoryColumn}
                    data={inventoryStats?.worst || []}
                    showPagination={false}
                  />
                ) : null}
              </Tabs.Panel>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryReport;

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
import RowsPerPage from '../../components/RowsPerPage';
import Search from '../../components/Search';
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
import SubHeader from '../../components/Reports/Inventory/SubHeader';
import {
  categoryColors,
  dateByQuarter,
  daysInAWeek,
  monthsInShort,
  quarters,
  serialize,
} from '../../utils';

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
  const [searchParams, setSearchParams] = useSearchParams({
    'limit': 10,
    'page': 1,
    'sortOrder': 'desc',
    'sortBy': 'basicInformation.spaceName',
  });
  const chartRef = useRef(null);
  const [searchInput, setSearchInput] = useDebouncedState('', 1000);

  const [queryByTime, setQueryByTime] = useState({
    'groupBy': 'month',
    'startDate': dayjs().startOf('year').format(DATE_FORMAT),
    'endDate': dayjs().endOf('year').format(DATE_FORMAT),
  });

  const [areaData, setAreaData] = useState({
    id: uuidv4(),
    labels: monthsInShort,
    datasets: [
      {
        label: 'Revenue',
        data: [],
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
  } = useInventoryReport(serialize(queryByTime));
  const { data: inventoryReportList, isLoading: inventoryReportListLoading } =
    useFetchInventoryReportList(searchParams.toString());
  const page = searchParams.get('page');
  const limit = searchParams.get('limit');

  const handleViewBy = viewType => {
    if (viewType === 'reset') {
      setQueryByTime({
        'groupBy': 'month',
        'startDate': dayjs().startOf('year').format(DATE_FORMAT),
        'endDate': dayjs().endOf('year').format(DATE_FORMAT),
      });
    }
    if (viewType === 'week' || viewType === 'month' || viewType === 'year') {
      setQueryByTime(prevState => ({
        ...prevState,
        'groupBy':
          viewType === 'year'
            ? 'month'
            : viewType === 'month'
            ? 'dayOfMonth'
            : viewType === 'week'
            ? 'dayOfWeek'
            : 'month',
        'startDate': dayjs().startOf(viewType).format(DATE_FORMAT),
        'endDate': dayjs().endOf(viewType).format(DATE_FORMAT),
      }));
    }
    if (viewType === 'quarter') {
      setQueryByTime({
        'groupBy': 'quarter',
        ...dateByQuarter[dayjs().quarter()],
      });
    }
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
                <Text
                  className="overflow-hidden text-ellipsis text-purple-450"
                  lineClamp={1}
                  title={basicInformation?.spaceName}
                >
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
      Cell: ({
        row: {
          original: { basicInformation },
        },
      }) => useMemo(() => <p className="w-fit">{basicInformation?.mediaOwner?.name || '-'}</p>, []),
    },
    {
      Header: 'CATEGORY',
      accessor: 'basicInformation.category.name',
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
      Cell: ({
        row: {
          original: { revenue },
        },
      }) => useMemo(() => <p className="w-fit mr-2">{toIndianCurrency(revenue ?? 0)}</p>, []),
    },
    {
      Header: 'TOTAL BOOKING',
      accessor: 'totalBooking',
      Cell: ({
        row: {
          original: { totalBookings },
        },
      }) => useMemo(() => <p className="w-fit">{totalBookings}</p>, []),
    },
    {
      Header: 'TOTAL OPERATIONAL COST',
      accessor: 'operationalCost',
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
      Cell: ({
        row: {
          original: { specifications },
        },
      }) => useMemo(() => <p>{`${specifications?.impressions?.max || 0}+`}</p>, []),
    },
    {
      Header: 'HEALTH STATUS',
      accessor: 'specifications.health',
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
      Cell: ({
        row: {
          original: { location },
        },
      }) => useMemo(() => <p>{location?.city || '-'}</p>, []),
    },
    {
      Header: 'PRICING',
      accessor: 'basicInformation.price',
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
                <Text
                  className="overflow-hidden text-ellipsis text-purple-450"
                  lineClamp={1}
                  title={basicInformation?.spaceName}
                >
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
    if (inventoryReports && inventoryReports?.revenue) {
      const tempAreaData = {
        labels: monthsInShort,
        datasets: [
          {
            label: 'Revenue',
            data: [],
            borderColor: '#914EFB',
            backgroundColor: '#914EFB',
            cubicInterpolationMode: 'monotone',
          },
        ],
      };

      tempAreaData.labels =
        queryByTime.groupBy === 'dayOfWeek'
          ? daysInAWeek
          : queryByTime.groupBy === 'dayOfMonth'
          ? Array.from({ length: dayjs().daysInMonth() }, (_, index) => index + 1)
          : queryByTime.groupBy === 'quarter'
          ? quarters
          : monthsInShort;

      tempAreaData.datasets[0].data = Array.from({ length: dayjs().daysInMonth() }, () => 0);

      inventoryReports.revenue?.forEach(item => {
        if (item._id) {
          tempAreaData.datasets[0].data[item._id] = item?.total;
        }
      });
      setAreaData(tempAreaData);
    }
  }, [inventoryReports]);

  const downloadPdf = () => {
    const element = document.getElementById('inventory-pdf');
    const option = {
      filename: 'inventory.pdf',
    };
    DomToPdf(element, option);
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

  useEffect(() => {
    handleSearch();
    if (searchInput === '') {
      searchParams.delete('search');
      setSearchParams(searchParams);
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

            <div className="w-[30%] flex gap-8 h-[50%] p-4 border items-center rounded-md">
              <div className="w-[40%]">
                {isInventoryStatsLoading ? (
                  <Loader className="mx-auto" />
                ) : inventoryStats?.healthy === 0 && inventoryStats?.unHealthy === 0 ? (
                  <p className="text-center">NA</p>
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

              <Tabs.Panel value="gallery">
                <div className="flex justify-between h-20 items-center">
                  <RowsPerPage
                    setCount={currentLimit => handlePagination('limit', currentLimit)}
                    count={limit}
                  />
                  <div className="flex flex-1 justify-end items-center">
                    <Search search={searchInput} setSearch={setSearchInput} />
                    <SubHeader />
                  </div>
                </div>
                {!inventoryReportList?.docs?.length && !inventoryReportListLoading ? (
                  <div className="w-full min-h-[400px] flex justify-center items-center">
                    <p className="text-xl">No records found</p>
                  </div>
                ) : null}
                {inventoryReportList?.docs?.length ? (
                  <Table
                    COLUMNS={inventoryColumn}
                    data={inventoryReportList?.docs || []}
                    handleSorting={handleSortByColumn}
                    activePage={inventoryReportList?.page || 1}
                    totalPages={inventoryReportList?.totalPages || 1}
                    setActivePage={currentPage => handlePagination('page', currentPage)}
                  />
                ) : null}
              </Tabs.Panel>
              <Tabs.Panel value="messages" pt="lg">
                {!inventoryStats?.best?.length && !isInventoryStatsLoading ? (
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
                {!inventoryStats?.worst?.length && !isInventoryStatsLoading ? (
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

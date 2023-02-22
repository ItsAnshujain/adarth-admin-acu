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
import { Badge, Box, Image, Loader, Tabs, Text } from '@mantine/core';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import DomToPdf from 'dom-to-pdf';
import Header from '../../components/Reports/Header';
import Table from '../../components/Table/Table';
import RowsPerPage from '../../components/RowsPerPage';
import Search from '../../components/Search';
import BestIcon from '../../assets/best-performing-inventory.svg';
import WorstIcon from '../../assets/worst-performing-inventory.svg';
import toIndianCurrency from '../../utils/currencyFormat';
import SpacesMenuPopover from '../../components/Popovers/SpacesMenuPopover';
import { useInventoryReport, useInventoryStats } from '../../hooks/inventory.hooks';
import ViewByFilter from '../../components/Reports/ViewByFilter';
import InventoryStatsContent from '../../components/Reports/Inventory/InventoryStatsContent';
import SubHeader from '../../components/Reports/Inventory/SubHeader';
import { monthsInShort } from '../../utils';

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
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const chartRef = useRef(null);
  const [search, setSearch] = useState('');
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

  const COLUMNS = [
    {
      Header: '#',
      accessor: 'id',
    },
    {
      Header: 'SPACE NAME & PHOTO',
      accessor: 'space_name_and_photo',
      Cell: ({
        row: {
          original: { status, photo, space_name, isUnderMaintenance, id },
        },
      }) =>
        useMemo(
          () => (
            <Box
              onClick={() => navigate(`view-details/${id}`)}
              className="grid grid-cols-2 gap-2 items-center cursor-pointer"
            >
              <div className="flex flex-1 gap-2 items-center w-44">
                <div className="bg-white h-8 w-8 border rounded-md">
                  <img className="h-8 w-8 mx-auto" src={photo} alt="banner" />
                </div>
                <p>{space_name}</p>
              </div>
              <div className="w-fit">
                <Badge
                  radius="xl"
                  text={status}
                  color={isUnderMaintenance ? 'yellow' : 'green'}
                  variant="filled"
                  size="sm"
                >
                  {isUnderMaintenance ? 'Under Maintenance' : 'Available'}
                </Badge>
              </div>
            </Box>
          ),
          [],
        ),
    },
    {
      Header: 'MEDIA OWNER NAME',
      accessor: 'landlord_name',
      Cell: ({
        row: {
          original: { landlord_name },
        },
      }) => useMemo(() => <p className="w-fit">{landlord_name}</p>, []),
    },
    {
      Header: 'SPACE TYPE',
      accessor: 'space_type',
    },
    {
      Header: 'TOTAL REVENUE',
      accessor: 'total_revenue',
      Cell: () => useMemo(() => <p className="w-fit mr-2">{toIndianCurrency(0)}</p>, []),
    },
    {
      Header: 'TOTAL BOOKING',
      accessor: 'total_booking',
      Cell: () => useMemo(() => <p className="w-fit">{0}</p>, []),
    },
    {
      Header: 'TOTAL OPERATIONAL COST',
      accessor: 'total_operational_cost',
      Cell: () => useMemo(() => <p className="w-fit mr-2">{toIndianCurrency(0)}</p>, []),
    },
    {
      Header: 'DIMENSION',
      accessor: 'dimension',
    },
    {
      Header: 'IMPRESSION',
      accessor: 'impression',
    },
    {
      Header: 'HEALTH',
      accessor: 'health',
    },
    {
      Header: 'LOCATION',
      accessor: 'location',
    },
    {
      Header: 'PRICING',
      accessor: 'pricing',
    },
    {
      Header: '',
      accessor: 'details',
      disableSortBy: true,
      Cell: ({
        row: {
          original: { _id },
        },
      }) => useMemo(() => <SpacesMenuPopover itemId={_id} />, []),
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
              <p className="font-bold">??</p>
            </div>
            <div className="border rounded p-8 flex-1">
              <Image src={WorstIcon} alt="folder" fit="contain" height={24} width={24} />
              <p className="my-2 text-sm font-light text-slate-400">Worst Performing Inventory</p>
              <p className="font-bold">??</p>
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
                <SubHeader />
                <div className="flex justify-between h-20 items-center pr-7">
                  <RowsPerPage setCount={setCount} count={count} />
                  <Search search={search} setSearch={setSearch} />
                </div>
                <Table COLUMNS={COLUMNS} data={[]} count={count} />
              </Tabs.Panel>
              <Tabs.Panel value="messages" pt="lg">
                <Table COLUMNS={COLUMNS} data={[]} count={count} />
              </Tabs.Panel>
              <Tabs.Panel value="settings" pt="lg">
                <Table COLUMNS={COLUMNS} data={[]} count={count} />
              </Tabs.Panel>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryReport;

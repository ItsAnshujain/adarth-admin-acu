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
import { Badge, Box, Image, Loader } from '@mantine/core';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import Header from './Header';
import AreaHeader from '../Inventory/AreaHeader';
import Table from '../Table/Table';
import RowsPerPage from '../RowsPerPage';
import Search from '../Search';
import GridView from '../GridView';
import Card from '../Inventory/Card';
import InventoryIcon from '../../assets/inventory-active.svg';
import OperationalCostIcon from '../../assets/operational-cost.svg';
import VacantIcon from '../../assets/vacant.svg';
import OccupiedIcon from '../../assets/occupied.svg';
import UnderMaintenanceIcon from '../../assets/under-maintenance.svg';
import BestIcon from '../../assets/best-performing-inventory.svg';
import WorstIcon from '../../assets/worst-performing-inventory.svg';
import { FormProvider, useForm } from '../../context/formContext';
import toIndianCurrency from '../../utils/currencyFormat';
import SpacesMenuPopover from '../Popovers/SpacesMenuPopover';
import { useInventoryReport, useInventoryStats } from '../../hooks/inventory.hooks';
import ViewByFilter from './ViewByFilter';

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

const labels = [
  'Jan',
  'Febr',
  'Mar',
  'Apr',
  'May',
  'June',
  'July',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const config = {
  type: 'line',
  options: { responsive: true },
};

// TODO: integration left for table
const Inventory = () => {
  const form = useForm();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const chartRef = useRef(null);
  const [search, setSearch] = useState('');
  const [count, setCount] = useState('20');
  const [view, setView] = useState('list');
  const [selectAll, setSelectAll] = useState(false);
  const [areaData, setAreaData] = useState({
    id: uuidv4(),
    labels,
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
    if (viewType === 'week') {
      searchParams.set('startDate', dayjs().format(DATE_FORMAT));
      searchParams.set('endDate', dayjs().add(1, viewType).format(DATE_FORMAT));
    }
    if (viewType === 'month') {
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
    if (viewType === 'year') {
      searchParams.set('startDate', dayjs().format(DATE_FORMAT));
      searchParams.set('endDate', dayjs().add(1, viewType).format(DATE_FORMAT));
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

  useEffect(() => {
    const chart = chartRef.current;

    if (!chart) {
      return;
    }

    calculateLineData();
  }, [inventoryReports, isSuccess]);

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto">
      <Header text="Inventory Report" />
      <div className="pr-7 pl-5 mt-5 mb-10">
        <div className="flex justify-between gap-4 flex-wrap mb-8">
          <div className="border rounded p-8  flex-1">
            <Image src={InventoryIcon} alt="folder" fit="contain" height={24} width={24} />
            <p className="my-2 text-sm font-light text-slate-400">Total Inventory</p>
            <p className="font-bold">{inventoryReports?.totalInventories ?? 0}</p>
          </div>
          <div className="border rounded p-8 flex-1">
            <Image src={VacantIcon} alt="folder" fit="contain" height={24} width={24} />
            <p className="my-2 text-sm font-light text-slate-400">Vacant</p>
            <p className="font-bold">{inventoryStats?.vacant ?? 0}</p>
          </div>
          <div className="border rounded p-8  flex-1">
            <Image src={OccupiedIcon} alt="folder" fit="contain" height={24} width={24} />
            <p className="my-2 text-sm font-light text-slate-400">Occupied</p>
            <p className="font-bold">{inventoryStats?.occupied ?? 0}</p>
          </div>
          <div className="border rounded p-8 flex-1">
            <Image src={UnderMaintenanceIcon} alt="folder" fit="contain" height={24} width={24} />
            <p className="my-2 text-sm font-light text-slate-400">Under Maintenance</p>
            <p className="font-bold">{inventoryReports?.underMaintenance ?? 0}</p>
          </div>
          <div className="border rounded p-8 flex-1">
            <Image src={OperationalCostIcon} alt="folder" fit="contain" height={24} width={24} />
            <p className="my-2 text-sm font-light text-slate-400">Total Opertaional Cost</p>
            <p className="font-bold">{inventoryReports?.totalOperationalCost ?? 0}</p>
          </div>
        </div>
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
            <div className="w-[40%] my-auto">
              {isInventoryStatsLoading ? (
                <Loader className="mx-auto" />
              ) : (
                <Doughnut options={config.options} data={inventoryHealthStatus} />
              )}
            </div>
            <div className="flex flex-col">
              <p className="font-medium">Health Status</p>
              <div className="flex flex-col gap-8 mt-6">
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
          <FormProvider form={form}>
            <form>
              <AreaHeader
                selectAll={selectAll}
                setSelectAll={setSelectAll}
                text="List of spaces"
                setView={setView}
              />
              {view !== 'map' && (
                <div className="flex justify-between h-20 items-center pr-7">
                  <RowsPerPage setCount={setCount} count={count} />
                  <Search search={search} setSearch={setSearch} />
                </div>
              )}
              {view === 'grid' ? (
                <GridView selectAll={selectAll} count={count} Card={Card} />
              ) : view === 'list' ? (
                <Table COLUMNS={COLUMNS} data={[]} count={count} />
              ) : null}
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default Inventory;

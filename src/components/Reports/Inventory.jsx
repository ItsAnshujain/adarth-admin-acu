import { useEffect, useState, useRef } from 'react';
import dayjs from 'dayjs';
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
import { Button } from '@mantine/core';
import { ChevronDown } from 'react-feather';
import Header from './Header';
import greenFolder from '../../assets/ongoing.svg';
import blueFolder from '../../assets/completed.svg';
import calendar from '../../assets/data-table.svg';
import DateRange from '../DateRange';
import Filter from '../Filter';
import AreaHeader from '../Inventory/AreaHeader';
import Table from '../Table/Table';
import RowsPerPage from '../RowsPerPage';
import Search from '../Search';
import GridView from '../GridView';
import COLUMNS from '../Inventory/column';
import dummy from '../../Dummydata/Inventory.json';
import Card from '../Inventory/Card';
import useSideBarState from '../../store/sidebar.store';

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

const options = {
  responsive: true,
};

const labels = [];
for (let i = 0; i < 6; i += 1) {
  labels.push(dayjs().subtract(i, 'months').format('MMMM'));
}
labels.reverse();

function createGradient(ctx, area) {
  const colorStart = '#000';
  const colorMid = '#1a1a1a';
  const colorEnd = '#12ff3a';

  const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);

  gradient.addColorStop(0, colorStart);
  gradient.addColorStop(0.5, colorMid);
  gradient.addColorStop(1, colorEnd);

  return gradient;
}

// Doughnut
const data = {
  datasets: [
    {
      data: [3425, 3425],
      backgroundColor: ['#914EFB', '#FF900E'],
      borderColor: ['#914EFB', '#FF900E'],
      borderWidth: 1,
    },
  ],
};
const config = {
  type: 'line',
  data,
  options: { responsive: true },
};

const Inventory = () => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [search, setSearch] = useState('');
  const [count, setCount] = useState(20);
  const [view, setView] = useState('list');
  const [selectAll, setSelectAll] = useState(false);
  const [areaData, setAreaData] = useState({ datasets: [] });
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = chartRef.current;

    if (!chart) {
      return;
    }

    const newLineData = {
      labels,
      datasets: [
        {
          label: 'Revenue',
          data: [10, 0, 23, 23, 31, 23, 5, 21, 22, 12, 3, 4],
          borderColor: '#914EFB',
          // backgroundColor: createGradient(chart.ctx, chart.chartArea),
          cubicInterpolationMode: 'monotone',
          // fill: true,
        },
      ],
    };

    setAreaData(newLineData);
  }, []);

  const openDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const setColor = useSideBarState(state => state.setColor);

  useEffect(() => {
    setColor(6);
  }, []);

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto">
      <Header text="Campaign Report" />
      <div className="pr-7 pl-5 mt-5 mb-10">
        <div className="flex justify-between gap-4 flex-wrap mb-8">
          <div className="border rounded p-8  flex-1">
            <img src={greenFolder} alt="folder" />
            <p className="my-2 text-xs font-light text-slate-400">Total Inventory</p>
            <p className="font-bold">386387</p>
          </div>
          <div className="border rounded p-8 flex-1">
            <img src={greenFolder} alt="folder" />
            <p className="my-2 text-xs font-light text-slate-400">Vacant</p>
            <p className="font-bold">386387</p>
          </div>
          <div className="border rounded p-8  flex-1">
            <img src={blueFolder} alt="folder" />
            <p className="my-2 text-xs font-light text-slate-400">Occupied</p>
            <p className="font-bold">386387</p>
          </div>
          <div className="border rounded p-8 flex-1">
            <img src={greenFolder} alt="folder" />
            <p className="my-2 text-xs font-light text-slate-400">Under Maintenance</p>
            <p className="font-bold">386387</p>
          </div>
          <div aria-hidden className="flex-1 invisible">
            Invisible
          </div>
        </div>
        <div className="flex w-full gap-4">
          <div className="w-[70%]">
            <div className="flex justify-between">
              <p className="font-bold">Revenue Graph</p>
              <div className="flex justify-around">
                <div className="mr-2 relative">
                  <Button onClick={openDatePicker} variant="default" type="button">
                    <img src={calendar} className="h-5" alt="calendar" />
                  </Button>
                  {showDatePicker && (
                    <div className="absolute z-20 -translate-x-2/3 bg-white -top-0.3">
                      <DateRange handleClose={openDatePicker} />
                    </div>
                  )}
                </div>
                <div className="mr-2">
                  <Button
                    onClick={() => setShowFilter(!showFilter)}
                    variant="default"
                    type="button"
                    className="font-medium"
                  >
                    <ChevronDown size={16} className="mt-[1px] mr-1" /> Filter
                  </Button>
                  {showFilter && <Filter isOpened={showFilter} setShowFilter={setShowFilter} />}
                </div>
              </div>
            </div>
            <Line height="120" data={areaData} options={options} ref={chartRef} />
          </div>

          <div className="w-[30%] flex gap-8 h-[50%] p-4 border rounded-md">
            <div className="w-[40%]">
              <Doughnut options={config.options} data={config.data} />
            </div>
            <div className="flex flex-col">
              <p className="font-medium">Printing Status</p>
              <div className="flex flex-col gap-8 mt-6">
                <div className="flex gap-2 items-center">
                  <div className="h-2 w-1 p-2 bg-orange-350 rounded-full" />
                  <div>
                    <p className="my-2 text-xs font-light text-slate-400">Ongoing</p>
                    <p className="font-bold text-lg">1233</p>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="h-2 w-1 p-2 rounded-full bg-purple-350" />
                  <div>
                    <p className="my-2 text-xs font-light text-slate-400">Completed</p>
                    <p className="font-bold text-lg">1233</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)]  border-gray-450 overflow-x-scroll mt-10">
          <AreaHeader
            selectAll={selectAll}
            setSelectAll={setSelectAll}
            text="List of spaces"
            setView={setView}
          />
          <div className="flex justify-between h-20 items-center pr-7">
            <RowsPerPage setCount={setCount} />
            <Search search={search} setSearch={setSearch} />
          </div>
          {view === 'grid' ? (
            <GridView selectAll={selectAll} count={count} Card={Card} />
          ) : view === 'list' ? (
            <Table COLUMNS={COLUMNS} dummy={dummy} count={count} allowRowsSelect />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Inventory;

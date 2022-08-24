import { Button } from '@mantine/core';
import * as dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { ChevronDown } from 'react-feather';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import useSideBarState from '../../store/sidebar.store';
import greenFolder from '../../assets/ongoing.svg';
import blueFolder from '../../assets/completed.svg';
import orangeFolder from '../../assets/upcoming.svg';
import Header from './Header';
import calendar from '../../assets/data-table.svg';
import DateRange from '../DateRange';
import Filter from '../Filter';

ChartJS.register(ArcElement, Tooltip, CategoryScale, LinearScale, BarElement, Title);
const options = {
  responsive: true,
};

const labels = [];
for (let i = 0; i < 6; i += 1) {
  labels.push(dayjs().subtract(i, 'months').format('MMMM'));
}

labels.reverse();

const barData = {
  labels,
  datasets: [
    {
      label: 'Ongoing',
      data: [10, 200, 300, 840, 90, 90],
      backgroundColor: '#FF900E',
    },
    {
      label: 'Completed',
      data: [150, 200, 300, 400, 50, 60],
      backgroundColor: '#914EFB',
    },
    {
      label: 'Upcoming',
      data: [220, 300, 30, 100, 550, 60],
      backgroundColor: '#28B446',
    },
  ],
};

// Doughnut data
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

const Campaign = () => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

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
          <div className="border rounded p-8 flex-1">
            <img src={orangeFolder} alt="folder" />
            <p className="my-2 text-xs font-light text-slate-400">Total Campaign(Overall)</p>
            <p className="font-bold">386387</p>
          </div>
          <div className="border rounded p-8  flex-1">
            <img src={blueFolder} alt="folder" />
            <p className="my-2 text-xs font-light text-slate-400">Total Ongoing Campaign</p>
            <p className="font-bold">386387</p>
          </div>
          <div className="border rounded p-8  flex-1">
            <img src={greenFolder} alt="folder" />
            <p className="my-2 text-xs font-light text-slate-400">Upcoming Campaign</p>
            <p className="font-bold">386387</p>
          </div>
          <div className="border rounded p-8 flex-1">
            <img src={greenFolder} alt="folder" />
            <p className="my-2 text-xs font-light text-slate-400">Completed Campaign</p>
            <p className="font-bold">386387</p>
          </div>
          <div className="border rounded p-8 flex-1">
            <img src={greenFolder} alt="folder" />
            <p className="my-2 text-xs font-light text-slate-400">Total Impression Count</p>
            <p className="font-bold">386387</p>
          </div>
        </div>
        <div className="flex gap-4 h-full">
          <div className="w-2/3">
            <div className="flex justify-between">
              <p>Campaign Report</p>
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
            <div>
              <Bar options={options} data={barData} />
            </div>
          </div>
          <div className="flex flex-col w-1/3 gap-4 ">
            <div className="flex gap-4 p-4 border rounded-md items-center flex-1">
              <div className="w-32">
                <Doughnut options={config.options} data={config.data} />
              </div>
              <div>
                <p className="font-medium">Printing Status</p>
                <div className="flex gap-8 mt-6">
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
            <div className="flex gap-4 p-4 border rounded-md items-center flex-1">
              <div className="w-32">
                <Doughnut options={config.options} data={config.data} />
              </div>
              <div>
                <p className="font-medium">Mounting Status</p>
                <div className="flex gap-8 mt-6">
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
        </div>
      </div>
    </div>
  );
};

export default Campaign;

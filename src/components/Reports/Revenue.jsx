import { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  BarElement,
  Tooltip,
} from 'chart.js';
import { Button } from '@mantine/core';
import { ChevronDown } from 'react-feather';
import Header from './Header';
import orangeFolder from '../../assets/upcoming.svg';
import greenFolder from '../../assets/ongoing.svg';
import blueFolder from '../../assets/completed.svg';
import toIndianCurrency from '../../utils/currencyFormat';
import calendar from '../../assets/data-table.svg';
import DateRange from '../DateRange';
import Filter from '../Filter';
import useSideBarState from '../../store/sidebar.store';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Title);

const barDataIndustry = {
  labels: [
    'Fashion',
    'Pub',
    'Design',
    'React',
    'HTML',
    'CSS',
    'JavaScript',
    'Garments',
    'Bike',
    'Car',
    'Apparell',
  ],
  datasets: [
    {
      data: [10, 200, 300, 200, 300, 40, 90, 90, 40, 90, 90],
      backgroundColor: '#914EFB',
    },
  ],
};

const barDataState = {
  labels: [
    'Kolkata',
    'Delhi',
    'Mumbai',
    'Chennai',
    'Hyderabad',
    'Chennai',
    'Bhopal',
    'Lucknow',
    'Asansol',
    'Manali',
    'Goa',
  ],
  datasets: [
    {
      data: [10, 20, 30, 70, 50, 40, 90, 90, 40, 90, 90],
      backgroundColor: '#914EFB',
    },
  ],
};

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

const data = {
  labels,
  datasets: [
    {
      label: 'Revenue',
      data: [10, 0, 23, 23, 31, 23, 5, 21, 22, 12, 3, 4],
      borderColor: '#914EFB',
      backgroundColor: '#914EFB',
    },
  ],
};

const Revenue = () => {
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
      <Header text="Revenue Report" />
      <div className="flex flex-col pr-7 pl-5 mt-5 mb-10">
        <div className="flex flex-1 justify-between gap-4 flex-wrap mb-8">
          <div className="border rounded p-8 flex-1">
            <img src={orangeFolder} alt="folder" />
            <p className="my-2 text-xs font-light text-slate-400">Total Revenue</p>
            <p className="font-bold">{toIndianCurrency(386387)}</p>
          </div>
          <div className="border rounded p-8  flex-1">
            <img src={greenFolder} alt="folder" />
            <p className="my-2 text-xs font-light text-slate-400">Offline Revenue</p>
            <p className="font-bold">{toIndianCurrency(386)}</p>
          </div>
          <div className="border rounded p-8 flex-1">
            <img src={greenFolder} alt="folder" />
            <p className="my-2 text-xs font-light text-slate-400">Online Revenue</p>
            <p className="font-bold">{toIndianCurrency(386)}</p>
          </div>
          <div className="border rounded p-8 flex-1">
            <img src={blueFolder} alt="folder" />
            <p className="my-2 text-xs font-light text-slate-400">Total Proposals Sent</p>
            <p className="font-bold">386387</p>
          </div>
          <div aria-hidden className="flex-1 invisible">
            Visibility Hidden
          </div>
        </div>
        <div>
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
          <Line height="80" data={data} options={options} />
          <div className="my-10">
            <div className="flex justify-between">
              <p className="font-bold">Industry wise revenue graph</p>
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
            <Bar height="80" data={barDataIndustry} options={options} />
          </div>
          <div className="my-10">
            <div className="flex justify-between">
              <p className="font-bold">Industry wise revenue graph</p>
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
            <Bar height="80" data={barDataState} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Revenue;

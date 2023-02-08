import { useState } from 'react';
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
import { Button, Image } from '@mantine/core';
import { ChevronDown } from 'react-feather';
import { useClickOutside } from '@mantine/hooks';
import Header from './Header';
import toIndianCurrency from '../../utils/currencyFormat';
import calendar from '../../assets/data-table.svg';
import DateRange from '../DateRange';
import FilterRevenue from './FilterRevenue';
import TotalRevenueIcon from '../../assets/total-revenue.svg';
import OfflineRevenueIcon from '../../assets/offline-revenue.svg';
import OnlineRevenueIcon from '../../assets/online-revenue.svg';
import ProposalSentIcon from '../../assets/proposal-sent.svg';
import OperationalCostIcon from '../../assets/operational-cost.svg';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Title);

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
      cubicInterpolationMode: 'monotone',
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

const lineData = {
  labels,
  datasets: [
    {
      label: 'Revenue',
      data: [10, 0, 23, 23, 31, 23, 5, 21, 22, 12, 3, 4],
      borderColor: '#914EFB',
      backgroundColor: '#914EFB',
      cubicInterpolationMode: 'monotone',
    },
  ],
};

// TODO: integration left
const Revenue = () => {
  const [showDatePickerRevenue, setShowDatePickerRevenue] = useState(false);
  const [showDateCity, setShowDateCity] = useState(false);
  const [showDateIndustry, setShowDateIndustry] = useState(false);
  const revenueRef = useClickOutside(() => setShowDatePickerRevenue(false));
  const dateCityRef = useClickOutside(() => setShowDateCity(false));
  const dateIndustryRef = useClickOutside(() => setShowDateCity(false));
  const [showFilter, setShowFilter] = useState(false);
  const toggleFilter = () => setShowFilter(!showFilter);

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto">
      <Header text="Revenue Report" />
      <div className="mr-7 pl-5 mt-5 mb-10">
        <div className="flex flex-1 justify-between gap-4 flex-wrap mb-8 ">
          <div className="border rounded p-8 flex-1">
            <Image src={TotalRevenueIcon} alt="folder" fit="contain" height={24} width={24} />
            <p className="my-2 text-sm font-light text-slate-400">Total Revenue</p>
            <p className="font-bold">{toIndianCurrency(0)}</p>
          </div>
          <div className="border rounded p-8  flex-1">
            <Image src={OfflineRevenueIcon} alt="folder" fit="contain" height={24} width={24} />
            <p className="my-2 text-sm font-light text-slate-400">Offline Revenue</p>
            <p className="font-bold">{toIndianCurrency(0)}</p>
          </div>
          <div className="border rounded p-8 flex-1">
            <Image src={OnlineRevenueIcon} alt="folder" fit="contain" height={24} width={24} />
            <p className="my-2 text-sm font-light text-slate-400">Online Revenue</p>
            <p className="font-bold">{toIndianCurrency(0)}</p>
          </div>
          <div className="border rounded p-8 flex-1">
            <Image src={ProposalSentIcon} alt="folder" fit="contain" height={24} width={24} />
            <p className="my-2 text-sm font-light text-slate-400">Total Proposals Sent</p>
            <p className="font-bold">0</p>
          </div>
          <div className="border rounded p-8 flex-1">
            <Image src={OperationalCostIcon} alt="folder" fit="contain" height={24} width={24} />
            <p className="my-2 text-sm font-light text-slate-400">Total Operational Cost</p>
            <p className="font-bold">0</p>
          </div>
        </div>
        <div>
          <div className="flex justify-between">
            <p className="font-bold">Revenue Graph</p>
            <div className="flex justify-around">
              <div ref={revenueRef} className="mr-2 relative">
                <Button
                  onClick={() => setShowDatePickerRevenue(!showDatePickerRevenue)}
                  variant="default"
                >
                  <img src={calendar} className="h-5" alt="calendar" />
                </Button>
                {showDatePickerRevenue && (
                  <div className="absolute z-20 -translate-x-[90%] bg-white -top-0.3">
                    <DateRange handleClose={() => setShowDatePickerRevenue(false)} />
                  </div>
                )}
              </div>
            </div>
          </div>
          <Line height="80" data={lineData} options={options} />
          <div className="my-10">
            <div className="flex justify-between">
              <p className="font-bold">Industry wise revenue graph</p>
              <div className="flex justify-around">
                <div ref={dateIndustryRef} className="mr-2 relative">
                  <Button onClick={() => setShowDateIndustry(!showDateIndustry)} variant="default">
                    <img src={calendar} className="h-5" alt="calendar" />
                  </Button>
                  {showDateIndustry && (
                    <div className="absolute z-20 -translate-x-3/4 bg-white -top-0.3">
                      <DateRange handleClose={() => setShowDateIndustry(false)} />
                    </div>
                  )}
                </div>
                <div className="mr-2">
                  <Button
                    onClick={() => setShowFilter(!showFilter)}
                    variant="default"
                    className="font-medium"
                  >
                    <ChevronDown size={16} className="mt-[1px] mr-1" /> Filter
                  </Button>
                  {showFilter && (
                    <FilterRevenue isOpened={showFilter} setShowFilter={setShowFilter} />
                  )}
                </div>
              </div>
            </div>
            <Bar height="80" data={barDataState} options={options} />
          </div>
          <div className="my-10">
            <div className="flex justify-between">
              <p className="font-bold">City Or State</p>
              <div className="flex justify-around">
                <div ref={dateCityRef} className="mr-2 relative">
                  <Button onClick={() => setShowDateCity(!showDateCity)} variant="default">
                    <img src={calendar} className="h-5" alt="calendar" />
                  </Button>
                  {showDateCity && (
                    <div className="absolute z-20 -translate-x-3/4 bg-white -top-0.3">
                      <DateRange handleClose={() => setShowDateCity(false)} />
                    </div>
                  )}
                </div>

                <div className="mx-2">
                  <Button onClick={toggleFilter} variant="default" className="font-medium">
                    <ChevronDown size={16} className="mt-[1px] mr-1" /> Filter
                  </Button>
                  {showFilter && (
                    <FilterRevenue isOpened={showFilter} setShowFilter={setShowFilter} />
                  )}
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

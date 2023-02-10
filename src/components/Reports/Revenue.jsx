import { useState } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
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
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import dayjs from 'dayjs';
import { useSearchParams } from 'react-router-dom';
import Header from './Header';
import toIndianCurrency from '../../utils/currencyFormat';
import RevenueFilter from './RevenueFilter';
import TotalRevenueIcon from '../../assets/total-revenue.svg';
import OfflineRevenueIcon from '../../assets/offline-revenue.svg';
import OnlineRevenueIcon from '../../assets/online-revenue.svg';
import ProposalSentIcon from '../../assets/proposal-sent.svg';
import OperationalCostIcon from '../../assets/operational-cost.svg';
import ViewByFilter from './ViewByFilter';

dayjs.extend(quarterOfYear);

const DATE_FORMAT = 'YYYY-MM-DD';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Title,
);

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

export const pieData = {
  labels: [],
  datasets: [
    {
      label: '',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

// TODO: integration left
const Revenue = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilter, setShowFilter] = useState(false);
  const toggleFilter = () => setShowFilter(!showFilter);

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

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto">
      <Header text="Revenue Report" />
      <div className="mr-7 pl-5 mt-5 mb-10">
        <div className="flex flex-1 justify-between gap-4 flex-wrap mb-8">
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
        <div className="flex gap-8">
          <div className="w-[70%] flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <p className="font-bold">Revenue Graph</p>
              <ViewByFilter handleViewBy={handleViewBy} />
            </div>
            <div className="flex flex-col pl-7 relative">
              <p className="transform rotate-[-90deg] absolute left-[-25px] top-[40%]">
                In Lakhs &gt;
              </p>
              <Line height="100" data={lineData} options={options} />
              <p className="text-center">Months &gt;</p>
            </div>
          </div>
          <div className="w-[30%] flex flex-col">
            <div className="flex justify-between items-center">
              <p className="font-bold">Industry wise revenue graph</p>
              <ViewByFilter handleViewBy={handleViewBy} />
            </div>
            <div className="w-80 m-auto">
              <Pie data={pieData} options={options} />
            </div>
          </div>
        </div>

        <div className="my-10">
          <div className="flex justify-between items-center">
            <p className="font-bold">City Or State</p>
            <div className="flex justify-around">
              <div className="mx-2">
                <Button onClick={toggleFilter} variant="default" className="font-medium">
                  <ChevronDown size={16} className="mt-[1px] mr-1" /> Filter
                </Button>
                {showFilter && (
                  <RevenueFilter isOpened={showFilter} setShowFilter={setShowFilter} />
                )}
              </div>
              <ViewByFilter handleViewBy={handleViewBy} />
            </div>
          </div>
          <div className="flex flex-col pl-7 relative">
            <p className="transform rotate-[-90deg] absolute left-[-15px] top-[40%]">Total &gt;</p>
            <Bar height="80" data={barDataState} options={options} />
            <p className="text-center">City or State &gt;</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Revenue;

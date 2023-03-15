import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Title,
  BarElement,
  Tooltip,
} from 'chart.js';
import { Image, Loader } from '@mantine/core';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import { v4 as uuidv4 } from 'uuid';
import AreaHeader from '../components/Home/Header';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import OngoingCampaignIcon from '../assets/ongoing-campaign.svg';
import UpcomingCampaignIcon from '../assets/upcoming-campaign.svg';
import CompletedCampaignIcon from '../assets/completed-campaign.svg';
import VacantIcon from '../assets/vacant.svg';
import OccupiedIcon from '../assets/occupied.svg';
import TotalCampaignIcon from '../assets/total-campaign.svg';
import useUserStore from '../store/user.store';
import { useBookingStats, useFetchBookingRevenue } from '../hooks/booking.hooks';
import { useInventoryStats } from '../hooks/inventory.hooks';
import { dateByQuarter, daysInAWeek, monthsInShort, serialize } from '../utils';
import ViewByFilter from '../components/Reports/ViewByFilter';

dayjs.extend(quarterOfYear);

const DATE_FORMAT = 'YYYY-MM-DD';

const timeLegend = {
  dayOfWeek: 'Days',
  month: 'Days',
  quarter: 'Months',
  year: 'Months',
};

ChartJS.register(
  CategoryScale,
  ArcElement,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Legend,
  Tooltip,
  Title,
);

const options = {
  responsive: true,
};

// Doughnut
const config = {
  type: 'line',
  options: { responsive: true },
};

const HomePage = () => {
  const queryClient = useQueryClient();
  const userId = useUserStore(state => state.id);
  const user = queryClient.getQueryData(['users-by-id', userId]);

  const [queryByTime, setQueryByTime] = useState({
    'groupBy': 'month',
    'startDate': dayjs().startOf('year').format(DATE_FORMAT),
    'endDate': dayjs().endOf('year').format(DATE_FORMAT),
  });

  const [updatedLineData, setUpdatedLineData] = useState({
    id: uuidv4(),
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
  });

  const { data: bookingStats } = useBookingStats('');
  const { data: inventoryStats, isLoading: isInventoryStatsLoading } = useInventoryStats('');
  const { data: bookingRevenue, isLoading: isBookingRevenueLoading } = useFetchBookingRevenue(
    serialize(queryByTime),
  );
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

  useEffect(() => {
    if (bookingRevenue) {
      const tempData = {
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
      tempData.labels =
        queryByTime.groupBy === 'dayOfWeek'
          ? daysInAWeek
          : queryByTime.groupBy === 'month'
          ? Array.from({ length: dayjs().daysInMonth() }, (_, index) => index + 1)
          : monthsInShort;

      tempData.datasets[0].data = Array.from({ length: dayjs().daysInMonth() }, () => 0);

      bookingRevenue?.forEach(item => {
        if (item._id) {
          tempData.datasets[0].data[item._id - 1] = item.price / 100000 || 0;
        }
      });

      setUpdatedLineData(tempData);
    }
  }, [bookingRevenue]);

  return (
    <div className="absolute top-0">
      <Header title="" />
      <div className="grid grid-cols-12">
        <Sidebar />
        <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto">
          <AreaHeader text={`Hello, ${user?.name || 'User'}`} />
          <div className="pr-7 pl-5 mt-5 mb-10">
            <div className="grid grid-rows-2 mb-8 gap-y-4">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <div className="border rounded p-8 flex-1">
                  <Image
                    src={TotalCampaignIcon}
                    alt="folder"
                    height={24}
                    width={24}
                    fit="contain"
                  />
                  <p className="my-2 font-light text-slate-400">Total Bookings(Overall)</p>
                  <p className="font-bold">{bookingStats?.totalCampaigns || 0}</p>
                </div>
                <div className="border rounded p-8  flex-1">
                  <Image
                    src={OngoingCampaignIcon}
                    alt="folder"
                    height={24}
                    width={24}
                    fit="contain"
                  />
                  <p className="my-2 font-light text-slate-400">Total Ongoing Bookings</p>
                  <p className="font-bold">{bookingStats?.Ongoing || 0}</p>
                </div>
                <div className="border rounded p-8  flex-1">
                  <Image
                    src={UpcomingCampaignIcon}
                    alt="folder"
                    height={24}
                    width={24}
                    fit="contain"
                  />
                  <p className="my-2 font-light text-slate-400">Upcoming Bookings</p>
                  <p className="font-bold">{bookingStats?.Upcoming || 0}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <div className="border rounded p-8 flex-1">
                  <Image
                    src={CompletedCampaignIcon}
                    alt="folder"
                    height={24}
                    width={24}
                    fit="contain"
                  />
                  <p className="my-2 font-light text-slate-400">Completed Bookings</p>
                  <p className="font-bold">{bookingStats?.Completed || 0}</p>
                </div>
                <div className="border rounded p-8 flex-1">
                  <Image src={VacantIcon} alt="folder" height={24} width={24} fit="contain" />
                  <p className="my-2 font-light text-slate-400">Vacant Inventory</p>
                  <p className="font-bold">{inventoryStats?.vacant || 0}</p>
                </div>
                <div className="border rounded p-8  flex-1">
                  <Image src={OccupiedIcon} alt="folder" height={24} width={24} fit="contain" />
                  <p className="my-2 font-light text-slate-400">Occupied Inventory</p>
                  <p className="font-bold">{inventoryStats?.occupied || 0}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start gap-4 md:flex-row">
              <div className="w-full md:w-[68%]">
                <div className="flex justify-between items-center">
                  <p className="font-bold">Revenue Graph</p>
                  <ViewByFilter handleViewBy={handleViewBy} />
                </div>
                {isBookingRevenueLoading ? (
                  <Loader className="mx-auto" mt={80} />
                ) : (
                  <div className="flex flex-col pl-7 relative">
                    <p className="transform rotate-[-90deg] absolute left-[-28px] top-[40%]">
                      In Lakhs &gt;
                    </p>
                    <Line height="100" data={updatedLineData} options={options} key={uuidv4()} />
                    <p className="text-center">{timeLegend[queryByTime.groupBy]} &gt;</p>
                  </div>
                )}
              </div>
              <div className="flex gap-4 p-4 border rounded-md items-center justify-center flex-1">
                <div className="w-32">
                  {isInventoryStatsLoading ? (
                    <Loader className="mx-auto" />
                  ) : inventoryStats?.healthy === 0 && inventoryStats?.unHealthy === 0 ? (
                    <p className="text-center">NA</p>
                  ) : (
                    <Doughnut options={config.options} data={inventoryHealthStatus} />
                  )}
                </div>
                <div>
                  <p className="font-medium text-center">Health Status of Inventory</p>
                  <div className="flex gap-8 mt-6 flex-row">
                    <div className="flex gap-2 items-center">
                      <div className="h-2 w-1 p-2 bg-orange-350 rounded-full" />
                      <div>
                        <p className="my-2 text-xs font-light text-slate-400">Healthy</p>
                        <p className="font-bold text-lg">{inventoryStats?.healthy || 0}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className="h-2 w-1 p-2 rounded-full bg-purple-350" />
                      <div>
                        <p className="my-2 text-xs font-light text-slate-400">Unhealthy</p>
                        <p className="font-bold text-lg">{inventoryStats?.unHealthy || 0}</p>
                      </div>
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

export default HomePage;

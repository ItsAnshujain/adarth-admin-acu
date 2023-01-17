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
import { Image } from '@mantine/core';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
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
import { serialize } from '../utils';

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

// Doughnut
const config = {
  type: 'line',
  options: { responsive: true },
};

const query = {
  startDate: new Date('01-01-2023').toISOString(),
  endDate: new Date('12-31-2023').toISOString(),
  type: 'month',
};

const HomePage = () => {
  const queryClient = useQueryClient();
  const userId = useUserStore(state => state.id);
  const user = queryClient.getQueryData(['users-by-id', userId]);
  const { data: bookingStats } = useBookingStats('');
  const { data: inventoryStats } = useInventoryStats('');
  const { data: bookingRevenue } = useFetchBookingRevenue(serialize(query));
  const inventoryHealthStatus = useMemo(
    () => ({
      datasets: [
        {
          data: [inventoryStats?.healthy, inventoryStats?.unHealthy],
          backgroundColor: ['#FF900E', '#914EFB'],
          borderColor: ['#FF900E', '#914EFB'],
          borderWidth: 1,
        },
      ],
    }),
    [inventoryStats],
  );

  const getRevenueValues = useMemo(
    () => bookingRevenue?.map(item => (item?.price ? item.price / 100000 : 0)),
    [bookingRevenue],
  );

  const lineData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: 'Revenue',
          data: getRevenueValues,
          borderColor: '#914EFB',
          backgroundColor: '#914EFB',
          cubicInterpolationMode: 'monotone',
        },
      ],
    }),
    [getRevenueValues],
  );

  return (
    <div className="absolute top-0">
      <Header title="" />
      <div className="grid grid-cols-12">
        <Sidebar />
        <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto">
          <AreaHeader text={`Hello, ${user?.name || 'User'}`} />
          <div className="pr-7 pl-5 mt-5 mb-10">
            <div className="grid grid-rows-2 mb-8 gap-y-4">
              <div className="grid grid-cols-3 gap-8">
                <div className="border rounded p-8 flex-1">
                  <Image
                    src={TotalCampaignIcon}
                    alt="folder"
                    height={24}
                    width={24}
                    fit="contain"
                  />
                  <p className="my-2 text-sm font-light text-slate-400">Total Campaign(Overall)</p>
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
                  <p className="my-2 text-sm font-light text-slate-400">Total Ongoing Campaign</p>
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
                  <p className="my-2 text-sm font-light text-slate-400">Upcoming Campaign</p>
                  <p className="font-bold">{bookingStats?.Upcoming || 0}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-8">
                <div className="border rounded p-8 flex-1">
                  <Image
                    src={CompletedCampaignIcon}
                    alt="folder"
                    height={24}
                    width={24}
                    fit="contain"
                  />
                  <p className="my-2 text-sm font-light text-slate-400">Completed Campaign</p>
                  <p className="font-bold">{bookingStats?.Completed || 0}</p>
                </div>
                <div className="border rounded p-8 flex-1">
                  <Image src={VacantIcon} alt="folder" height={24} width={24} fit="contain" />
                  <p className="my-2 text-sm font-light text-slate-400">Vacant Inventory</p>
                  <p className="font-bold">{inventoryStats?.vacant || 0}</p>
                </div>
                <div className="border rounded p-8  flex-1">
                  <Image src={OccupiedIcon} alt="folder" height={24} width={24} fit="contain" />
                  <p className="my-2 text-xs font-light text-slate-400">Occupied Inventory</p>
                  <p className="font-bold">{inventoryStats?.occupied || 0}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-[68%]">
                <p className="font-bold mb-5">Revenue Graph</p>
                <div className="flex flex-col pl-7 relative">
                  <p className="font-sans transform rotate-[-90deg] absolute left-[-28px] top-[40%]">
                    In Lakhs {'-->'}{' '}
                  </p>
                  <Line height="80" data={lineData} options={options} />
                  <p className="font-sans text-center">Months {'-->'} </p>
                </div>
              </div>
              <div className="flex gap-4 p-4 border rounded-md items-center justify-center flex-1 flex-wrap-reverse">
                <div className="w-32">
                  <Doughnut options={config.options} data={inventoryHealthStatus} />
                </div>
                <div>
                  <p className="font-medium text-center">Health Status of Inventory</p>
                  <div className="flex gap-8 mt-6 flex-wrap">
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

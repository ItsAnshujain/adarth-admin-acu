import { Line, Doughnut, Pie } from 'react-chartjs-2';
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
import { Loader, Box, Group, Image } from '@mantine/core';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import { v4 as uuidv4 } from 'uuid';
import AreaHeader from '../components/modules/home/Header';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import OngoingBookingIcon from '../assets/ongoing-booking.svg';
import UpcomingBookingIcon from '../assets/upcoming-booking.svg';
import CompleteBookingIcon from '../assets/complete-booking.svg';
import VacantSpaceIcon from '../assets/vacant-space.svg';
import OccupiedSpaceIcon from '../assets/occupied-space.svg';
import useUserStore from '../store/user.store';
import {
  useBookingStats,
  useFetchBookingRevenue,
  useUserSalesByUserId,
} from '../apis/queries/booking.queries';
import { useInventoryStats } from '../apis/queries/inventory.queries';
import {
  daysInAWeek,
  financialEndDate,
  financialStartDate,
  monthsInShort,
  quarters,
  serialize,
  timeLegend,
} from '../utils';
import ViewByFilter from '../components/modules/reports/ViewByFilter';
import { DATE_FORMAT } from '../utils/constants';
import Calendar from '../components/modules/home/Calendar';
import ExceedChevronIcon from '../assets/exceed-chevron.svg';
import toIndianCurrency from '../utils/currencyFormat';
import SalesStatisticsCard from '../components/modules/users/analytics/SalesStatisticsCard';
import OwnSiteIcon from '../assets/own-site-sale.svg';
import TradedSiteIcon from '../assets/traded-site-sale.svg';
import BookingStatisticsCard from '../components/modules/users/analytics/BookingStatisticsCard';

dayjs.extend(quarterOfYear);

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

const options = { responsive: true };

// Doughnut
const config = {
  type: 'line',
  options: { responsive: true },
};

const bookingPieConfig = {
  options: {
    responsive: true,
  },
  styles: {
    backgroundColor: ['rgba(75, 192, 192, 1)', 'rgba(145, 78, 251, 1)', 'rgba(255, 144, 14 , 1)'],
    borderColor: ['rgba(75, 192, 192, 1)', 'rgba(145, 78, 251, 1)', 'rgba(255, 144, 14 , 1)'],
    borderWidth: 1,
  },
};

const inventoryPieConfig = {
  options: {
    responsive: true,
  },
  styles: {
    backgroundColor: ['rgba(145, 78, 251, 1)', 'rgba(255, 144, 14 , 1)'],
    borderColor: ['rgba(145, 78, 251, 1)', 'rgba(255, 144, 14 , 1)'],
    borderWidth: 1,
  },
};

const salesPieConfig = {
  responsive: true,
  cutout: 22,
  plugins: {
    tooltip: {
      enabled: false,
    },
  },
  animation: {
    duration: 0,
  },
};

const HomePage = () => {
  const queryClient = useQueryClient();
  const userId = useUserStore(state => state.id);
  const userCachedData = queryClient.getQueryData(['users-by-id', userId]);

  const [queryByTime, setQueryByTime] = useState({
    groupBy: 'month',
    startDate: financialStartDate,
    endDate: financialEndDate,
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

  const bookingStats = useBookingStats('');
  const inventoryStats = useInventoryStats('');
  const { data: bookingRevenue, isLoading: isBookingRevenueLoading } = useFetchBookingRevenue(
    serialize(queryByTime),
  );
  const userSales = useUserSalesByUserId({
    startDate: financialStartDate,
    endDate: financialEndDate,
    userId,
  });

  const inventoryHealthStatus = useMemo(
    () => ({
      datasets: [
        {
          data: [inventoryStats.data?.unHealthy ?? 0, inventoryStats.data?.healthy ?? 0],
          backgroundColor: ['#FF900E', '#914EFB'],
          borderColor: ['#FF900E', '#914EFB'],
          borderWidth: 1,
        },
      ],
    }),
    [inventoryStats.data],
  );

  const handleViewBy = viewType => {
    if (viewType === 'reset' || viewType === 'year') {
      setQueryByTime({
        groupBy: 'month',
        startDate: financialStartDate,
        endDate: financialEndDate,
      });
    }
    if (viewType === 'week' || viewType === 'month') {
      setQueryByTime(prevState => ({
        ...prevState,
        groupBy: viewType === 'month' ? 'dayOfMonth' : viewType === 'week' ? 'dayOfWeek' : 'month',
        startDate: dayjs().startOf(viewType).format(DATE_FORMAT),
        endDate: dayjs().endOf(viewType).format(DATE_FORMAT),
      }));
    }
    if (viewType === 'quarter') {
      setQueryByTime({
        groupBy: 'quarter',
        startDate: financialStartDate,
        endDate: financialEndDate,
      });
    }
  };

  const [updatedBookingChart, setUpdatedBookingChart] = useState({
    id: uuidv4(),
    labels: [],
    datasets: [
      {
        label: '',
        data: [],
        ...bookingPieConfig.styles,
      },
    ],
  });
  const [updatedInventoryChart, setUpdatedInventoryChart] = useState({
    id: uuidv4(),
    labels: [],
    datasets: [
      {
        label: '',
        data: [],
        ...inventoryPieConfig.styles,
      },
    ],
  });

  const handleUpdatedBookingChart = useCallback(() => {
    const tempBarData = {
      labels: [],
      datasets: [
        {
          label: '',
          data: [],
          ...bookingPieConfig.styles,
        },
      ],
    };
    if (bookingStats.data) {
      tempBarData.datasets[0].data[0] = bookingStats?.data.Completed;
      tempBarData.datasets[0].data[1] = bookingStats?.data.Ongoing;
      tempBarData.datasets[0].data[2] = bookingStats?.data.Upcoming;
      setUpdatedBookingChart(tempBarData);
    }
  }, [bookingStats.data]);

  const handleUpdatedInventoryChart = useCallback(() => {
    const tempBarData = {
      labels: [],
      datasets: [
        {
          label: '',
          data: [],
          ...inventoryPieConfig.styles,
        },
      ],
    };
    if (inventoryStats.data) {
      tempBarData.datasets[0].data[0] = inventoryStats?.data.occupied;
      tempBarData.datasets[0].data[1] = inventoryStats?.data.vacant;
      setUpdatedInventoryChart(tempBarData);
    }
  }, [inventoryStats.data]);

  const revenueBreakupData = useMemo(
    () => ({
      datasets: [
        {
          data: userSales.data?.salesTarget ? [userSales.data.salesTarget ?? 0, 0] : [0, 1],
          backgroundColor: ['#914EFB', '#EEEEEE'],
          borderColor: ['#914EFB', '#EEEEEE'],
          borderWidth: 1,
        },
        {
          data: userSales.data?.sales ? [userSales.data.sales ?? 0, 0] : [0, 1],
          backgroundColor: ['#4BC0C0', '#EEEEEE'],
          borderColor: ['#4BC0C0', '#EEEEEE'],
          borderWidth: 1,
        },
        {
          data: [userSales.data?.totalTradedAmount ?? 0, userSales.data?.ownSiteSales ?? 0],
          backgroundColor: ['#2938F7', '#FF900E'],
          borderColor: ['#2938F7', '#FF900E'],
          borderWidth: 1,
        },
      ],
    }),
    [userSales.data],
  );

  const hasExceededSales = useMemo(
    () => userSales.data?.sales > userSales.data?.salesTarget,
    [userSales.data?.sales, userSales.data?.salesTarget],
  );

  useEffect(() => handleUpdatedBookingChart(), [bookingStats.data]);

  useEffect(() => handleUpdatedInventoryChart(), [inventoryStats.data]);

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
          : queryByTime.groupBy === 'dayOfMonth'
          ? Array.from({ length: dayjs().daysInMonth() }, (_, index) => index + 1)
          : queryByTime.groupBy === 'quarter'
          ? quarters
          : monthsInShort;

      tempData.datasets[0].data = Array.from({ length: dayjs().daysInMonth() }, () => 0);

      bookingRevenue?.forEach(item => {
        if (item._id) {
          if (queryByTime.groupBy === 'dayOfMonth' || queryByTime.groupBy === 'dayOfWeek') {
            tempData.datasets[0].data[item._id - 1] = item.total / 100000 || 0;
          } else if (queryByTime.groupBy === 'quarter') {
            if (dayjs().quarter() === 1) {
              tempData.datasets[0].data[item._id + 3] = item.total / 100000 || 0;
            } else if (dayjs().quarter() === 4) {
              tempData.datasets[0].data[item._id - 3] = item.total / 100000 || 0;
            } else {
              tempData.datasets[0].data[item._id - 1] = item.total / 100000 || 0;
            }
          } else if (item._id < 4) {
            // For financial year. if the month is less than 4 then it will be in the next year
            tempData.datasets[0].data[item._id + 8] = item.total / 100000 || 0;
          } else {
            // For financial year. if the month is greater than 4 then it will be in the same year
            tempData.datasets[0].data[item._id - 4] = item.total / 100000 || 0;
          }
        }
      });

      setUpdatedLineData(tempData);
    }
  }, [bookingRevenue]);

  return (
    <div>
      <Header />
      <div className="grid grid-cols-12 h-[calc(100vh-60px)]">
        <Sidebar />
        <div className="col-span-12 md:col-span-12 lg:col-span-10 border-l border-gray-450 overflow-y-auto px-5">
          <AreaHeader text={`Hello, ${userCachedData?.name || 'User'}`} />

          <Group className="grid grid-cols-2 md:grid-cols-7 my-5">
            <article className="flex-1 col-span-3">
              <section className="min-h-42 rounded-lg border flex flex-col gap-2 p-4 mb-4">
                <p className="text-md font-semibold">Bookings</p>
                <Group>
                  <Box className="w-32">
                    {updatedBookingChart.datasets?.[0].data.every(item => item === 0) ? (
                      <p className="text-center font-bold text-md my-12">NA</p>
                    ) : (
                      <Pie
                        data={updatedBookingChart}
                        options={bookingPieConfig.options}
                        key={updatedBookingChart.id}
                      />
                    )}
                  </Box>
                  <div className="flex-1 flex flex-col gap-y-4">
                    <Group className="grid grid-cols-3 gap-3 h-full">
                      <BookingStatisticsCard
                        icon={OngoingBookingIcon}
                        label="Ongoing"
                        count={bookingStats.data?.Ongoing || 0}
                        textColor="text-purple-350"
                        backgroundColor="bg-purple-50"
                        className="col-span-1"
                      />
                      <BookingStatisticsCard
                        icon={UpcomingBookingIcon}
                        label="Upcoming"
                        count={bookingStats.data?.Upcoming || 0}
                        textColor="text-orange-350"
                        backgroundColor="bg-orange-50"
                        className="col-span-1"
                      />
                      <BookingStatisticsCard
                        icon={CompleteBookingIcon}
                        label="Completed"
                        count={bookingStats.data?.Completed || 0}
                        textColor="text-green-350"
                        backgroundColor="bg-green-50"
                        className="col-span-2"
                      />
                    </Group>
                  </div>
                </Group>
              </section>

              <section className="min-h-42 rounded-lg border flex flex-col gap-2 p-4 mb-4">
                <p className="text-md font-semibold">Inventory</p>
                <Group>
                  <Box className="w-32">
                    {inventoryStats.data?.occupied === 0 && inventoryStats.data?.vacant === 0 ? (
                      <p className="text-center font-bold text-md my-12">NA</p>
                    ) : (
                      <Pie
                        data={updatedInventoryChart}
                        options={inventoryPieConfig.options}
                        key={updatedInventoryChart.id}
                      />
                    )}
                  </Box>
                  <div className="flex-1 flex flex-col gap-y-4">
                    <Group className="grid grid-cols-2 gap-3 h-full">
                      <BookingStatisticsCard
                        icon={OccupiedSpaceIcon}
                        label="Occupied"
                        count={inventoryStats.data?.occupied || 0}
                        textColor="text-purple-350"
                        backgroundColor="bg-purple-50"
                        className="col-span-1"
                      />
                      <BookingStatisticsCard
                        icon={VacantSpaceIcon}
                        label="Vacant"
                        count={inventoryStats.data?.vacant || 0}
                        textColor="text-orange-350"
                        backgroundColor="bg-orange-50"
                        className="col-span-1"
                      />
                    </Group>
                  </div>
                </Group>
              </section>

              <section className="min-h-42 rounded-lg border flex flex-row items-start gap-3 p-4">
                <Box className="w-32 relative">
                  {hasExceededSales ? (
                    <div className="absolute top-7 left-[13px] transform rotate-12">
                      <Image src={ExceedChevronIcon} height={32} width={32} fit="contain" />
                    </div>
                  ) : null}
                  <Doughnut options={salesPieConfig} data={revenueBreakupData} />
                </Box>

                <div className="flex-1 grid grid-cols-2 gap-3">
                  <div>
                    <Group className="flex-col items-start gap-0 mb-5">
                      <p className="text-md font-medium">Sales Target</p>
                      <p className="text-xl font-bold text-purple-350">
                        {toIndianCurrency(userSales.data?.salesTarget || 0)}
                      </p>
                    </Group>
                    <SalesStatisticsCard
                      icon={OwnSiteIcon}
                      label="Own Site"
                      count={userSales.data?.ownSiteSales || 0}
                      textColor="text-orange-350"
                      backgroundColor="bg-orange-50"
                    />
                  </div>
                  <div>
                    <Group className="flex-col items-start gap-0 mb-5">
                      <p className="text-md font-medium">Total Sales</p>
                      <p className="text-xl font-bold text-green-350">
                        {toIndianCurrency(userSales.data?.sales || 0)}
                      </p>
                    </Group>
                    <SalesStatisticsCard
                      icon={TradedSiteIcon}
                      label="Traded Site"
                      count={userSales.data?.totalTradedAmount || 0}
                      textColor="text-blue-350"
                      backgroundColor="bg-blue-50"
                    />
                  </div>
                </div>
              </section>
            </article>

            <article className="bg-white col-span-4 h-full rounded-md">
              <Calendar />
            </article>
          </Group>

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
                {inventoryStats.isLoading ? (
                  <Loader className="mx-auto" />
                ) : inventoryStats.data?.healthy === 0 && inventoryStats.data?.unHealthy === 0 ? (
                  <p className="text-center">NA</p>
                ) : (
                  <Doughnut options={config.options} data={inventoryHealthStatus} />
                )}
              </div>
              <div>
                <p className="font-medium text-center">Health Status of Inventory</p>
                <div className="flex gap-8 mt-6 flex-row">
                  <div className="flex gap-2 items-center">
                    <div className="h-2 w-1 p-2 rounded-full bg-purple-350" />
                    <div>
                      <p className="my-2 text-xs font-light text-slate-400">Healthy</p>
                      <p className="font-bold text-lg">{inventoryStats.data?.healthy || 0}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="h-2 w-1 p-2 bg-orange-350 rounded-full" />
                    <div>
                      <p className="my-2 text-xs font-light text-slate-400">Unhealthy</p>
                      <p className="font-bold text-lg">{inventoryStats.data?.unHealthy || 0}</p>
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

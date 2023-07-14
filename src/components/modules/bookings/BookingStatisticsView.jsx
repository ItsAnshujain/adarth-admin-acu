import { Image, Loader, Text } from '@mantine/core';
import React, { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import OngoingOrdersIcon from '../../../assets/ongoing-orders.svg';
import CompletedOrdersIcon from '../../../assets/completed-orders.svg';
import UpcomingOrdersIcon from '../../../assets/upcoming-orders.svg';

ChartJS.register(ArcElement, Tooltip, Legend);

const BookingStatisticsView = ({ bookingStats, isLoading }) => {
  const revenueBreakupData = useMemo(
    () => ({
      datasets: [
        {
          data: [bookingStats?.offline ?? 0, bookingStats?.online ?? 0],
          backgroundColor: ['#FF900E', '#914EFB'],
          borderColor: ['#FF900E', '#914EFB'],
          borderWidth: 1,
        },
      ],
    }),
    [bookingStats],
  );

  return (
    <div className="mt-5">
      <div className="flex justify-between gap-4 flex-wrap">
        <div className="flex gap-4 p-4 border rounded-md items-center">
          <div className="w-32">
            {isLoading ? (
              <Loader className="mx-auto" />
            ) : bookingStats?.online === 0 && bookingStats?.offline === 0 ? (
              <p className="text-center">NA</p>
            ) : (
              <Doughnut options={{ responsive: true }} data={revenueBreakupData} />
            )}
          </div>
          <div>
            <p className="font-medium">Revenue Breakup</p>
            <div className="flex gap-8 mt-6">
              <div className="flex gap-2 items-center">
                <div className="h-2 w-1 p-2 rounded-full bg-purple-350" />
                <div>
                  <Text size="xs" weight="200">
                    Online Sale
                  </Text>
                  <Text weight="bolder" size="xl">
                    {bookingStats?.online ?? 0}
                  </Text>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <div className="h-2 w-1 p-2 bg-orange-350 rounded-full" />
                <div>
                  <Text size="xs" weight="200">
                    Offline Sale
                  </Text>
                  <Text weight="bolder" size="xl">
                    {bookingStats?.offline ?? 0}
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-4 justify-between flex-wrap">
          <div className="border rounded p-8  pr-20">
            <Image src={OngoingOrdersIcon} alt="ongoing" height={24} width={24} fit="contain" />
            <Text className="my-2" size="sm" weight="200">
              Ongoing Orders
            </Text>
            <Text weight="bold">{bookingStats?.Ongoing ?? 0}</Text>
          </div>
          <div className="border rounded p-8 pr-20">
            <Image src={UpcomingOrdersIcon} alt="upcoming" height={24} width={24} fit="contain" />
            <Text className="my-2" size="sm" weight="200">
              Upcoming Orders
            </Text>
            <Text weight="bold">{bookingStats?.Upcoming ?? 0}</Text>
          </div>
          <div className="border rounded p-8 pr-20">
            <Image src={CompletedOrdersIcon} alt="completed" height={24} width={24} fit="contain" />
            <Text className="my-2" size="sm" weight="200">
              Completed Orders
            </Text>
            <Text weight="bold">{bookingStats?.Completed ?? 0}</Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingStatisticsView;

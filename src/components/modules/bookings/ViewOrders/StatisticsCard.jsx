import { useQueryClient } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';
import { Loader } from '@mantine/core';
import completed from '../../../../assets/completed.svg';

export const data = {
  datasets: [
    {
      data: [3425, 3425],
      backgroundColor: ['#FF900E', '#914EFB'],
      borderColor: ['#FF900E', '#914EFB'],
      borderWidth: 1,
    },
  ],
};

const config = {
  type: 'line',
  data,
  options: { responsive: true },
};

const StatisticsCard = () => {
  const queryClient = useQueryClient();
  const { id: bookingId } = useParams();
  const bookingData = queryClient.getQueryData(['booking-by-id', bookingId]);
  const bookingStats = queryClient.getQueryData(['booking-stats', '']);

  const healthStatusData = useMemo(
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
    <div>
      <p className="pt-5 font-bold text-lg mb-2">Statistics</p>
      <div className="flex flex-wrap gap-x-8">
        <div className="flex gap-x-4 p-4 border rounded-md items-center">
          <div className="w-32">
            {!bookingStats ? (
              <Loader className="mx-auto" />
            ) : bookingStats?.online === 0 && bookingStats?.offline === 0 ? (
              <p className="text-center">NA</p>
            ) : (
              <Doughnut options={config.options} data={healthStatusData} />
            )}
          </div>
          <div>
            <p className="font-medium">Health Status</p>
            <div className="flex gap-8 mt-6">
              <div className="flex gap-2 items-center">
                <div className="h-2 w-1 p-2 rounded-full bg-purple-350" />
                <div>
                  <p className="text-xs font-lighter mb-1">Online Sale</p>
                  <p className="font-bold text-md">{bookingStats?.online ?? 0}</p>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <div className="h-2 w-1 p-2 bg-orange-350 rounded-full" />
                <div>
                  <p className="font-lighter text-xs mb-1">Offline Sale</p>
                  <p className="font-bold text-md">{bookingStats?.offline ?? 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border rounded p-8">
          <img src={completed} alt="ongoing" />
          <p className="my-2 text-xs font-lighter mt-3 text-muted">Total Places</p>
          <p className="font-bold">{bookingData?.campaign?.spaces.length ?? 0}</p>
        </div>
        <div className="flex gap-x-4 p-4 border rounded-md items-center">
          <div className="w-32">
            {!bookingStats ? (
              <Loader className="mx-auto" />
            ) : bookingStats?.online === 0 && bookingStats?.offline === 0 ? (
              <p className="text-center">NA</p>
            ) : (
              <Doughnut options={config.options} data={healthStatusData} />
            )}
          </div>
          <div>
            <p className="font-medium">Outstanding Balance</p>
            <div className="flex gap-8 mt-6">
              <div className="flex gap-2 items-center">
                <div className="h-2 w-1 p-2 rounded-full bg-purple-350" />
                <div>
                  <p className="text-xs font-lighter mb-1">Total Paid</p>
                  <p className="font-bold text-md">{bookingStats?.online ?? 0}</p>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <div className="h-2 w-1 p-2 bg-orange-350 rounded-full" />
                <div>
                  <p className="font-lighter text-xs mb-1">Outstanding</p>
                  <p className="font-bold text-md">{bookingStats?.offline ?? 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsCard;

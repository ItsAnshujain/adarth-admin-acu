import React, { useCallback, useEffect, useState } from 'react';
import { Box, Card, Group, Image } from '@mantine/core';
import { Pie } from 'react-chartjs-2';
import { v4 as uuidv4 } from 'uuid';
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
  Legend,
} from 'chart.js';
import { getWord } from 'num-count';
import classNames from 'classnames';
import OwnSiteIcon from '../../../../assets/own-site-sale.svg';
import TradedSiteIcon from '../../../../assets/traded-site-sale.svg';
import { useBookingRevenueByIndustry } from '../../../../apis/queries/booking.queries';
import { BOOKING_LIST, LEADS_LIST, PROPOSAL_LIST } from '../../../../utils/constants';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Title,
  Legend,
);

const barDataConfigByIndustry = {
  options: {
    responsive: true,
  },
  styles: {
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
};

const ManagingSubHeader = () => {
  const [updatedIndustry, setUpdatedIndustry] = useState({
    id: uuidv4(),
    labels: [],
    datasets: [
      {
        label: '',
        data: [],
        ...barDataConfigByIndustry.styles,
      },
    ],
  });

  const revenueDataByIndustryQuery = useBookingRevenueByIndustry(['groupBy', 'by']);

  const handleUpdatedReveueByIndustry = useCallback(() => {
    const tempBarData = {
      labels: [],
      datasets: [
        {
          label: '',
          data: [],
          ...barDataConfigByIndustry.styles,
        },
      ],
    };
    if (revenueDataByIndustryQuery.data) {
      revenueDataByIndustryQuery.data?.forEach((item, index) => {
        // tempBarData.labels[index] = item?._id;
        tempBarData.datasets[0].data[index] = item?.total;
      });
      setUpdatedIndustry(tempBarData);
    }
  }, [revenueDataByIndustryQuery.data]);

  useEffect(() => {
    handleUpdatedReveueByIndustry();
  }, [revenueDataByIndustryQuery.data]);

  return (
    <div>
      <div className="h-20 border-b flex justify-between items-center px-5">
        <p className="font-bold text-lg">Analytics</p>
      </div>
      <article className="p-4 grid grid-cols-2 gap-4 grid-rows-2">
        <section className="min-h-44 rounded-lg border flex flex-row items-start gap-3 p-4">
          <Box className="w-36">
            <Pie
              data={updatedIndustry}
              options={barDataConfigByIndustry.options}
              key={updatedIndustry.id}
            />
          </Box>

          <div className="flex-1 grid grid-cols-2 gap-3">
            <div>
              <Group className="flex-col items-start gap-0 mb-5">
                <p className="text-md font-medium">Sales Target</p>
                <p className="text-xl font-bold text-purple-350">{`₹${getWord(5000000)}`}</p>
              </Group>

              <Card className="bg-orange-100 rounded-lg flex flex-col p-4">
                <Group className="items-start">
                  <Image src={OwnSiteIcon} height={20} width={20} fit="contain" />
                  <div>
                    <p className="font-medium text-xs mb-2">Own Site</p>
                    <p className="font-semibold text-md text-orange-350">{`₹${getWord(
                      6300000,
                    )}`}</p>
                  </div>
                </Group>
              </Card>
            </div>
            <div>
              <Group className="flex-col items-start gap-0 mb-5">
                <p className="text-md font-medium">Total Sales</p>
                <p className="text-xl font-bold text-green-350">{`₹${getWord(7000000)}`}</p>
              </Group>

              <Card className="bg-blue-100 rounded-lg flex flex-col p-4 gap-y-2">
                <Group className="items-start">
                  <Image src={TradedSiteIcon} height={20} width={20} fit="contain" />
                  <div>
                    <p className="font-medium text-xs mb-2">Traded Site</p>
                    <p className="font-semibold text-md text-blue-350">{`₹${getWord(700000)}`}</p>
                  </div>
                </Group>
              </Card>
            </div>
          </div>
        </section>

        <section className="min-h-44 rounded-lg border flex flex-row items-start gap-3 p-4">
          <Box className="w-36">
            <Pie
              data={updatedIndustry}
              options={barDataConfigByIndustry.options}
              key={updatedIndustry.id}
            />
          </Box>
          <div className="flex-1 flex flex-col gap-y-4">
            <p className="text-md font-medium">Leads</p>
            <Group className="grid grid-cols-4 gap-3 h-full">
              {LEADS_LIST.map(item => (
                <Card
                  className={classNames(
                    item.backgroundColor,
                    'h-full rounded-lg flex flex-col p-0 py-3 pl-3 justify-between',
                  )}
                >
                  <div>
                    <Image src={item.icon} height={20} width={20} fit="contain" />
                    <p className="font-medium text-xs mt-3 mb-1">{item.label}</p>
                  </div>
                  <p className={classNames(item.textColor, 'font-medium text-md')}>{item.count}</p>
                </Card>
              ))}
            </Group>
          </div>
        </section>

        <section className="min-h-44 rounded-lg border flex flex-row items-start gap-3 p-4">
          <Box className="w-36">
            <Pie
              data={updatedIndustry}
              options={barDataConfigByIndustry.options}
              key={updatedIndustry.id}
            />
          </Box>
          <div className="flex-1 flex flex-col gap-y-4">
            <p className="text-md font-medium">Bookings</p>
            <Group className="grid grid-cols-3 gap-3 h-full">
              {BOOKING_LIST.map(item => (
                <Card
                  className={classNames(
                    item.backgroundColor,
                    'h-full rounded-lg flex flex-col p-4 gap-y-2',
                  )}
                >
                  <Image src={item.icon} height={20} width={20} fit="contain" />
                  <span className="font-medium text-xs">{item.label}</span>
                  <p className={classNames(item.textColor, 'font-medium text-md')}>{item.count}</p>
                </Card>
              ))}
            </Group>
          </div>
        </section>

        <section className="h-32 grid grid-cols-3 gap-4">
          {PROPOSAL_LIST.map(item => (
            <Card className="rounded-lg flex flex-col p-0 py-4 pl-4 justify-between border">
              <div>
                <Image src={item.icon} height={20} width={20} fit="contain" />
                <p className="font-medium text-xs mt-3">{item.label}</p>
              </div>
              <p className={classNames(item.textColor, 'font-medium text-md')}>{item.count}</p>
            </Card>
          ))}
        </section>
      </article>
    </div>
  );
};

export default ManagingSubHeader;

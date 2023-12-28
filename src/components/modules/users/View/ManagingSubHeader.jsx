import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Group } from '@mantine/core';
import { Pie, Doughnut } from 'react-chartjs-2';
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
import OwnSiteIcon from '../../../../assets/own-site-sale.svg';
import TradedSiteIcon from '../../../../assets/traded-site-sale.svg';
import {
  useBookingRevenueByIndustry,
  useBookingStatByIncharge,
  useUserSalesByUserId,
} from '../../../../apis/queries/booking.queries';
import { LEADS_LIST } from '../../../../utils/constants';
import { serialize, financialEndDate, financialStartDate } from '../../../../utils';
import SalesStatisticsCard from '../analytics/SalesStatisticsCard';
import BookingStatisticsCard from '../analytics/BookingStatisticsCard';
import LeadsStatisticsCard from '../analytics/LeadsStatisticsCard';
import ProposalStatisticsCard from '../analytics/ProposalStatisticsCard';
import OngoingBookingIcon from '../../../../assets/ongoing-booking.svg';
import UpcomingBookingIcon from '../../../../assets/upcoming-booking.svg';
import CompleteBookingIcon from '../../../../assets/complete-booking.svg';
import ProposalConvertIcon from '../../../../assets/proposal-convert.svg';
import ProposalCreateIcon from '../../../../assets/proposal-create.svg';
import ProposalSendIcon from '../../../../assets/proposal-send.svg';
import OutstandingPoIcon from '../../../../assets/outstanding-po.svg';
import toIndianCurrency from '../../../../utils/currencyFormat';

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

const salesPieConfig = {
  responsive: true,
  cutout: 22,
  plugins: {
    tooltip: {
      enabled: true,
    },
  },
  animation: {
    duration: 0,
  },
};

const leadsPieConfig = {
  options: {
    responsive: true,
    animation: {
      duration: 0,
    },
  },
  styles: {
    backgroundColor: [
      'rgba(75, 192, 192, 1)',
      'rgba(145, 78, 251, 1)',
      'rgba(255, 144, 14 , 1)',
      'rgba(255, 99, 132, 1)',
    ],
    borderColor: [
      'rgba(75, 192, 192, 1)',
      'rgba(145, 78, 251, 1)',
      'rgba(255, 144, 14 , 1)',
      'rgba(255, 99, 132, 1)',
    ],
    borderWidth: 1,
  },
};

const bookingPieConfig = {
  options: {
    responsive: true,
    animation: {
      duration: 0,
    },
  },
  styles: {
    backgroundColor: ['rgba(75, 192, 192, 1)', 'rgba(145, 78, 251, 1)', 'rgba(255, 144, 14 , 1)'],
    borderColor: ['rgba(75, 192, 192, 1)', 'rgba(145, 78, 251, 1)', 'rgba(255, 144, 14 , 1)'],
    borderWidth: 1,
  },
};

const ManagingSubHeader = ({ userId }) => {
  const [updatedIndustry, setUpdatedIndustry] = useState({
    id: uuidv4(),
    labels: [],
    datasets: [
      {
        label: '',
        data: [],
        ...leadsPieConfig.styles,
      },
    ],
  });

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

  const bookingStatsByIncharge = useBookingStatByIncharge(serialize({ inCharge: userId }));
  const userSales = useUserSalesByUserId({
    startDate: financialStartDate,
    endDate: financialEndDate,
    userId,
  });

  const revenueDataByIndustryQuery = useBookingRevenueByIndustry(['groupBy', 'by']);

  const revenueBreakupData = useMemo(
    () => ({
      datasets: [
        {
          data: userSales.data?.salesTarget ? [userSales.data.salesTarget ?? 0, 0] : [0, 0],
          backgroundColor: ['#914EFB', '#EEEEEE'],
          borderColor: ['#914EFB', '#EEEEEE'],
          borderWidth: 1,
        },
        {
          data: userSales.data?.sales ? [userSales.data.sales ?? 0, 0] : [0, 0],
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

  // Uncomment to check exceeded sales
  // const hasExceededSales = useMemo(
  //   () => userSales.data?.sales > userSales.data?.salesTarget,
  //   [userSales.data?.sales, userSales.data?.salesTarget],
  // );

  const handleUpdatedReveueByIndustry = useCallback(() => {
    const tempBarData = {
      labels: [],
      datasets: [
        {
          label: '',
          data: [],
          ...leadsPieConfig.styles,
        },
      ],
    };
    if (revenueDataByIndustryQuery.data) {
      tempBarData.datasets[0].data[0] = 0;
      tempBarData.datasets[0].data[0] = 0;
      tempBarData.datasets[0].data[2] = 0;
      tempBarData.datasets[0].data[3] = 0;
      setUpdatedIndustry(tempBarData);
    }
  }, [revenueDataByIndustryQuery.data]);

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
    if (bookingStatsByIncharge.data) {
      tempBarData.datasets[0].data[0] = bookingStatsByIncharge?.data.Completed;
      tempBarData.datasets[0].data[1] = bookingStatsByIncharge?.data.Ongoing;
      tempBarData.datasets[0].data[2] = bookingStatsByIncharge?.data.Upcoming;
      setUpdatedBookingChart(tempBarData);
    }
  }, [bookingStatsByIncharge.data]);

  useEffect(() => handleUpdatedReveueByIndustry(), [revenueDataByIndustryQuery.data]);

  useEffect(() => handleUpdatedBookingChart(), [bookingStatsByIncharge.data]);

  return (
    <div>
      <div className="h-20 border-b flex justify-between items-center px-5">
        <p className="font-bold text-lg">Analytics</p>
      </div>
      <article className="p-4 grid grid-cols-2 gap-4 grid-rows-2">
        <section className="min-h-44 rounded-lg border flex flex-row items-start gap-3 p-4">
          <Box className="w-36 relative">
            {/* Uncomment for exceeded sales */}
            {/* {hasExceededSales ? (
              <div className="absolute top-7 left-[15px] transform rotate-12">
                <Image src={ExceedChevronIcon} height={38} width={38} fit="contain" />
              </div>
            ) : null} */}
            {userSales.data?.salesTarget <= 0 ? (
              <p className="text-center font-bold text-md my-14">NA</p>
            ) : (
              <Doughnut options={salesPieConfig} data={revenueBreakupData} />
            )}
          </Box>

          <div className="flex-1 flex flex-col">
            <p className="self-end mb-2 text-xs italic">**Current Financial Year</p>
            <div className="grid grid-cols-2 gap-3">
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
          </div>
        </section>

        <section className="min-h-44 rounded-lg border flex flex-row items-start gap-3 p-4">
          <Box className="w-36">
            {updatedIndustry.datasets?.[0].data.every(item => item === 0) ? (
              <p className="text-center font-bold text-md my-14">NA</p>
            ) : (
              <Pie
                data={updatedIndustry}
                options={leadsPieConfig.options}
                key={updatedIndustry.id}
              />
            )}
          </Box>
          <div className="flex-1 flex flex-col gap-y-4">
            <p className="text-md font-medium">Leads</p>
            <Group className="grid grid-cols-4 gap-3 h-full">
              {LEADS_LIST.map(item => (
                <LeadsStatisticsCard key={item.label} {...item} />
              ))}
            </Group>
          </div>
        </section>
        <section className="min-h-44 rounded-lg border flex flex-row items-start gap-3 p-4">
          <Box className="w-36">
            {updatedBookingChart.datasets?.[0].data.every(item => item === 0) ? (
              <p className="text-center font-bold text-md my-14">NA</p>
            ) : (
              <Pie
                data={updatedBookingChart}
                options={bookingPieConfig.options}
                key={updatedBookingChart.id}
              />
            )}
          </Box>
          <div className="flex-1 flex flex-col gap-y-4">
            <p className="text-md font-medium">Bookings</p>
            <Group className="grid grid-cols-3 gap-3 h-full">
              <BookingStatisticsCard
                icon={OngoingBookingIcon}
                label="Ongoing"
                count={bookingStatsByIncharge.data?.Ongoing || 0}
                textColor="text-purple-350"
                backgroundColor="bg-purple-50"
              />
              <BookingStatisticsCard
                icon={UpcomingBookingIcon}
                label="Upcoming"
                count={bookingStatsByIncharge.data?.Upcoming || 0}
                textColor="text-orange-350"
                backgroundColor="bg-orange-50"
              />
              <BookingStatisticsCard
                icon={CompleteBookingIcon}
                label="Completed"
                count={bookingStatsByIncharge.data?.Completed || 0}
                textColor="text-green-350"
                backgroundColor="bg-green-50"
              />
            </Group>
          </div>
        </section>

        <section className="min-h-44 grid grid-cols-2 grid-rows-2 gap-4">
          <ProposalStatisticsCard
            label="Total proposal converted"
            count={userSales.data?.totalProposalConverted || 0}
            textColor="text-green-350"
            icon={ProposalConvertIcon}
          />
          <ProposalStatisticsCard
            label="Total proposal created"
            count={userSales.data?.totalProposal || 0}
            textColor="text-purple-350"
            icon={ProposalCreateIcon}
          />
          <ProposalStatisticsCard
            label="Total proposal sent"
            count={userSales.data?.totalProposalSent || 0}
            textColor="text-orange-350"
            icon={ProposalSendIcon}
          />
          {/* not part of proposal */}
          <ProposalStatisticsCard
            label="Oustanding PO"
            count={toIndianCurrency(userSales.data?.outStandingPo || 0)}
            textColor="text-blue-250"
            icon={OutstandingPoIcon}
          />
        </section>
      </article>
    </div>
  );
};

export default ManagingSubHeader;

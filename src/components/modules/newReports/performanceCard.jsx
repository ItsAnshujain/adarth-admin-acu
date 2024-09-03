import { useEffect } from 'react';
import { Text, Image } from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import toIndianCurrency from '../../../utils/currencyFormat';
import { useFetchInventoryReportList } from '../../../apis/queries/inventory.queries';
import OngoingOrdersIcon from '../../../assets/ongoing-orders.svg';
import TotalRevenueIcon from '../../../assets/total-revenue.svg';

const PerformanceCard = () => {
  const fixedSearchParams = new URLSearchParams({
    limit: 10000,
    page: 1,
    sortOrder: 'desc',
    sortBy: 'revenue',
  });

  const { data: inventoryReportList, isLoading: inventoryReportListLoading } =
    useFetchInventoryReportList(fixedSearchParams.toString());

  const topSpaceByBookings = inventoryReportList?.docs.reduce((prev, curr) =>
    prev.totalBookings > curr.totalBookings ? prev : curr,
  );

  const leastSpaceByBookings = inventoryReportList?.docs.reduce((prev, curr) =>
    prev.totalBookings < curr.totalBookings ? prev : curr,
  );

  const topSpaceByRevenue = inventoryReportList?.docs.reduce((prev, curr) =>
    prev.revenue > curr.revenue ? prev : curr,
  );

  const leastSpaceByRevenue = inventoryReportList?.docs.reduce((prev, curr) =>
    prev.revenue < curr.revenue ? prev : curr,
  );

  const cardData = [
    {
      title: 'Top Space by Bookings',
      data: {
        name: topSpaceByBookings?.basicInformation?.spaceName || 'N/A',
        value: topSpaceByBookings?.totalBookings || 0,
        label: 'Number of Bookings',
        icon: OngoingOrdersIcon,
      },
    },
    {
      title: 'Least Space by Bookings',
      data: {
        name: leastSpaceByBookings?.basicInformation?.spaceName || 'N/A',
        value: leastSpaceByBookings?.totalBookings || 0,
        label: 'Number of Bookings',
        icon: OngoingOrdersIcon,
      },
    },
    {
      title: 'Top Space by Revenue',
      data: {
        name: topSpaceByRevenue?.basicInformation?.spaceName || 'N/A',
        value: toIndianCurrency((topSpaceByRevenue?.revenue || 0) / 100000), // Convert to lacs
        label: 'Revenue Generated (In lac)',
        icon: TotalRevenueIcon,
      },
    },
    {
      title: 'Least Space by Revenue',
      data: {
        name: leastSpaceByRevenue?.basicInformation?.spaceName || 'N/A',
        value: toIndianCurrency((leastSpaceByRevenue?.revenue || 0) / 100000), // Convert to lacs
        label: 'Revenue Generated (In lac)',
        icon: TotalRevenueIcon,
      },
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
      {cardData.map(({ title, data }) => (
        <div className="border rounded p-8 pr-20" key={title}>
          <Image src={data.icon} alt="icon" height={24} width={24} fit="contain" />
          <Text className="my-2" size="sm" weight="200">
            {title}
          </Text>
          <Text size="sm">
            <span className="font-semibold">Space Name:</span> {data.name}
          </Text>
          <Text size="sm">
            <span className="font-semibold">{data.label}:</span> {data.value}
          </Text>
        </div>
      ))}
    </div>
  );
};

export default PerformanceCard;

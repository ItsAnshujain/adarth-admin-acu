import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { Text } from '@mantine/core';
import dayjs from 'dayjs';
import Table from '../../components/Table/Table';
import { useBookings } from '../../apis/queries/booking.queries';
import { generateSlNo, serialize } from '../../utils';
import { useFetchMasters } from '../../apis/queries/masters.queries';
import toIndianCurrency from '../../utils/currencyFormat';
import NoData from '../../components/shared/NoData';

const DATE_FORMAT = 'DD MMM YYYY';

const SampleReport = () => {
  const [searchParams, setSearchParams] = useSearchParams({
    page: 1,
    limit: 1000,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const { data: bookingData, isLoading: isLoadingBookingData } = useBookings(
    searchParams.toString(),
  );

  const { data: campaignStatus } = useFetchMasters(
    serialize({
      type: 'booking_campaign_status',
      parentId: null,
      page: 1,
      limit: 100,
      sortBy: 'name',
      sortOrder: 'desc',
    }),
  );
  const { data: paymentStatus } = useFetchMasters(
    serialize({
      type: 'payment_status',
      parentId: null,
      page: 1,
      limit: 100,
      sortBy: 'name',
      sortOrder: 'desc',
    }),
  );

  const column = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id',
        disableSortBy: true,
        Cell: info => useMemo(() => <p>{generateSlNo(info.row.index, 1, 1000)}</p>, []),
      },
      {
        Header: 'CAMPAIGN NAME',
        accessor: 'campaign.name',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { campaign, _id },
          },
        }) =>
          useMemo(
            () => (
              <Link to={`/bookings/view-details/${_id}`} className="text-purple-450 font-medium">
                <Text
                  className="overflow-hidden text-ellipsis max-w-[180px] underline"
                  lineClamp={1}
                  title={campaign?.name}
                >
                  {campaign?.name || '-'}
                </Text>
              </Link>
            ),
            [],
          ),
      },

      {
        Header: 'CLIENT',
        accessor: 'client.name',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { client },
          },
        }) =>
          useMemo(
            () => (
              <Text className="overflow-hidden text-ellipsis max-w-[180px]" lineClamp={1}>
                {client?.name}
              </Text>
            ),
            [],
          ),
      },

      {
        Header: 'CAMPAIGN INCHARGE',
        accessor: 'campaign.incharge.name',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { campaign },
          },
        }) => useMemo(() => <p>{campaign?.incharge?.name || '-'}</p>, []),
      },

      {
        Header: 'OUTSTANDING AMOUNT',
        accessor: 'outstandingAmount',
        disableSortBy: true,
        Cell: info =>
          useMemo(
            () => (
              <p>
                {info.row.original.unpaidAmount
                  ? toIndianCurrency(info.row.original.unpaidAmount)
                  : '-'}
              </p>
            ),
            [],
          ),
      },
      {
        Header: 'CAMPAIGN AMOUNT',
        accessor: 'campaign.totalPrice',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { campaign },
          },
        }) =>
          useMemo(
            () => (
              <div className="flex items-center justify-between max-w-min">
                {toIndianCurrency(campaign?.totalPrice || 0)}
              </div>
            ),
            [],
          ),
      },

      {
        Header: 'BOOKING DURATION',
        accessor: 'schedule',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { campaign },
          },
        }) =>
          useMemo(
            () => (
              <div className="flex items-center w-max">
                <p className="font-medium bg-gray-450 px-2 rounded-sm min-w-[120px] text-center">
                  {campaign?.startDate ? (
                    dayjs(campaign?.startDate).format(DATE_FORMAT)
                  ) : (
                    <NoData type="na" />
                  )}
                </p>
                <span className="px-2">&gt;</span>
                <p className="font-medium bg-gray-450 px-2 rounded-sm min-w-[120px] text-center">
                  {campaign?.endDate ? (
                    dayjs(campaign?.endDate).format(DATE_FORMAT)
                  ) : (
                    <NoData type="na" />
                  )}
                </p>
              </div>
            ),
            [],
          ),
      },
    ],
    [bookingData?.docs, campaignStatus, paymentStatus],
  );
  const sortedBookingData = useMemo(() => {
    if (!bookingData?.docs) return [];
    return bookingData.docs.sort((a, b) => (b.campaign.totalPrice || 0) - (a.campaign.totalPrice || 0));
  }, [bookingData?.docs]);

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 border-l border-gray-450 px-5 h-[400px] overflow-auto">
      <Table
      data={sortedBookingData}  // Use manually sorted data
      COLUMNS={column}
      loading={isLoadingBookingData}
      showPagination={false}
      initialState={{
        sortBy: [
          {
            id: 'campaign.totalPrice',
            desc: true,
          },
        ],
      }}
    />
    </div>
  );
};

export default SampleReport;

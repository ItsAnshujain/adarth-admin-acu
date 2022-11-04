import { useLocation } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { ChevronDown } from 'react-feather';
import { NativeSelect, Progress, Image, Text } from '@mantine/core';
import dayjs from 'dayjs';
import Table from '../../components/Table/Table';
import RowsPerPage from '../../components/RowsPerPage';
import Search from '../../components/Search';
import AreaHeader from '../../components/Bookings/Header';
import useSideBarState from '../../store/sidebar.store';
import OngoingOrdersIcon from '../../assets/ongoing-orders.svg';
import CompletedOrdersIcon from '../../assets/completed-orders.svg';
import UpcomingOrdersIcon from '../../assets/upcoming-orders.svg';
import { useBookings, useBookingStats, useUpdateBookingStatus } from '../../hooks/booking.hooks';
import { serialize } from '../../utils';
import { useFetchMasters } from '../../hooks/masters.hooks';
import MenuPopover from './MenuPopOver';
import toIndianCurrency from '../../utils/currencyFormat';

ChartJS.register(ArcElement, Tooltip, Legend);

const Proposals = () => {
  const setColor = useSideBarState(state => state.setColor);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'asc',
  });

  const { search: bookingQuery } = useLocation();

  const { data: bookingData } = useBookings(
    bookingQuery.slice(1) ? `${serialize(filters)}&${bookingQuery.slice(1)}` : serialize(filters),
  );
  const { data: bookingStats } = useBookingStats();
  const { data: campaignStatus } = useFetchMasters(
    serialize({ type: 'campaign_status', limit: 100 }),
  );
  const { data: PaymentStatus } = useFetchMasters(
    serialize({ type: 'payment_status', limit: 100 }),
  );
  const { data: printingStatus } = useFetchMasters(
    serialize({ type: 'printing_status', limit: 100 }),
  );
  const { data: mountingStatus } = useFetchMasters(
    serialize({ type: 'mounting_status', limit: 100 }),
  );

  const { mutateAsync: updateBooking } = useUpdateBookingStatus();

  const handlePaymentUpdate = (bookingId, data) => {
    updateBooking({ id: bookingId, query: serialize({ paymentStatus: data }) });
  };

  const handleMountingUpdate = (bookingId, data) => {
    updateBooking({ id: bookingId, query: serialize({ mountingStatus: data }) });
  };

  const handlePrintingUpdate = (bookingId, data) => {
    updateBooking({ id: bookingId, query: serialize({ printingStatus: data }) });
  };

  const handleCampaignUpdate = (bookingId, data) => {
    updateBooking({ id: bookingId, query: serialize({ campaignStatus: data }) });
  };

  useEffect(() => {
    setColor(2);
  }, []);

  const column = useMemo(() => [
    {
      Header: '#',
      accessor: '_id',
      Cell: ({ row: { index } }) => index + 1,
    },
    {
      Header: 'CLIENT',
      accessor: 'client',
      Cell: ({ cell: { value } }) => value.name,
    },
    {
      Header: 'ORDER DATE',
      Cell: ({ row: { original } }) => dayjs(original.client.createdAt).format('DD-MMMM-YYYY'),
    },

    {
      Header: 'CAMPAIGN NAME',
      Cell: ({ row: { original } }) => useMemo(() => original.campaign?.name, []),
    },
    {
      Header: 'BOOKING TYPE',
      accessor: 'type',
    },
    {
      Header: 'CAMPAIGN STATUS',
      Cell: ({
        row: {
          original: { _id, currentStatus },
        },
      }) =>
        useMemo(
          () => (
            <NativeSelect
              className="mr-2"
              data={campaignStatus?.docs.map(item => item.name) || []}
              styles={{
                rightSection: { pointerEvents: 'none' },
              }}
              rightSection={<ChevronDown size={16} className="mt-[1px] mr-1" />}
              rightSectionWidth={40}
              onChange={e => handleCampaignUpdate(_id, e.target.value)}
              value={currentStatus?.campaignStatus || ''}
            />
          ),
          [],
        ),
    },
    {
      Header: 'PAYMENT STATUS',
      Cell: ({
        row: {
          original: { _id, currentStatus },
        },
      }) =>
        useMemo(
          () => (
            <NativeSelect
              data={PaymentStatus?.docs.map(item => item.name) || []}
              styles={{
                rightSection: { pointerEvents: 'none' },
              }}
              rightSection={<ChevronDown size={16} className="mt-[1px] mr-1" />}
              rightSectionWidth={40}
              onChange={e => handlePaymentUpdate(_id, e.target.value)}
              value={currentStatus?.paymentStatus || ''}
            />
          ),
          [],
        ),
    },

    {
      Header: 'PRINTING STATUS',
      Cell: ({
        row: {
          original: { _id, currentStatus },
        },
      }) =>
        useMemo(
          () => (
            <NativeSelect
              className="mr-2"
              data={printingStatus?.docs.map(item => item.name) || []}
              styles={{
                rightSection: { pointerEvents: 'none' },
              }}
              rightSection={<ChevronDown size={16} className="mt-[1px] mr-1" />}
              rightSectionWidth={40}
              onChange={e => handlePrintingUpdate(_id, e.target.value)}
              value={currentStatus?.printingStatus || ''}
            />
          ),
          [],
        ),
    },
    {
      Header: 'MOUNTING STATUS',
      Cell: ({
        row: {
          original: { _id, currentStatus },
        },
      }) =>
        useMemo(
          () => (
            <NativeSelect
              className="mr-2"
              data={mountingStatus?.docs.map(item => item.name) || []}
              styles={{
                rightSection: { pointerEvents: 'none' },
              }}
              rightSection={<ChevronDown size={16} className="mt-[1px] mr-1" />}
              rightSectionWidth={40}
              onChange={e => handleMountingUpdate(_id, e.target.value)}
              value={currentStatus?.mountingStatus || ''}
            />
          ),
          [],
        ),
    },
    {
      Header: 'CAMPAIGN INCHARGE',
      accessor: 'campaign_incharge',
      Cell: () => '',
    },
    {
      Header: 'HEALTH STATUS',
      accessor: 'healthStatus',
      Cell: tableProps => {
        const {
          row: {
            original: { healthStatus, totalHealthStatus },
          },
        } = tableProps;
        return useMemo(
          () => (
            <div className="w-24">
              <Progress
                sections={[
                  { value: healthStatus, color: 'green' },
                  { value: totalHealthStatus - healthStatus, color: 'red' },
                ]}
              />
            </div>
          ),
          [],
        );
      },
    },

    {
      Header: 'PAYMENT TYPE',
      accessor: 'paymentType',
    },
    {
      Header: 'SCHEDULE',
      accessor: 'schedule',
      Cell: tableProps => {
        const {
          row: {
            original: { from_date, to_date },
          },
        } = tableProps;
        return useMemo(
          () => (
            <div className="flex items-center text-xs w-max">
              <span className="py-1 px-1 bg-slate-200 mr-2 rounded-md">{from_date}</span>
              &gt;
              <span className="py-1 px-1 bg-slate-200 mx-2 rounded-md">{to_date}</span>
            </div>
          ),
          [],
        );
      },
    },
    {
      Header: 'UPLOADED MEDIA',
      accessor: 'uploaded_media',
      Cell: () =>
        useMemo(
          () => '',
          // <div className="bg-white border rounded-md">
          //   <img className="h-10 mx-auto" src={photo} alt="banner" />
          // </div>
          [],
        ),
    },
    {
      Header: 'DOWNLOAD UPLOADED MEDIA',
      accessor: '',
      Cell: () => useMemo(() => <div className="text-purple-450 cursor-pointer">Download</div>, []),
    },
    {
      Header: 'TOTAL SPACES',
      accessor: 'totalSpaces',
    },
    {
      Header: 'PRICING',
      accessor: 'price',
      Cell: ({ cell: { value } }) => toIndianCurrency(value),
    },
    {
      Header: 'PURCHASE ORDER',
      accessor: '',
      Cell: () => useMemo(() => <div className="text-purple-450 cursor-pointer">Download</div>, []),
    },
    {
      Header: 'RELEASE ORDER',
      accessor: '',
      Cell: () => useMemo(() => <div className="text-purple-450 cursor-pointer">Download</div>, []),
    },
    {
      Header: 'INVOICE',
      accessor: '',
      Cell: () => useMemo(() => <div className="text-purple-450 cursor-pointer">Download</div>, []),
    },
    {
      Header: 'ACTION',
      disableSortBy: true,
      Cell: tableProps => {
        const {
          row: {
            original: { _id },
          },
        } = tableProps;

        return useMemo(() => <MenuPopover itemId={_id} />, []);
      },
    },
  ]);

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto ">
      <AreaHeader text="Order" />
      <div className="pr-7">
        <div className="mt-5 pl-5">
          <div className="flex justify-between gap-4 flex-wrap">
            <div className="flex gap-4 p-4 border rounded-md items-center">
              <div className="w-32">
                <Doughnut
                  options={{ responsive: true }}
                  data={{
                    datasets: [
                      {
                        data: [bookingStats?.data.online || 0, bookingStats?.data.offline || 0],
                        backgroundColor: ['#FF900E', '#914EFB'],
                        borderColor: ['#FF900E', '#914EFB'],
                        borderWidth: 1,
                      },
                    ],
                  }}
                />
              </div>
              <div>
                <Text size="md">Revenue Breakup</Text>
                <div className="flex gap-8 mt-6">
                  <div className="flex gap-2 items-center">
                    <div className="h-2 w-1 p-2 bg-orange-350 rounded-full" />
                    <div>
                      <Text size="xs" weight="200">
                        Online Sale
                      </Text>
                      <Text weight="bolder" size="xl">
                        {bookingStats?.data.online || 0}
                      </Text>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="h-2 w-1 p-2 rounded-full bg-purple-350" />
                    <div>
                      <Text size="xs" weight="200">
                        Offline Sale
                      </Text>
                      <Text weight="bolder" size="xl">
                        {bookingStats?.data.offline || 0}
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
                <Text weight="bold">{bookingStats?.data.ongoing || 0}</Text>
              </div>
              <div className="border rounded p-8 pr-20">
                <Image
                  src={UpcomingOrdersIcon}
                  alt="upcoming"
                  height={24}
                  width={24}
                  fit="contain"
                />
                <Text className="my-2" size="sm" weight="200">
                  Upcoming Orders
                </Text>
                <Text weight="bold">{bookingStats?.data.upcoming || 0}</Text>
              </div>
              <div className="border rounded p-8 pr-20">
                <Image
                  src={CompletedOrdersIcon}
                  alt="completed"
                  height={24}
                  width={24}
                  fit="contain"
                />
                <Text className="my-2" size="sm" weight="200">
                  Completed Orders
                </Text>
                <Text weight="bold">{bookingStats?.data.completed || 0}</Text>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between h-20 items-center">
          <RowsPerPage
            setCount={data => setFilters(prev => ({ ...prev, limit: Number(data) }))}
            count={`${filters.limit}`}
          />
          <Search search={search} setSearch={setSearch} />
        </div>
      </div>
      <Table
        data={bookingData?.docs || []}
        COLUMNS={column}
        activePage={bookingData?.page || 1}
        totalPages={bookingData?.totalPages || 1}
        setActivePage={data => setFilters(prev => ({ ...prev, page: data }))}
        rowCountLimit={filters.limit}
      />
    </div>
  );
};

export default Proposals;

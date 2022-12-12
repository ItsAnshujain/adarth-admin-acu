import { useDebouncedState } from '@mantine/hooks';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { ChevronDown } from 'react-feather';
import { NativeSelect, Progress, Loader } from '@mantine/core';
import dayjs from 'dayjs';
import Table from '../../components/Table/Table';
import RowsPerPage from '../../components/RowsPerPage';
import Search from '../../components/Search';
import AreaHeader from '../../components/Bookings/Header';
import { useBookings, useBookingStats, useUpdateBookingStatus } from '../../hooks/booking.hooks';
import { serialize } from '../../utils';
import { useFetchMasters } from '../../hooks/masters.hooks';
import MenuPopover from './MenuPopOver';
import toIndianCurrency from '../../utils/currencyFormat';
import BookingStatisticsView from './BookingStatisticsView';

const Bookings = () => {
  const [searchInput, setSearchInput] = useDebouncedState('', 1000);
  const [searchParams, setSearchParams] = useSearchParams({
    'page': 1,
    'limit': 10,
    'sortBy': 'createdAt',
    'sortOrder': 'desc',
  });

  const page = searchParams.get('page');
  const limit = searchParams.get('limit');

  const { data: bookingData, isLoading: isLoadingBookingData } = useBookings(
    searchParams.toString(),
  );
  const { data: bookingStats } = useBookingStats('');
  const { data: campaignStatus } = useFetchMasters(
    serialize({ type: 'campaign_status', limit: 100 }),
  );
  const { data: paymentStatus } = useFetchMasters(
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

  // TODO: remove disableSortBy when api is updated for sorting GET all bookings
  const column = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id',
        disableSortBy: true,
        Cell: ({ row }) =>
          useMemo(() => {
            let currentPage = page;
            let rowCount = 0;
            if (page < 1) {
              currentPage = 1;
            }
            rowCount = (currentPage - 1) * limit;
            return <div className="pl-2">{rowCount + row.index + 1}</div>;
          }, []),
      },
      {
        Header: 'CLIENT',
        accessor: 'client',
        Cell: ({
          row: {
            original: { client },
          },
        }) => useMemo(() => <p>{client?.name}</p>, []),
      },
      {
        Header: 'ORDER DATE',
        accessor: 'createdAt',
        Cell: ({ row: { original } }) => dayjs(original.client.createdAt).format('DD-MMMM-YYYY'),
      },
      {
        Header: 'CAMPAIGN NAME',
        accessor: 'campaign.name',
        Cell: ({ row: { original } }) => useMemo(() => original.campaign?.name, []),
      },
      {
        Header: 'BOOKING TYPE',
        accessor: 'type',
      },
      {
        Header: 'CAMPAIGN STATUS',
        accessor: 'currentStatus.campaignStatus',
        Cell: ({
          row: {
            original: { _id, currentStatus },
          },
        }) =>
          useMemo(
            () => (
              <NativeSelect
                className="mr-2"
                data={campaignStatus?.docs?.map(item => item.name) || []}
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
        accessor: 'currentStatus.paymentStatus',
        Cell: ({
          row: {
            original: { _id, currentStatus },
          },
        }) =>
          useMemo(
            () => (
              <NativeSelect
                data={paymentStatus?.docs?.map(item => item.name) || []}
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
        accessor: 'currentStatus.printingStatus',
        Cell: ({
          row: {
            original: { _id, currentStatus },
          },
        }) =>
          useMemo(
            () => (
              <NativeSelect
                className="mr-2"
                data={printingStatus?.docs?.map(item => item.name) || []}
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
        accessor: 'currentStatus.mountingStatus',
        Cell: ({
          row: {
            original: { _id, currentStatus },
          },
        }) =>
          useMemo(
            () => (
              <NativeSelect
                className="mr-2"
                data={mountingStatus?.docs?.map(item => item.name) || []}
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
        accessor: 'campaign.incharge.name',
        Cell: () => '',
      },
      {
        Header: 'HEALTH STATUS',
        accessor: 'campaign.avgHealth',
        Cell: ({
          row: {
            original: { healthStatus, totalHealthStatus },
          },
        }) =>
          useMemo(
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
          ),
      },
      {
        Header: 'PAYMENT TYPE',
        accessor: 'paymentType',
        disableSortBy: true,
      },
      {
        Header: 'SCHEDULE',
        accessor: 'schedule',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { from_date, to_date },
          },
        }) =>
          useMemo(
            () => (
              <div className="flex items-center text-xs w-max">
                <span className="py-1 px-1 bg-slate-200 mr-2 rounded-md">{from_date}</span>
                &gt;
                <span className="py-1 px-1 bg-slate-200 mx-2 rounded-md">{to_date}</span>
              </div>
            ),
            [],
          ),
      },
      {
        Header: 'UPLOADED MEDIA',
        accessor: 'uploaded_media',
        disableSortBy: true,
        Cell: () => useMemo(() => '', []),
      },
      {
        Header: 'DOWNLOAD UPLOADED MEDIA',
        accessor: '',
        disableSortBy: true,
        Cell: () =>
          useMemo(() => <div className="text-purple-450 cursor-pointer">Download</div>, []),
      },
      {
        Header: 'TOTAL SPACES',
        accessor: 'totalSpaces',
      },
      {
        Header: 'PRICING',
        accessor: 'price',
        Cell: ({
          row: {
            original: { price },
          },
        }) => useMemo(() => toIndianCurrency(price), []),
      },
      {
        Header: 'PURCHASE ORDER',
        accessor: 'purchaseOrder',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { purchaseOrder },
          },
        }) =>
          useMemo(
            () => (
              <a
                href={purchaseOrder}
                className="text-purple-450 cursor-pointer font-medium"
                target="_blank"
                download
                rel="noopener noreferrer"
              >
                Download
              </a>
            ),
            [],
          ),
      },
      {
        Header: 'RELEASE ORDER',
        accessor: 'releaseOrder',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { releaseOrder },
          },
        }) =>
          useMemo(
            () => (
              <a
                href={releaseOrder}
                className="text-purple-450 cursor-pointer font-medium"
                target="_blank"
                download
                rel="noopener noreferrer"
              >
                Download
              </a>
            ),
            [],
          ),
      },
      {
        Header: 'INVOICE',
        accessor: 'invoice',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { invoice },
          },
        }) =>
          useMemo(
            () => (
              <a
                href={invoice}
                className="text-purple-450 cursor-pointer font-medium"
                target="_blank"
                download
                rel="noopener noreferrer"
              >
                Download
              </a>
            ),
            [],
          ),
      },
      {
        Header: 'ACTION',
        accessor: 'action',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { _id },
          },
        }) => useMemo(() => <MenuPopover itemId={_id} />, []),
      },
    ],
    [bookingData?.docs, campaignStatus, paymentStatus, printingStatus, mountingStatus],
  );

  const handleSortByColumn = colId => {
    if (searchParams.get('sortBy') === colId && searchParams.get('sortOrder') === 'desc') {
      searchParams.set('sortOrder', 'asc');
      setSearchParams(searchParams);
      return;
    }
    if (searchParams.get('sortBy') === colId && searchParams.get('sortOrder') === 'asc') {
      searchParams.set('sortOrder', 'desc');
      setSearchParams(searchParams);
      return;
    }

    searchParams.set('sortBy', colId);
    setSearchParams(searchParams);
  };

  const handleSearch = () => {
    searchParams.set('search', searchInput);
    setSearchParams(searchParams);
  };

  const handleRowCount = currentLimit => {
    searchParams.set('limit', currentLimit);
    setSearchParams(searchParams);
  };

  const handlePagination = currentPage => {
    searchParams.set('page', currentPage);
    setSearchParams(searchParams);
  };

  useEffect(() => {
    handleSearch();
    if (searchInput === '') {
      searchParams.delete('search');
      setSearchParams(searchParams);
    }
  }, [searchInput]);

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto ">
      <AreaHeader text="Order" />
      <div className="pr-7">
        <BookingStatisticsView bookingStats={bookingStats} />
        <div className="flex justify-between h-20 items-center">
          <RowsPerPage setCount={handleRowCount} count={limit} />
          <Search search={searchInput} setSearch={setSearchInput} />
        </div>
      </div>
      {isLoadingBookingData ? (
        <div className="flex justify-center items-center h-[400px]">
          <Loader />
        </div>
      ) : null}
      {bookingData?.docs?.length === 0 && !isLoadingBookingData ? (
        <div className="w-full min-h-[400px] flex justify-center items-center">
          <p className="text-xl">No records found</p>
        </div>
      ) : null}
      {bookingData?.docs?.length ? (
        <Table
          data={bookingData?.docs || []}
          COLUMNS={column}
          activePage={bookingData?.page || 1}
          totalPages={bookingData?.totalPages || 1}
          setActivePage={handlePagination}
          rowCountLimit={limit}
          handleSorting={handleSortByColumn}
        />
      ) : null}
    </div>
  );
};

export default Bookings;

import { useDebouncedState } from '@mantine/hooks';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { ChevronDown } from 'react-feather';
import { NativeSelect, Progress, Loader, Button } from '@mantine/core';
import dayjs from 'dayjs';
import classNames from 'classnames';
import Table from '../../components/Table/Table';
import RowsPerPage from '../../components/RowsPerPage';
import Search from '../../components/Search';
import AreaHeader from '../../components/Bookings/Header';
import { useBookings, useBookingStats, useUpdateBookingStatus } from '../../hooks/booking.hooks';
import { downloadAll, serialize } from '../../utils';
import { useFetchMasters } from '../../hooks/masters.hooks';
import MenuPopover from './MenuPopOver';
import toIndianCurrency from '../../utils/currencyFormat';
import BookingStatisticsView from './BookingStatisticsView';
import NoData from '../../components/shared/NoData';

const statusSelectStyle = {
  rightSection: { pointerEvents: 'none' },
};

const DATE_FORMAT = 'DD MMM YYYY';

const Bookings = () => {
  const [searchInput, setSearchInput] = useDebouncedState('', 1000);
  const [searchParams, setSearchParams] = useSearchParams({
    'page': 1,
    'limit': 10,
    'sortBy': 'createdAt',
    'sortOrder': 'desc',
  });
  const navigate = useNavigate();
  const page = searchParams.get('page');
  const limit = searchParams.get('limit');

  const { data: bookingData, isLoading: isLoadingBookingData } = useBookings(
    searchParams.toString(),
  );
  const { data: bookingStats } = useBookingStats('');
  const { data: campaignStatus } = useFetchMasters(
    serialize({ type: 'campaign_status', parentId: null, page: 1, limit: 100 }),
  );
  const { data: paymentStatus } = useFetchMasters(
    serialize({ type: 'payment_status', parentId: null, page: 1, limit: 100 }),
  );

  const { mutateAsync: updateBooking } = useUpdateBookingStatus();

  const handlePaymentUpdate = (bookingId, data) => {
    if (data) {
      updateBooking({ id: bookingId, query: serialize({ paymentStatus: data }) });
    }
  };

  const handleCampaignUpdate = (bookingId, data) => {
    if (data) {
      updateBooking({ id: bookingId, query: serialize({ campaignStatus: data }) });
    }
  };

  const paymentList = useMemo(
    () => paymentStatus?.docs?.map(item => item.name) || [],
    [paymentStatus],
  );
  const campaignList = useMemo(
    () => campaignStatus?.docs?.map(item => item.name) || [],
    [campaignStatus],
  );

  const handleBookingDetails = itemId =>
    navigate(`/bookings/view-details/${itemId}`, {
      replace: true,
    });

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
        accessor: 'client.name',
        Cell: ({
          row: {
            original: { client },
          },
        }) => useMemo(() => <p>{client?.name}</p>, []),
      },
      {
        Header: 'ORDER DATE',
        accessor: 'createdAt',
        Cell: ({ row: { original } }) =>
          useMemo(
            () => (
              <p className="font-medium bg-gray-450 px-2 rounded-sm">
                {dayjs(original.createdAt).format(DATE_FORMAT)}
              </p>
            ),
            [],
          ),
      },
      {
        Header: 'CAMPAIGN NAME',
        accessor: 'campaign.name',
        Cell: ({
          row: {
            original: { campaign, _id },
          },
        }) =>
          useMemo(
            () => (
              <Button
                className="text-black font-medium px-2 max-w-[180px]"
                onClick={() => handleBookingDetails(_id)}
              >
                <span className="overflow-hidden text-ellipsis">{campaign?.name}</span>
              </Button>
            ),
            [],
          ),
      },
      {
        Header: 'BOOKING TYPE',
        accessor: 'type',
        Cell: ({
          row: {
            original: { type },
          },
        }) => useMemo(() => <p className="capitalize">{type}</p>, []),
      },
      {
        Header: 'CAMPAIGN STATUS',
        accessor: 'currentStatus.campaignStatus',
        Cell: ({
          row: {
            original: { _id, currentStatus },
          },
        }) =>
          useMemo(() => {
            const updatedCampaignList = [...campaignList];
            if (!currentStatus?.campaignStatus) {
              updatedCampaignList.unshift({ label: 'Select', value: '' });
            }
            return (
              <NativeSelect
                className="mr-2"
                data={updatedCampaignList}
                styles={statusSelectStyle}
                rightSection={<ChevronDown size={16} className="mt-[1px] mr-1" />}
                rightSectionWidth={40}
                onChange={e => handleCampaignUpdate(_id, e.target.value)}
                defaultValue={currentStatus?.campaignStatus || ''}
              />
            );
          }, []),
      },
      {
        Header: 'PAYMENT STATUS',
        accessor: 'currentStatus.paymentStatus',
        Cell: ({
          row: {
            original: { _id, currentStatus },
          },
        }) =>
          useMemo(() => {
            const updatedPaymentList = [...paymentList];
            if (!currentStatus?.paymentStatus) {
              updatedPaymentList.unshift({ label: 'Select', value: '' });
            }
            return (
              <NativeSelect
                className="mr-2"
                data={updatedPaymentList}
                styles={statusSelectStyle}
                rightSection={<ChevronDown size={16} className="mt-[1px] mr-1" />}
                rightSectionWidth={40}
                onChange={e => handlePaymentUpdate(_id, e.target.value)}
                defaultValue={currentStatus?.paymentStatus || ''}
              />
            );
          }, []),
      },
      {
        Header: 'PRINTING STATUS',
        accessor: 'currentStatus.printingStatus',
        Cell: ({
          row: {
            original: { campaign },
          },
        }) =>
          useMemo(() => {
            let printCount = 0;
            const totalSpaces = campaign?.spaces?.length;
            campaign?.spaces?.map(item => {
              if (item?.currentStatus?.printingStatus?.toLowerCase()?.includes('print')) {
                printCount += 1;
              }
              return printCount;
            });

            return (
              <p className="w-[200px]">
                {printCount === 0
                  ? 'Printing upcoming'
                  : printCount > 0 && printCount < totalSpaces
                  ? 'Printing in progress'
                  : printCount === totalSpaces
                  ? 'Printing completed'
                  : '-'}
              </p>
            );
          }, []),
      },
      {
        Header: 'MOUNTING STATUS',
        accessor: 'currentStatus.mountingStatus',
        Cell: ({
          row: {
            original: { campaign },
          },
        }) =>
          useMemo(() => {
            let mountCount = 0;
            const totalSpaces = campaign?.spaces?.length;
            campaign?.spaces?.map(item => {
              if (item?.currentStatus?.mountingStatus?.toLowerCase()?.includes('mount')) {
                mountCount += 1;
              }
              return mountCount;
            });

            return (
              <p className="w-[200px]">
                {mountCount === 0
                  ? 'Mounting upcoming'
                  : mountCount > 0 && mountCount < totalSpaces
                  ? 'Mounting in progress'
                  : mountCount === totalSpaces
                  ? 'Mounting completed'
                  : '-'}
              </p>
            );
          }, []),
      },
      {
        Header: 'CAMPAIGN INCHARGE',
        accessor: 'campaign.incharge.name',
        Cell: ({
          row: {
            original: { campaign },
          },
        }) => useMemo(() => <p>{campaign?.incharge?.name || <NoData type="na" />}</p>, []),
      },
      {
        Header: 'HEALTH STATUS',
        accessor: 'campaign.avgHealth',
        Cell: ({
          row: {
            original: { campaign },
          },
        }) =>
          useMemo(
            () => (
              <div className="w-24">
                <Progress
                  sections={[
                    { value: campaign?.avgHealth, color: 'green' },
                    { value: 100 - (campaign?.avgHealth || 0), color: 'red' },
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
        Cell: ({
          row: {
            original: { paymentType },
          },
        }) => useMemo(() => <p className="uppercase">{paymentType}</p>, []),
      },
      {
        Header: 'SCHEDULE',
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
                <p className="font-medium bg-gray-450 px-2 rounded-sm">
                  {campaign?.startDate ? (
                    dayjs(campaign?.startDate).format(DATE_FORMAT)
                  ) : (
                    <NoData type="na" />
                  )}
                </p>
                <span className="px-2">&gt;</span>
                <p className="font-medium bg-gray-450 px-2 rounded-sm">
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
      {
        Header: 'DOWNLOAD UPLOADED MEDIA',
        accessor: '',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { campaign },
          },
        }) =>
          useMemo(
            () => (
              <Button
                className={classNames(
                  campaign?.medias?.length
                    ? 'text-purple-450 cursor-pointer'
                    : 'pointer-events-none text-gray-450 bg-white',
                  'font-medium  text-base',
                )}
                disabled={!campaign?.medias?.length}
                onClick={() => downloadAll(campaign?.medias)}
              >
                Download
              </Button>
            ),
            [],
          ),
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
            original: { campaign },
          },
        }) => useMemo(() => toIndianCurrency(campaign?.totalPrice || 0), []),
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
                className={classNames(
                  purchaseOrder
                    ? 'text-purple-450 cursor-pointer'
                    : 'pointer-events-none text-gray-450',
                  'font-medium',
                )}
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
                className={classNames(
                  releaseOrder
                    ? 'text-purple-450 cursor-pointer'
                    : 'pointer-events-none text-gray-450',
                  'font-medium',
                )}
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
                className={classNames(
                  invoice ? 'text-purple-450 cursor-pointer' : 'pointer-events-none text-gray-450',
                  'font-medium',
                )}
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
    [bookingData?.docs, campaignStatus, paymentStatus],
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
    searchParams.set('page', 1);
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

import { useEffect, useMemo, useState } from 'react';
import { Text, Button, NativeSelect, Progress, Loader } from '@mantine/core';
import { ChevronDown } from 'react-feather';
import { useClickOutside, useDebouncedState } from '@mantine/hooks';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import classNames from 'classnames';
import RowsPerPage from '../../RowsPerPage';
import Search from '../../Search';
import calendar from '../../../assets/data-table.svg';
import DateRange from '../../DateRange';
import Table from '../../Table/Table';
import { useBookings, useUpdateBookingStatus } from '../../../hooks/booking.hooks';
import { useFetchMasters } from '../../../hooks/masters.hooks';
import { serialize } from '../../../utils';
import toIndianCurrency from '../../../utils/currencyFormat';
import BookingsMenuPopover from '../../Popovers/BookingsMenuPopover';

const statusSelectStyle = {
  rightSection: { pointerEvents: 'none' },
};

const TotalBookings = ({ campaignId }) => {
  const [searchInput, setSearchInput] = useDebouncedState('', 1000);
  const [searchParams, setSearchParams] = useSearchParams({
    page: 1,
    limit: 10,
    sortBy: 'campaign.name',
    sortOrder: 'desc',
    campaignId,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const ref = useClickOutside(() => setShowDatePicker(false));
  const toggleDatePicker = () => setShowDatePicker(prevState => !prevState);

  const page = searchParams.get('page');
  const limit = searchParams.get('limit');

  const { data: bookingData, isLoading: isLoadingBookingData } = useBookings(
    searchParams.toString(),
    !!campaignId,
  );
  const { data: campaignStatus } = useFetchMasters(
    serialize({ type: 'campaign_status', parentId: null, page: 1, limit: 100 }),
  );
  const { data: paymentStatus } = useFetchMasters(
    serialize({ type: 'payment_status', parentId: null, page: 1, limit: 100 }),
  );

  const { mutateAsync: updateBooking } = useUpdateBookingStatus();

  const handlePaymentUpdate = (bookingId, status) => {
    updateBooking({ id: bookingId, query: serialize({ paymentStatus: status }) });
  };

  const handleCampaignUpdate = (bookingId, status) => {
    updateBooking({ id: bookingId, query: serialize({ campaignStatus: status }) });
  };

  const paymentList = useMemo(
    () => paymentStatus?.docs?.map(item => item.name) || [],
    [paymentStatus],
  );
  const campaignList = useMemo(
    () => campaignStatus?.docs?.map(item => item.name) || [],
    [campaignStatus],
  );

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
        }) => useMemo(() => <BookingsMenuPopover itemId={_id} enableDelete={false} />, []),
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

  const handlePagination = (key, val) => {
    if (val !== '') searchParams.set(key, val);
    else searchParams.delete(key);

    setSearchParams(searchParams);
  };

  useEffect(() => {
    handleSearch();
    if (searchInput === '') {
      searchParams.delete('search');
      setSearchParams(searchParams);
    }
  }, [searchInput]);

  useEffect(() => {
    searchParams.set('sortBy', 'createdAt');
    setSearchParams(searchParams);
  }, []);

  return (
    <>
      <div className="mt-5 pl-5 pr-7 flex justify-between">
        <Text>Booking History of the campaign</Text>
        <div className="flex">
          <div ref={ref} className="mr-2 relative">
            <Button onClick={toggleDatePicker} variant="default">
              <img src={calendar} className="h-5" alt="calendar" />
            </Button>
            {showDatePicker && (
              <div className="absolute z-20 -translate-x-[90%] bg-white -top-0.3">
                <DateRange handleClose={toggleDatePicker} dateKeys={['from', 'to']} />
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
        <div className="flex justify-between h-20 items-center">
          <RowsPerPage
            setCount={currentLimit => handlePagination('limit', currentLimit)}
            count={limit}
          />
          <Search search={searchInput} setSearch={setSearchInput} />
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
            setActivePage={currentPage => handlePagination('page', currentPage)}
            rowCountLimit={limit}
            handleSorting={handleSortByColumn}
          />
        ) : null}
      </div>
    </>
  );
};

export default TotalBookings;

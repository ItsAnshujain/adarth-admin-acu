import { useDebouncedValue } from '@mantine/hooks';
import { useEffect, useMemo, useState } from 'react';
import { ChevronDown } from 'react-feather';
import { Button, Loader, Progress, Select, Text } from '@mantine/core';
import dayjs from 'dayjs';
import classNames from 'classnames';
import { Link, useSearchParams } from 'react-router-dom';
import multiDownload from 'multi-download';
import { checkCampaignStats, serialize } from '../../../utils';
import { useUpdateBookingStatus } from '../../../apis/hooks/booking.hooks';
import { useFetchMasters } from '../../../apis/hooks/masters.hooks';
import toIndianCurrency from '../../../utils/currencyFormat';
import Table from '../../Table/Table';
import RowsPerPage from '../../RowsPerPage';
import Search from '../../Search';
import NoData from '../../shared/NoData';
import BookingsMenuPopover from '../../Popovers/BookingsMenuPopover';

const statusSelectStyle = {
  rightSection: { pointerEvents: 'none' },
};

const sortOrders = order => {
  switch (order) {
    case 'asc':
      return 'desc';
    case 'desc':
      return 'asc';

    default:
      return 'asc';
  }
};

const DATE_FORMAT = 'DD MMM YYYY';

const BookingTableView = ({ data: bookingData, isLoading }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchInput, 800);

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
    () => paymentStatus?.docs?.map(item => ({ label: item.name, value: item.name })) || [],
    [paymentStatus],
  );
  const campaignList = useMemo(
    () => campaignStatus?.docs?.map(item => ({ label: item.name, value: item.name })) || [],
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
            const currentPage = bookingData?.page < 1 ? 1 : bookingData.page;
            const rowCount = (currentPage - 1) * bookingData.limit;

            return <p className="pl-2">{rowCount + row.index + 1}</p>;
          }, []),
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
              <Link to={`/bookings/view-details/${_id}`} className="font-medium underline">
                <Text
                  className="overflow-hidden text-ellipsis max-w-[180px] text-purple-450"
                  lineClamp={1}
                >
                  {campaign?.name || '-'}
                </Text>
              </Link>
            ),
            [],
          ),
      },
      {
        Header: 'BOOKING ID',
        accessor: 'bookingId',
        disableSortBy: true,
        Cell: info => useMemo(() => <p>{info.row.original.bookingId || '-'}</p>, []),
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

            const filteredList = updatedCampaignList.map(item => ({
              ...item,
              disabled: checkCampaignStats(currentStatus, item.value),
            }));

            return (
              <Select
                className="mr-2"
                data={filteredList}
                disabled={
                  currentStatus?.mountingStatus?.toLowerCase() !== 'completed' ||
                  currentStatus?.campaignStatus?.toLowerCase() === 'completed'
                }
                styles={statusSelectStyle}
                rightSection={<ChevronDown size={16} className="mt-[1px] mr-1" />}
                rightSectionWidth={40}
                onChange={e => handleCampaignUpdate(_id, e)}
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
            original: { _id, currentStatus, paymentStatus: p = {} },
          },
        }) =>
          useMemo(() => {
            const updatedPaymentList = [...paymentList];
            if (!currentStatus?.paymentStatus) {
              updatedPaymentList.unshift({ label: 'Select', value: '' });
            }

            const filteredList = updatedPaymentList.map(item => ({
              ...item,
              disabled: Object.keys(p).includes(item.value),
            }));

            return (
              <Select
                className="mr-2"
                data={filteredList}
                styles={statusSelectStyle}
                disabled={currentStatus?.paymentStatus?.toLowerCase() === 'paid'}
                rightSection={<ChevronDown size={16} className="mt-[1px] mr-1" />}
                rightSectionWidth={40}
                onChange={e => handlePaymentUpdate(_id, e)}
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
            original: { currentStatus },
          },
        }) =>
          useMemo(
            () => (
              <p className="w-[200px]">
                {currentStatus?.printingStatus?.toLowerCase()?.includes('upcoming')
                  ? 'Printing upcoming'
                  : currentStatus?.printingStatus?.toLowerCase()?.includes('in progress')
                  ? 'Printing in progress'
                  : currentStatus?.printingStatus?.toLowerCase()?.includes('completed')
                  ? 'Printing completed'
                  : '-'}
              </p>
            ),
            [],
          ),
      },
      {
        Header: 'MOUNTING STATUS',
        accessor: 'currentStatus.mountingStatus',
        Cell: ({
          row: {
            original: { currentStatus },
          },
        }) =>
          useMemo(
            () => (
              <p className="w-[200px]">
                {currentStatus?.mountingStatus?.toLowerCase()?.includes('upcoming')
                  ? 'Mounting upcoming'
                  : currentStatus?.mountingStatus?.toLowerCase()?.includes('in progress')
                  ? 'Mounting in progress'
                  : currentStatus?.mountingStatus?.toLowerCase()?.includes('completed')
                  ? 'Mounting completed'
                  : '-'}
              </p>
            ),
            [],
          ),
      },
      {
        Header: 'CAMPAIGN INCHARGE',
        accessor: 'campaign.incharge.name',
        Cell: ({
          row: {
            original: { campaign },
          },
        }) => useMemo(() => <p>{campaign?.incharge?.name || '-'}</p>, []),
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
                onClick={() => multiDownload(campaign?.medias)}
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
        accessor: 'campaign.totalPrice',
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
        }) => useMemo(() => <BookingsMenuPopover itemId={_id} />, []),
      },
    ],
    [bookingData?.docs, campaignStatus, paymentStatus],
  );

  const handleSortByColumn = colId => {
    searchParams.set('sortBy', colId);
    searchParams.set(
      'sortOrder',
      searchParams.get('sortBy') === colId ? sortOrders(searchParams.get('sortOrder')) : 'asc',
    );
    setSearchParams(searchParams);
  };

  const handleSearch = () => {
    searchParams.set('search', debouncedSearch);
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
    if (debouncedSearch === '') {
      searchParams.delete('search');
      setSearchParams(searchParams);
    }
  }, [debouncedSearch]);

  return (
    <div className="">
      <div className="pr-7">
        <div className="flex justify-between h-20 items-center">
          <RowsPerPage
            setCount={limit => handlePagination('limit', limit)}
            count={bookingData.limit?.toString()}
          />
          <Search search={searchInput} setSearch={setSearchInput} />
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-[380px]">
          <Loader />
        </div>
      ) : null}
      {!bookingData?.docs?.length && !isLoading ? (
        <div className="w-full min-h-[380px] flex justify-center items-center">
          <p className="text-xl">No records found</p>
        </div>
      ) : null}
      {bookingData?.docs?.length ? (
        <Table
          data={bookingData?.docs || []}
          COLUMNS={column}
          activePage={bookingData?.page || 1}
          totalPages={bookingData?.totalPages || 1}
          setActivePage={page => handlePagination('page', page)}
          rowCountLimit={bookingData?.limit || 10}
          handleSorting={handleSortByColumn}
        />
      ) : null}
    </div>
  );
};

export default BookingTableView;

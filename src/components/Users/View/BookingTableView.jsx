import { useDebouncedState } from '@mantine/hooks';
import { useEffect, useMemo } from 'react';
import { ChevronDown } from 'react-feather';
import { Button, Loader, NativeSelect, Progress } from '@mantine/core';
import dayjs from 'dayjs';
import classNames from 'classnames';
import { useSearchParams } from 'react-router-dom';
import { downloadPdf, serialize } from '../../../utils';
import { useUpdateBookingStatus } from '../../../hooks/booking.hooks';
import { useFetchMasters } from '../../../hooks/masters.hooks';
import toIndianCurrency from '../../../utils/currencyFormat';
import MenuPopover from '../../../pages/Booking/MenuPopOver';
import Table from '../../Table/Table';
import RowsPerPage from '../../RowsPerPage';
import Search from '../../Search';
import NoData from '../../shared/NoData';

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
  const [searchInput, setSearchInput] = useDebouncedState('', 1000);

  const { data: campaignStatus } = useFetchMasters(
    serialize({ type: 'campaign_status', parentId: null, page: 1, limit: 100 }),
  );
  const { data: paymentStatus } = useFetchMasters(
    serialize({ type: 'payment_status', parentId: null, page: 1, limit: 100 }),
  );
  const { data: printingStatus } = useFetchMasters(
    serialize({ type: 'printing_status', parentId: null, page: 1, limit: 100 }),
  );
  const { data: mountingStatus } = useFetchMasters(
    serialize({ type: 'mounting_status', parentId: null, page: 1, limit: 100 }),
  );

  const { mutateAsync: updateBooking } = useUpdateBookingStatus();

  const handlePaymentUpdate = (bookingId, data) => {
    if (data) {
      updateBooking({ id: bookingId, query: serialize({ paymentStatus: data }) });
    }
  };

  const handleMountingUpdate = (bookingId, data) => {
    if (data) {
      updateBooking({ id: bookingId, query: serialize({ mountingStatus: data }) });
    }
  };

  const handlePrintingUpdate = (bookingId, data) => {
    if (data) {
      updateBooking({ id: bookingId, query: serialize({ printingStatus: data }) });
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
  const mountingList = useMemo(
    () => mountingStatus?.docs?.map(item => item.name) || [],
    [mountingStatus],
  );
  const printingList = useMemo(
    () => printingStatus?.docs?.map(item => item.name) || [],
    [printingStatus],
  );
  const campaignList = useMemo(
    () => campaignStatus?.docs?.map(item => item.name) || [],
    [campaignStatus],
  );

  const downloadAll = urls => {
    urls.forEach(item => {
      downloadPdf(item);
    });
  };

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
            original: { campaign },
          },
        }) => useMemo(() => <p>{campaign?.name || <NoData type="na" />}</p>, []),
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
            original: { _id, currentStatus },
          },
        }) =>
          useMemo(() => {
            const updatedPrintingList = [...printingList];
            if (!currentStatus?.printingStatus) {
              updatedPrintingList.unshift({ label: 'Select', value: '' });
            }
            return (
              <NativeSelect
                className="mr-2"
                data={updatedPrintingList}
                styles={statusSelectStyle}
                rightSection={<ChevronDown size={16} className="mt-[1px] mr-1" />}
                rightSectionWidth={40}
                onChange={e => handlePrintingUpdate(_id, e.target.value)}
                defaultValue={currentStatus?.printingStatus || ''}
              />
            );
          }, []),
      },
      {
        Header: 'MOUNTING STATUS',
        accessor: 'currentStatus.mountingStatus',
        Cell: ({
          row: {
            original: { _id, currentStatus },
          },
        }) =>
          useMemo(() => {
            const updatedMountingList = [...mountingList];
            if (!currentStatus?.mountingStatus) {
              updatedMountingList.unshift({ label: 'Select', value: '' });
            }
            return (
              <NativeSelect
                className="mr-2"
                data={updatedMountingList}
                styles={statusSelectStyle}
                rightSection={<ChevronDown size={16} className="mt-[1px] mr-1" />}
                rightSectionWidth={40}
                onChange={e => handleMountingUpdate(_id, e.target.value)}
                defaultValue={currentStatus?.mountingStatus || ''}
              />
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
    [bookingData?.docs, campaignStatus, paymentStatus, printingStatus, mountingStatus],
  );

  const handleSortByColumn = colId => {
    searchParams.set('sortBy', colId);
    searchParams.set(
      'sortOrder',
      searchParams.get('sortBy') === colId ? sortOrders(searchParams.get('sortOrder')) : 'asc',
    );
    setSearchParams(searchParams);
  };

  const handlePagination = (key, val) => {
    if (val !== '') searchParams.set(key, val);
    else searchParams.delete(key);

    setSearchParams(searchParams);
  };

  useEffect(() => {
    if (!searchInput) searchParams.delete('search');
    else searchParams.set('searchParams');
    setSearchParams(searchParams);
  }, [searchInput]);

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto ">
      <div className="pr-7">
        <div className="flex justify-between h-20 items-center">
          <RowsPerPage
            setCount={limit => handlePagination('limit', limit)}
            count={bookingData.limit}
          />
          <Search search={searchInput} setSearch={setSearchInput} />
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-[400px]">
          <Loader />
        </div>
      ) : null}
      {bookingData?.docs?.length === 0 && !isLoading ? (
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
          setActivePage={page => handlePagination('page', page)}
          rowCountLimit={bookingData?.limit || 10}
          handleSorting={handleSortByColumn}
        />
      ) : null}
    </div>
  );
};

export default BookingTableView;

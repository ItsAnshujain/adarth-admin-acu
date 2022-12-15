import { useEffect, useMemo, useState } from 'react';
import { Text, Button, NativeSelect, Progress, Loader } from '@mantine/core';
import { ChevronDown, Plus } from 'react-feather';
import { useDebouncedState } from '@mantine/hooks';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import classNames from 'classnames';
import RowsPerPage from '../../RowsPerPage';
import Search from '../../Search';
import calendar from '../../../assets/data-table.svg';
import DateRange from '../../DateRange';
import Table from '../../Table/Table';
import { useBookings, useUpdateBookingStatus } from '../../../hooks/booking.hooks';
import MenuPopover from '../../../pages/Booking/MenuPopOver';
import { useFetchMasters } from '../../../hooks/masters.hooks';
import { ROLES, serialize } from '../../../utils';
import toIndianCurrency from '../../../utils/currencyFormat';
import RoleBased from '../../RoleBased';

const statusSelectStyle = {
  rightSection: { pointerEvents: 'none' },
};

const TotalBookings = ({ campaignId, isLoading }) => {
  const [searchInput, setSearchInput] = useDebouncedState('', 1000);
  const [searchParams, setSearchParams] = useSearchParams({
    page: 1,
    limit: 10,
    sortBy: 'campaign.name',
    sortOrder: 'desc',
    campaignId,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
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
  const { data: printingStatus } = useFetchMasters(
    serialize({ type: 'printing_status', parentId: null, page: 1, limit: 100 }),
  );
  const { data: mountingStatus } = useFetchMasters(
    serialize({ type: 'mounting_status', parentId: null, page: 1, limit: 100 }),
  );

  const { mutateAsync: updateBooking } = useUpdateBookingStatus();

  const handlePaymentUpdate = (bookingId, status) => {
    updateBooking({ id: bookingId, query: serialize({ paymentStatus: status }) });
  };

  const handleMountingUpdate = (bookingId, status) => {
    updateBooking({ id: bookingId, query: serialize({ mountingStatus: status }) });
  };

  const handlePrintingUpdate = (bookingId, status) => {
    updateBooking({ id: bookingId, query: serialize({ printingStatus: status }) });
  };

  const handleCampaignUpdate = (bookingId, status) => {
    updateBooking({ id: bookingId, query: serialize({ campaignStatus: status }) });
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
                onChange={e => handleCampaignUpdate(_id, e.target.value.toLowerCase())}
                value={currentStatus?.campaignStatus?.toLowerCase() || ''}
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
                value={currentStatus?.paymentStatus || ''}
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

  useEffect(() => {
    searchParams.set('sortBy', 'createdAt');
    setSearchParams(searchParams);
  }, []);

  return (
    <>
      <div className="mt-5 pl-5 pr-7 flex justify-between">
        <Text>Booking History of the campaign</Text>
        <div className="flex">
          <div className="mr-2 relative">
            <Button onClick={toggleDatePicker} variant="default">
              <img src={calendar} className="h-5" alt="calendar" />
            </Button>
            {showDatePicker && (
              <div className="absolute z-20 -translate-x-3/4 bg-white -top-0.3">
                <DateRange handleClose={toggleDatePicker} />
              </div>
            )}
          </div>
          <RoleBased acceptedRoles={[ROLES.ADMIN, ROLES.SUPERVISOR]}>
            <div>
              <Button
                onClick={() => {}}
                className="bg-purple-450 flex items-center align-center py-2 text-white rounded-md px-4"
              >
                <Plus size={16} className="mt-[1px] mr-1" /> Add Space
              </Button>
            </div>
          </RoleBased>
        </div>
      </div>
      <div>
        <div className="flex justify-between h-20 items-center">
          <RowsPerPage setCount={handleRowCount} count={limit} />
          <Search search={searchInput} setSearch={setSearchInput} />
        </div>
        {isLoading ? (
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
    </>
  );
};

export default TotalBookings;

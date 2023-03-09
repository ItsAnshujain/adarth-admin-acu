import { useState, useMemo, useEffect } from 'react';
import { Text, Button, Image, Loader } from '@mantine/core';
import { ChevronDown } from 'react-feather';
import { Link, useSearchParams } from 'react-router-dom';
import { useClickOutside, useDebouncedState } from '@mantine/hooks';
import dayjs from 'dayjs';
import classNames from 'classnames';
import DateRange from '../../DateRange';
import Filter from '../../Bookings/Filter';
import calendar from '../../../assets/data-table.svg';
import Table from '../../Table/Table';
import toIndianCurrency from '../../../utils/currencyFormat';
import RowsPerPage from '../../RowsPerPage';
import Search from '../../Search';
import { useFetchBookingsByInventoryId } from '../../../hooks/inventory.hooks';
import NoData from '../../shared/NoData';
import BookingsMenuPopover from '../../Popovers/BookingsMenuPopover';

const DATE_FORMAT = 'DD MMM YYYY';

const Booking = ({ inventoryId }) => {
  const [searchInput, setSearchInput] = useDebouncedState('', 1000);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const ref = useClickOutside(() => setShowDatePicker(false));
  const [searchParams, setSearchParams] = useSearchParams({
    'page': 1,
    'limit': 10,
    'sortBy': 'createdAt',
    'sortOrder': 'desc',
  });

  const page = searchParams.get('page');
  const limit = searchParams.get('limit');

  const { data: bookingData, isLoading: isLoadingBookingData } = useFetchBookingsByInventoryId({
    inventoryId,
    query: searchParams.toString(),
  });

  const toggleDatePicker = () => setShowDatePicker(!showDatePicker);
  const toggleFilter = () => setShowFilter(!showFilter);

  const COLUMNS = useMemo(
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
        Header: 'CAMPAIGN NAME',
        accessor: 'campaign.name',
        Cell: ({
          row: {
            original: { campaignName, _id },
          },
        }) =>
          useMemo(
            () => (
              <Link to={`/bookings/view-details/${_id}`} className="text-black font-medium">
                <Text className="overflow-hidden text-ellipsis max-w-[180px]" lineClamp={1}>
                  {campaignName || '-'}
                </Text>
              </Link>
            ),
            [],
          ),
      },
      {
        Header: 'CAMPAIGN INCHARGE',
        accessor: 'incharge.name',
        Cell: ({
          row: {
            original: { incharge },
          },
        }) => useMemo(() => <p>{incharge?.name || '-'}</p>, []),
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
              <p
                className={classNames(
                  currentStatus?.printingStatus?.toLowerCase()?.includes('upcoming')
                    ? 'text-blue-600'
                    : currentStatus?.printingStatus?.toLowerCase()?.includes('in progress')
                    ? 'text-purple-450'
                    : currentStatus?.printingStatus?.toLowerCase()?.includes('completed')
                    ? 'text-green-400'
                    : '-',
                  'w-[200px]',
                )}
              >
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
              <p
                className={classNames(
                  currentStatus?.mountingStatus?.toLowerCase()?.includes('upcoming')
                    ? 'text-blue-600'
                    : currentStatus?.mountingStatus?.toLowerCase()?.includes('in progress')
                    ? 'text-purple-450'
                    : currentStatus?.mountingStatus?.toLowerCase()?.includes('completed')
                    ? 'text-green-400'
                    : '-',
                  'w-[200px]',
                )}
              >
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
        Header: 'PAYMENT STATUS',
        accessor: 'currentStatus.paymentStatus',
        Cell: ({
          row: {
            original: { currentStatus },
          },
        }) =>
          useMemo(
            () => (
              <p
                className={classNames(
                  currentStatus?.paymentStatus?.toLowerCase() === 'paid'
                    ? 'text-green-400'
                    : currentStatus?.paymentStatus?.toLowerCase() === 'unpaid'
                    ? 'text-yellow-500'
                    : '',
                  'font-medium',
                )}
              >
                {currentStatus?.paymentStatus || '-'}
              </p>
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
            original: { startDate, endDate },
          },
        }) =>
          useMemo(
            () => (
              <div className="flex items-center w-max">
                <p className="font-medium bg-gray-450 px-2 rounded-sm">
                  {startDate ? dayjs(startDate).format(DATE_FORMAT) : <NoData type="na" />}
                </p>
                <span className="px-2">&gt;</span>
                <p className="font-medium bg-gray-450 px-2 rounded-sm">
                  {endDate ? dayjs(endDate).format(DATE_FORMAT) : <NoData type="na" />}
                </p>
              </div>
            ),
            [],
          ),
      },
      {
        Header: 'PRICING',
        accessor: 'totalPrice',
        Cell: ({
          row: {
            original: { totalPrice },
          },
        }) =>
          useMemo(
            () => <p className="pl-2">{totalPrice ? toIndianCurrency(totalPrice) : 0}</p>,
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
    [bookingData?.docs],
  );

  const handleSearch = () => {
    searchParams.set('search', searchInput);
    searchParams.set('page', 1);
    setSearchParams(searchParams, { replace: true });
  };

  const handlePagination = (key, val) => {
    if (val !== '') searchParams.set(key, val);
    else searchParams.delete(key);
    setSearchParams(searchParams, { replace: true });
  };

  const handleSortByColumn = colId => {
    if (searchParams.get('sortBy') === colId && searchParams.get('sortOrder') === 'desc') {
      searchParams.set('sortOrder', 'asc');
      setSearchParams(searchParams, { replace: true });
      return;
    }
    if (searchParams.get('sortBy') === colId && searchParams.get('sortOrder') === 'asc') {
      searchParams.set('sortOrder', 'desc');
      setSearchParams(searchParams, { replace: true });
      return;
    }

    searchParams.set('sortBy', colId);
    setSearchParams(searchParams, { replace: true });
  };

  useEffect(() => {
    handleSearch();
    if (searchInput === '') {
      searchParams.delete('search');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchInput]);

  return (
    <div className="flex flex-col">
      <div className="flex justify-between py-4 pl-5 pr-7">
        <div>
          <Text weight="bold">List of bookings / Order</Text>
        </div>
        <div className="flex">
          <div ref={ref} className="mr-2 relative">
            <Button onClick={toggleDatePicker} variant="default">
              <Image src={calendar} className="h-5" alt="calendar" />
            </Button>
            {showDatePicker && (
              <div className="absolute z-20 -translate-x-3/4 bg-white -top-0.3">
                <DateRange handleClose={toggleDatePicker} dateKeys={['from', 'to']} />
              </div>
            )}
          </div>
          <div className="mr-2">
            <Button onClick={toggleFilter} variant="default">
              <ChevronDown size={16} className="mt-[1px] mr-1" /> Filter
            </Button>
            {showFilter && (
              <Filter
                isOpened={showFilter}
                setShowFilter={setShowFilter}
                showBookingTypeOption={false}
                showCampaignStatusOption={false}
              />
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-between h-20 items-center pr-7">
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
          COLUMNS={COLUMNS}
          activePage={bookingData?.page || 1}
          totalPages={bookingData?.totalPages || 1}
          setActivePage={currentPage => handlePagination('page', currentPage)}
          rowCountLimit={limit}
          handleSorting={handleSortByColumn}
        />
      ) : null}
    </div>
  );
};

export default Booking;

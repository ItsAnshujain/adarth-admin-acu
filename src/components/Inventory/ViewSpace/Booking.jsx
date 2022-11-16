import { useState, useMemo, useEffect } from 'react';
import { Text, Button, Image, Loader } from '@mantine/core';
import { ChevronDown } from 'react-feather';
import { useSearchParams } from 'react-router-dom';
import { useClickOutside, useDebouncedState } from '@mantine/hooks';
import DateRange from '../../DateRange';
import Filter from '../../Filter';
import calendar from '../../../assets/data-table.svg';
import Table from '../../Table/Table';
import { useBookings } from '../../../hooks/booking.hooks';
import MenuIcon from '../../Menu';
import toIndianCurrency from '../../../utils/currencyFormat';
import RowsPerPage from '../../RowsPerPage';
import Search from '../../Search';

const Booking = () => {
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

  const { data: bookingData, isLoading: isLoadingBookingData } = useBookings(
    searchParams.toString(),
  );

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
        accessor: 'client',
        Cell: ({
          row: {
            original: { client },
          },
        }) => useMemo(() => <p className="w-full">{client?.name}</p>, []),
      },
      {
        Header: 'CAMPAIGN INCHARGE',
        accessor: 'booking_manager',
        Cell: ({
          row: {
            original: { campaignName },
          },
        }) => useMemo(() => <p className="w-36">{campaignName}</p>, []),
      },
      {
        Header: 'CAMPAIGN NAME',
        accessor: 'campaign',
        Cell: ({
          row: {
            original: { image, campaign },
          },
        }) =>
          useMemo(
            () => (
              <div className="flex items-center w-max">
                {image ? (
                  <Image src={image} alt="altered" height={32} width={32} />
                ) : (
                  <Image src={null} withPlaceholder height={32} width={32} />
                )}
                <p className="pl-2">{campaign?.name}</p>
              </div>
            ),
            [],
          ),
      },
      {
        Header: 'PRINTING STATUS',
        accessor: 'printingStatus',
        Cell: ({
          row: {
            original: { currentStatus },
          },
        }) =>
          useMemo(() => {
            const color =
              currentStatus?.printingStatus === 'Completed'
                ? 'green'
                : currentStatus?.printingStatus === 'Upcoming'
                ? 'red'
                : 'blue';
            return (
              <p className="w-36" style={{ color }}>
                {currentStatus?.printingStatus || '-'}
              </p>
            );
          }, []),
      },
      {
        Header: 'MOUNTING STATUS',
        accessor: 'mountingStatus',
        Cell: ({
          row: {
            original: { currentStatus },
          },
        }) =>
          useMemo(() => {
            const color = currentStatus?.mountingStatus === 'Completed' ? 'green' : 'red';
            return (
              <p className="w-36" style={{ color }}>
                {currentStatus?.mountingStatus || '-'}
              </p>
            );
          }, []),
      },
      {
        Header: 'PAYMENT STATUS',
        accessor: 'paymentStatus',
        Cell: ({
          row: {
            original: { currentStatus },
          },
        }) =>
          useMemo(() => {
            const color = currentStatus?.paymentStatus === 'Paid' ? 'green' : 'red';
            return (
              <p className="w-36" style={{ color }}>
                {currentStatus?.paymentStatus || '-'}
              </p>
            );
          }, []),
      },
      {
        Header: 'PAYMENT TYPE',
        accessor: 'type',
        Cell: ({
          row: {
            original: { type },
          },
        }) => useMemo(() => <p className="w-36 capitalize">{type}</p>, []),
      },
      {
        Header: 'SCHEDULE',
        accessor: 'schedule',
        Cell: ({
          row: {
            original: { from_date, to_date },
          },
        }) =>
          useMemo(
            () => (
              <div className="flex items-center text-xs w-max">
                <span className="py-1 px-1 bg-slate-200 mr-2  rounded-md ">{from_date}</span>
                &gt;
                <span className="py-1 px-1 bg-slate-200 mx-2  rounded-md">{to_date}</span>
              </div>
            ),
            [],
          ),
      },
      {
        Header: 'PRICING',
        accessor: 'price',
        Cell: ({
          row: {
            original: { price },
          },
        }) => useMemo(() => <p className="pl-2">{price ? toIndianCurrency(price) : 0}</p>, []),
      },
      {
        Header: 'ACTION',
        accessor: 'action',
        disableSortBy: true,
        Cell: () =>
          useMemo(
            () => (
              <Button>
                <MenuIcon />
              </Button>
            ),
            [],
          ),
      },
    ],
    [bookingData?.docs],
  );

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

  useEffect(() => {
    handleSearch();
    if (searchInput === '') {
      searchParams.delete('search');
      setSearchParams(searchParams);
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
                <DateRange handleClose={toggleDatePicker} />
              </div>
            )}
          </div>
          <div className="mr-2">
            <Button onClick={toggleFilter} variant="default">
              <ChevronDown size={16} className="mt-[1px] mr-1" /> Filter
            </Button>
            {showFilter && <Filter isOpened={showFilter} setShowFilter={setShowFilter} />}
          </div>
        </div>
      </div>
      <div className="flex justify-between h-20 items-center pr-7">
        <RowsPerPage setCount={handleRowCount} count={limit} />
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
          setActivePage={handlePagination}
          rowCountLimit={limit}
          handleSorting={handleSortByColumn}
        />
      ) : null}
    </div>
  );
};

export default Booking;

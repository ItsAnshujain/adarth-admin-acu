import { useState, useMemo } from 'react';
import { Text, Button, Image } from '@mantine/core';
import { ChevronDown } from 'react-feather';
import { useSearchParams } from 'react-router-dom';
import { useClickOutside } from '@mantine/hooks';
import DateRange from '../../DateRange';
import Filter from '../../Filter';
import calendar from '../../../assets/data-table.svg';
import Table from '../../Table/Table';
import { useBookings } from '../../../hooks/booking.hooks';
import MenuIcon from '../../Menu';
import toIndianCurrency from '../../../utils/currencyFormat';

const Booking = ({ count }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const ref = useClickOutside(() => setShowDatePicker(false));
  const [searchParams] = useSearchParams({
    'page': 1,
    'limit': 20,
  });

  const page = searchParams.get('page');
  const limit = searchParams.get('limit');

  const { data: bookingData } = useBookings(`${searchParams.toString()}`);

  const openDatePicker = () => setShowDatePicker(!showDatePicker);

  const COLUMNS = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id',
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
        }) => useMemo(() => <p className="w-full">{client?.companyName}</p>, []),
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
        accessor: 'campaign_name',
        Cell: ({
          row: {
            original: { image, campaign_name },
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

                <div>{campaign_name}</div>
              </div>
            ),
            [],
          ),
      },
      {
        Header: 'PRINTING STATUS',
        accessor: 'printing_status',
        Cell: ({
          row: {
            original: { printing_status },
          },
        }) =>
          useMemo(() => {
            const color =
              printing_status === 'Completed'
                ? 'green'
                : printing_status === 'Upcoming'
                ? 'red'
                : 'blue';
            return (
              <p className="w-36" style={{ color }}>
                {printing_status}
              </p>
            );
          }, []),
      },
      {
        Header: 'MOUNTING STATUS',
        accessor: 'mounting_status',
        Cell: ({
          row: {
            original: { mounting_status },
          },
        }) =>
          useMemo(() => {
            const color = mounting_status === 'Completed' ? 'green' : 'red';
            return (
              <p className="w-36" style={{ color }}>
                {mounting_status}
              </p>
            );
          }, []),
      },
      {
        Header: 'PAYMENT STATUS',
        accessor: 'payment_status',
        Cell: ({
          row: {
            original: { payment_status },
          },
        }) =>
          useMemo(() => {
            const color = payment_status === 'Paid' ? 'green' : 'red';
            return (
              <p className="w-36" style={{ color }}>
                {payment_status}
              </p>
            );
          }, []),
      },
      {
        Header: 'PAYMENT TYPE',
        accessor: 'payment_type',
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
        accessor: 'pricing',
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
        Header: '',
        accessor: 'details',
        disableSortBy: true,
        Cell: () =>
          useMemo(
            () => (
              <div className="w-[100px] flex justify-center">
                <button type="button">
                  <MenuIcon />
                </button>
              </div>
            ),
            [],
          ),
      },
    ],
    [bookingData?.docs],
  );

  return (
    <div className="flex flex-col">
      <div className="flex justify-between py-4 pl-5 pr-7">
        <div>
          <Text weight="bold">List of bookings / Order</Text>
        </div>
        <div className="flex">
          <div ref={ref} className="mr-2 relative">
            <Button onClick={openDatePicker} variant="default" type="button">
              <img src={calendar} className="h-5" alt="calendar" />
            </Button>
            {showDatePicker && (
              <div className="absolute z-20 -translate-x-3/4 bg-white -top-0.3">
                <DateRange handleClose={openDatePicker} />
              </div>
            )}
          </div>
          <div className="mr-2">
            <Button onClick={() => setShowFilter(!showFilter)} variant="default" type="button">
              <ChevronDown size={16} className="mt-[1px] mr-1" /> Filter
            </Button>
            {showFilter && <Filter isOpened={showFilter} setShowFilter={setShowFilter} />}
          </div>
        </div>
      </div>
      <Table data={bookingData?.docs || []} COLUMNS={COLUMNS} count={count} />
    </div>
  );
};

export default Booking;

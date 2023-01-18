import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Bookings/ViewOrders/Header';
import Overview from '../../components/Bookings/ViewOrders/Overview';
import OrderInfo from '../../components/Bookings/ViewOrders/OrderInformation';
import ProcessPipeline from '../../components/Bookings/ViewOrders/ProcessPipeline';
import { useBookingById, useBookingStats } from '../../hooks/booking.hooks';

const OrderDetails = () => {
  const [pageNumber, setPageNumber] = useState(0);
  const { id } = useParams();

  const { data: bookingData, isLoading } = useBookingById(id, !!id);
  const { data: bookingStats } = useBookingStats('');
  const [updatedBookingData, setUpdatedBookingData] = useState();

  // TODO: wip
  // const currentPrintingStatus = () => {
  //   let printingStatus = null;
  //   let currentStatus = 'Printing Upcoming';
  //   bookingData?.campaign?.spaces?.map(item => {
  //     const statusKeys = Object.keys(item?.printingStatus);
  //     const recentStatus = statusKeys.slice(-1);
  //     if (recentStatus.includes('print')) {
  //       printingStatus = item?.printingStatus;
  //       currentStatus = 'Printing In Progress';
  //     } else if (recentStatus.includes('completed')) {
  //       if (!printingStatus) {
  //         printingStatus = item?.printingStatus;
  //         currentStatus = 'Printing Completed';
  //       }
  //     } else if (!printingStatus) {
  //       printingStatus = item?.printingStatus;
  //     }
  //     console.log(printingStatus);

  //     // setUpdatedBookingData(prevState => ({ ...prevState, printingStatus }));
  //     return printingStatus;
  //   }
  // };

  const currentMountingStatus = useMemo(() => {
    let mountCount = 0;
    const totalSpaces = bookingData?.campaign?.spaces?.length;
    bookingData?.campaign?.spaces?.map(item => {
      if (item?.currentStatus?.mountingStatus?.toLowerCase()?.includes('mount')) {
        mountCount += 1;
      }
      return mountCount;
    });

    return mountCount === 0
      ? 'Mounting upcoming'
      : mountCount > 0 && mountCount < totalSpaces
      ? 'Mounting in progress'
      : mountCount === totalSpaces
      ? 'Mounting completed'
      : '-';
  }, [bookingData]);

  useEffect(() => {
    setUpdatedBookingData(bookingData);
  }, [bookingData]);

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto">
      <Header
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        bookingId={id}
        bookingData={bookingData}
      />
      {pageNumber === 0 ? (
        <OrderInfo
          bookingData={bookingData}
          isLoading={isLoading}
          bookingStats={bookingStats}
          printStatus=""
          mountStatus={currentMountingStatus}
        />
      ) : pageNumber === 1 ? (
        <ProcessPipeline
          bookingData={updatedBookingData}
          printStatus=""
          mountStatus={currentMountingStatus}
        />
      ) : (
        <Overview bookingData={bookingData} />
      )}
    </div>
  );
};

export default OrderDetails;

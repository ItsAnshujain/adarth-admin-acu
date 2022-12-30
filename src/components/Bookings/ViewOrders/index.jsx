import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import Overview from './Overview';
import OrderInfo from './OrderInformation';
import ProcessPipeline from './ProcessPipeline';
import { useBookingById, useBookingStats } from '../../../hooks/booking.hooks';

const Main = () => {
  const [pageNumber, setPageNumber] = useState(0);
  const { id } = useParams();

  const { data: bookingData, isLoading } = useBookingById(id, !!id);
  const { data: bookingStats } = useBookingStats('');

  const currentPrintingStatus = useMemo(() => {
    let printCount = 0;
    const totalSpaces = bookingData?.campaign?.spaces?.length;
    bookingData?.campaign?.spaces?.map(item => {
      if (item?.currentStatus?.printingStatus?.toLowerCase()?.includes('print')) {
        printCount += 1;
      }
      return printCount;
    });

    return printCount === 0
      ? 'Printing upcoming'
      : printCount > 0 && printCount < totalSpaces
      ? 'Printing in progress'
      : printCount === totalSpaces
      ? 'Printing completed'
      : '-';
  }, [bookingData]);

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

  return (
    <>
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
          printStatus={currentPrintingStatus}
          mountStatus={currentMountingStatus}
        />
      ) : pageNumber === 1 ? (
        <ProcessPipeline
          bookingData={bookingData}
          printStatus={currentPrintingStatus}
          mountStatus={currentMountingStatus}
        />
      ) : (
        <Overview bookingData={bookingData} />
      )}
    </>
  );
};

export default Main;

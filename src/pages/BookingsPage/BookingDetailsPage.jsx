import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/modules/bookings/ViewOrders/Header';
import Overview from '../../components/modules/bookings/ViewOrders/Overview';
import OrderInformation from '../../components/modules/bookings/ViewOrders/OrderInformation';
import ProcessPipeline from '../../components/modules/bookings/ViewOrders/ProcessPipeline';
import { useBookingById, useBookingStats } from '../../apis/queries/booking.queries';

const BookingDetailsPage = () => {
  const [pageNumber, setPageNumber] = useState(0);
  const { id } = useParams();

  const { data: bookingData, isLoading } = useBookingById(id, !!id);
  const { data: bookingStats } = useBookingStats('');
  const [updatedBookingData, setUpdatedBookingData] = useState();

  useEffect(() => {
    setUpdatedBookingData(bookingData);
  }, [bookingData]);

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 border-l border-gray-450 overflow-y-auto px-5">
      <Header
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        bookingId={id}
        bookingData={bookingData}
      />
      {pageNumber === 0 ? (
        <OrderInformation
          bookingData={bookingData}
          isLoading={isLoading}
          bookingStats={bookingStats}
          bookingId={id}
        />
      ) : pageNumber === 1 ? (
        <ProcessPipeline bookingData={updatedBookingData} />
      ) : (
        <Overview bookingData={bookingData} isLoading={isLoading} />
      )}
    </div>
  );
};

export default BookingDetailsPage;

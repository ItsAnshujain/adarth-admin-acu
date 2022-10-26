import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import Overview from './Overview';
import OrderInfo from './OrderInformation';
import ProcessPipeline from './ProcessPipeline';
import { useBookingById } from '../../../hooks/booking.hooks';

// TODO:Add count prop to Booking to send it to table
const Main = () => {
  const [pageNumber, setPageNumber] = useState(0);
  const { id } = useParams();

  const { data: bookingData } = useBookingById(id, !!id);
  return (
    <>
      <Header pageNumber={pageNumber} setPageNumber={setPageNumber} />
      {pageNumber === 0 ? (
        <OrderInfo bookingData={bookingData} />
      ) : pageNumber === 1 ? (
        <ProcessPipeline bookingData={bookingData} />
      ) : (
        <Overview bookingData={bookingData} />
      )}
    </>
  );
};

export default Main;

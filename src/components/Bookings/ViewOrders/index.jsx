import { useState } from 'react';
import Header from './Header';
import Overview from './Overview';
import OrderInfo from './OrderInformation';
import ProcessPipeline from './ProcessPipeline';

// TODO:Add count prop to Booking to send it to table
const Main = () => {
  const [pageNumber, setPageNumber] = useState(0);

  return (
    <>
      <Header pageNumber={pageNumber} setPageNumber={setPageNumber} />
      {pageNumber === 0 ? <OrderInfo /> : pageNumber === 1 ? <ProcessPipeline /> : <Overview />}
    </>
  );
};

export default Main;

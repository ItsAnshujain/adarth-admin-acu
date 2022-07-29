import { useState } from 'react';
import Header from './SpaceDetailsHeader';
import Booking from './Booking';
import BasicInfo from './BasicInformation';

const Main = () => {
  const [isBooking, setIsBooking] = useState(false);
  const [isUnderMaintenance, setIsUnderMaintenance] = useState(false);

  return (
    <>
      <Header
        isUnderMaintenance={isUnderMaintenance}
        setIsUnderMaintenance={setIsUnderMaintenance}
        isBooking={isBooking}
        setIsBooking={setIsBooking}
      />
      {isBooking ? <BasicInfo /> : <Booking />}
    </>
  );
};

export default Main;

import { useState } from 'react';
import Header from './SpaceDetailsHeader';
import Booking from './Booking';
import BasicInfo from './BasicInformation';

// TODO:Add count prop to Booking to send it to table
const Main = () => {
  const [isBasicInfo, setIsBasicInfo] = useState(true);
  const [isUnderMaintenance, setIsUnderMaintenance] = useState(false);

  return (
    <>
      <Header
        isUnderMaintenance={isUnderMaintenance}
        setIsUnderMaintenance={setIsUnderMaintenance}
        isBasicInfo={isBasicInfo}
        setIsBasicInfo={setIsBasicInfo}
      />
      {isBasicInfo ? <BasicInfo /> : <Booking />}
    </>
  );
};

export default Main;

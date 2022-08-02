import { useState } from 'react';
import Header from './SpaceDetailsHeader';
import Booking from './Booking';
import BasicInfo from './BasicInformation';

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

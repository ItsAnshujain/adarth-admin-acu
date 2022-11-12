import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import SpacesList from './SpacesList';
import TotalBookings from './TotalBookings';
import sp from '../../../Dummydata/CAMPAIGN_SPACES.json';
import column from './columnSpaceList';
import bookingdata from '../../../Dummydata/BOOKING_DATA.json';
import bookingColumn from './columnTotalBooking';
import Preview from '../AddCampaign/Preview';

import { useCampaign } from '../../../hooks/campaigns.hooks';

const View = () => {
  const [tabs, setTabs] = useState(0);
  const { id } = useParams();
  const { data } = useCampaign(id);

  const getTabs = () =>
    tabs === 0 ? (
      <Preview data={data} />
    ) : tabs === 1 ? (
      <SpacesList data={sp} columns={column} />
    ) : (
      <TotalBookings data={bookingdata} columns={bookingColumn} />
    );

  return (
    <>
      <Header tabs={tabs} setTabs={setTabs} />
      <div className="relative pb-12 mb-16">{getTabs()}</div>
    </>
  );
};

export default View;

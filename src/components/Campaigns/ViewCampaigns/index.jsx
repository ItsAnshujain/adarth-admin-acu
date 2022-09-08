import { useState } from 'react';
import Header from './Header';
import PreviewCampaign from '../../shared/Preview';
import SpacesList from './SpacesList';
import TotalBookings from './TotalBookings';
import data from '../../../Dummydata/CAMPAIGN_SPACES.json';
import column from './columnSpaceList';
import bookingdata from '../../../Dummydata/BOOKING_DATA.json';
import bookingColumn from './columnTotalBooking';

const View = () => {
  const [tabs, setTabs] = useState(0);

  const getTabs = () =>
    tabs === 0 ? (
      <PreviewCampaign />
    ) : tabs === 1 ? (
      <SpacesList data={data} columns={column} />
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

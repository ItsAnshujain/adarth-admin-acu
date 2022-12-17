import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Header from './Header';
import SpacesList from './SpacesList';
import TotalBookings from './TotalBookings';
import column from './columnSpaceList';
import bookingColumn from './columnTotalBooking';
import Preview from '../AddCampaign/Preview';

import { useCampaign } from '../../../hooks/campaigns.hooks';

const View = () => {
  const [tabs, setTabs] = useState(0);
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams({
    page: 1,
    limit: 10,
    sortBy: 'name',
    sortOrder: 'desc',
  });

  const { data } = useCampaign({ id, query: searchParams.toString() }, tabs === 0);

  useEffect(() => {
    if (tabs === 0) {
      searchParams.set('sortBy', 'name');
      setSearchParams(searchParams);
    }
  }, [tabs]);

  const getTabs = () =>
    tabs === 0 ? (
      <Preview data={data?.campaign} place={data?.inventory} />
    ) : tabs === 1 ? (
      <SpacesList data={data?.inventory} columns={column} />
    ) : (
      <TotalBookings campaignId={id} columns={bookingColumn} />
    );

  return (
    <>
      <Header tabs={tabs} setTabs={setTabs} />
      <div className="relative pb-12 mb-16">{getTabs()}</div>
    </>
  );
};

export default View;

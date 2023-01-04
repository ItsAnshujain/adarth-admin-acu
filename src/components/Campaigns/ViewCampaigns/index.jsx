import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Header from './Header';
import SpacesList from './SpacesList';
import TotalBookings from './TotalBookings';
import Overview from './Overview';
import { useCampaign } from '../../../hooks/campaigns.hooks';

const campaignView = {
  overview: Overview,
  spaces: SpacesList,
  bookings: TotalBookings,
};

const View = () => {
  const [tabs, setTabs] = useState('overview');
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams({
    page: 1,
    limit: 10,
    sortBy: 'name',
    sortOrder: 'desc',
  });

  const { data, isLoading } = useCampaign(
    { id, query: searchParams.toString() },
    tabs === 'overview' || tabs === 'spaces',
  );

  const TabView = campaignView[tabs];

  useEffect(() => {
    if (tabs === 'overview') {
      searchParams.set('sortBy', 'name');
      setSearchParams(searchParams);
    }
  }, [tabs, data]);

  return (
    <>
      <Header tabs={tabs} setTabs={setTabs} />
      <div className="relative pb-12 mb-16">
        <TabView
          campaignData={data?.campaign}
          spacesData={data?.inventory}
          campaignId={id}
          isCampaignDataLoading={isLoading}
        />
      </div>
    </>
  );
};

export default View;

import { useState, useEffect } from 'react';
import { Tabs } from '@mantine/core';
import { useParams, useSearchParams } from 'react-router-dom';
import { useFetchUsersById } from '../../../hooks/users.hooks';
import ManagingCampaignSubHeader from './ManagingSubHeader';
import OverviewUserDetails from './OverviewUserDetails';
import BookingTableView from './BookingTableView';
import ProposalTableView from './ProposalTableView';
import { useBookings } from '../../../hooks/booking.hooks';
import { useFetchProposals } from '../../../hooks/proposal.hooks';

const tableBookingQueries = userId => ({
  'page': 1,
  'limit': 10,
  'sortBy': 'createdAt',
  'sortOrder': 'desc',
  'incharge': userId,
});

const tableProposalQueries = userId => ({
  'page': 1,
  'limit': 10,
  'sortBy': 'createdAt',
  'sortOrder': 'desc',
  'userId': userId,
});

const Header = () => {
  const [activeTab, setActiveTab] = useState('first');
  const [activeTable, setActiveTable] = useState('booking');
  const { id: userId } = useParams();
  const { data: userDetails, isLoading: isUserDetailsLoading } = useFetchUsersById(userId);
  const initialBookingValue = tableBookingQueries(userId);
  const initalProposalValue = tableProposalQueries(userId);

  const [bookingSearchParams, setBookingSearchParams] = useSearchParams(initialBookingValue);
  const [proposalSearchParams, setProposalSearchParams] = useSearchParams(initalProposalValue);

  const { data: bookingData = {}, isLoading: isLoadingBookingData } = useBookings(
    bookingSearchParams.toString(),
    activeTable === 'booking',
  );

  const { data: proposalsData = {}, isLoading: isLoadingProposalsData } = useFetchProposals(
    proposalSearchParams.toString(),
    activeTable === 'proposal',
  );

  const handleTabChange = val => {
    setActiveTable(val);

    const defaultBookingValue = new URLSearchParams(initialBookingValue);
    const defaultProposalValue = new URLSearchParams(initalProposalValue);
    if (val === 'booking') {
      bookingSearchParams.delete('userId');
      setBookingSearchParams(defaultBookingValue);
    } else if (val === 'proposal') {
      proposalSearchParams.delete('incharge');
      setProposalSearchParams(defaultProposalValue);
    }
  };

  useEffect(() => {
    // TODO: fix this to reduce one extra api call
    if (activeTable === 'booking') {
      bookingSearchParams.delete('userId');
      setBookingSearchParams(bookingSearchParams);
    }
  }, []);

  return (
    <Tabs value={activeTab} onTabChange={setActiveTab}>
      <Tabs.List className="h-[60px] relative">
        <Tabs.Tab className="text-base hover:bg-transparent" value="first">
          Overview
        </Tabs.Tab>
        <Tabs.Tab className="text-base hover:bg-transparent" value="second">
          Managing
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="first">
        <OverviewUserDetails
          userDetails={userDetails}
          isUserDetailsLoading={isUserDetailsLoading}
        />
      </Tabs.Panel>
      <Tabs.Panel value="second">
        <ManagingCampaignSubHeader
          activeTable={activeTable}
          userId={userId}
          counts={{
            bookings: bookingData?.totalDocs || 0,
            proposals: proposalsData?.totalDocs || 0,
          }}
        />
        <div>
          <Tabs value={activeTable} onTabChange={handleTabChange}>
            <Tabs.List className="h-16">
              <Tabs.Tab className="hover:bg-transparent text-base" value="booking">
                Bookings
              </Tabs.Tab>
              <Tabs.Tab className="hover:bg-transparent text-base" value="proposal">
                Proposals
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="booking">
              <BookingTableView data={bookingData} isLoading={isLoadingBookingData} />
            </Tabs.Panel>
            <Tabs.Panel value="proposal" className="mr-5">
              <ProposalTableView
                viewType={activeTable === 'proposal'}
                userId={userId}
                data={proposalsData}
                isLoading={isLoadingProposalsData}
              />
            </Tabs.Panel>
          </Tabs>
        </div>
      </Tabs.Panel>
    </Tabs>
  );
};

export default Header;

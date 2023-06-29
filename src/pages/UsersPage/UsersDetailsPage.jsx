import { useState, useEffect } from 'react';
import { Tabs } from '@mantine/core';
import { useParams, useSearchParams } from 'react-router-dom';
import { useFetchUsersById } from '../../apis/queries/users.queries';
import ManagingCampaignSubHeader from '../../components/modules/users/View/ManagingSubHeader';
import OverviewUserDetails from '../../components/modules/users/View/OverviewUserDetails';
import BookingTableView from '../../components/modules/users/View/BookingTableView';
import ProposalTableView from '../../components/modules/users/View/ProposalTableView';
import { useBookings } from '../../apis/queries/booking.queries';
import { useFetchProposals } from '../../apis/queries/proposal.queries';

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

const UsersDetailsPage = () => {
  const [activeParentTab, setActiveParentTab] = useState('overview');
  const [activeChildTab, setActiveChildTab] = useState('booking');
  const { id: userId } = useParams();
  const { data: userDetails, isLoading: isUserDetailsLoading } = useFetchUsersById(userId);
  const initialBookingValue = tableBookingQueries(userId);
  const initalProposalValue = tableProposalQueries(userId);

  const [bookingSearchParams, setBookingSearchParams] = useSearchParams(initialBookingValue);
  const [proposalSearchParams, setProposalSearchParams] = useSearchParams(initalProposalValue);

  const { data: bookingData = {}, isLoading: isLoadingBookingData } = useBookings(
    bookingSearchParams.toString(),
    activeParentTab === 'managing' && activeChildTab === 'booking',
  );

  const { data: proposalsData = {}, isLoading: isLoadingProposalsData } = useFetchProposals(
    proposalSearchParams.toString(),
    activeParentTab === 'managing' && activeChildTab === 'proposal',
  );

  const handleChildTab = val => {
    setActiveChildTab(val);

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
    if (setActiveChildTab === 'booking') {
      bookingSearchParams.delete('userId');
      setBookingSearchParams(bookingSearchParams);
    }
  }, []);

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 border-l border-gray-450 overflow-y-auto">
      <Tabs value={activeParentTab} onTabChange={setActiveParentTab}>
        <Tabs.List className="h-[60px] relative">
          <Tabs.Tab className="text-base hover:bg-transparent" value="overview">
            Overview
          </Tabs.Tab>
          <Tabs.Tab className="text-base hover:bg-transparent" value="managing">
            Managing
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="overview">
          <OverviewUserDetails
            userDetails={userDetails}
            isUserDetailsLoading={isUserDetailsLoading}
          />
        </Tabs.Panel>
        <Tabs.Panel value="managing">
          <ManagingCampaignSubHeader activeChildTab={activeChildTab} userId={userId} />
          <div>
            <Tabs value={activeChildTab} onTabChange={handleChildTab}>
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
                  viewType={setActiveChildTab === 'proposal'}
                  userId={userId}
                  data={proposalsData}
                  isLoading={isLoadingProposalsData}
                />
              </Tabs.Panel>
            </Tabs>
          </div>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default UsersDetailsPage;

import { useState, useEffect } from 'react';
import { Tabs } from '@mantine/core';
import { useParams, useSearchParams } from 'react-router-dom';
import { useFetchUsersById } from '../../../hooks/users.hooks';
import ManagingCampaignSubHeader from './ManagingSubHeader';
import OverviewUserDetails from './OverviewUserDetails';
import BookingTableView from './BookingTableView';
import ProposalTableView from './ProposalTableView';
import { useBookings } from '../../../hooks/booking.hooks';
import { serialize } from '../../../utils';
import { useFetchProposals } from '../../../hooks/proposal.hooks';

const tableQueries = userId => ({
  'page': 1,
  'limit': 10,
  'sortBy': 'createdAt',
  'sortOrder': 'desc',
  'incharge': userId,
});

const Header = () => {
  const [activeTab, setActiveTab] = useState('first');
  const [activeTable, setActiveTable] = useState('booking');
  const { id: userId } = useParams();
  const { data: userDetails, isLoading: isUserDetailsLoading } = useFetchUsersById(userId);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialValue = tableQueries(userId);
  const [bookingsPagination, setBookingsPagination] = useState(initialValue);

  const [proposalPagination, setProposalPagination] = useState(initialValue);

  const { data: bookingData = {}, isLoading: isLoadingBookingData } = useBookings(
    serialize(bookingsPagination),
  );

  const { data: proposalsData = {}, isLoading: isLoadingProposalsData } = useFetchProposals(
    serialize(proposalPagination),
  );

  const resetUrl = () => {
    searchParams.forEach((_, key) => {
      searchParams.delete(key);
    });
    setSearchParams(searchParams);
  };

  const handleTabChange = val => {
    setActiveTable(val);
    if (activeTab === 'booking') {
      setBookingsPagination(initialValue);
    } else if (activeTab === 'proposal') {
      setProposalPagination(initialValue);
    }
    resetUrl();
  };

  useEffect(() => {
    const obj = {};
    searchParams.forEach((val, key) => {
      obj[key] = val;
    });

    if (activeTable === 'booking') {
      setBookingsPagination(p => ({ ...p, ...obj }));
    } else if (activeTable === 'proposal') {
      setProposalPagination(p => ({ ...p, ...obj }));
    }
  }, [activeTable, searchParams]);

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
              <BookingTableView
                data={bookingData}
                isLoading={isLoadingBookingData}
                setPagination={setBookingsPagination}
              />
            </Tabs.Panel>
            <Tabs.Panel value="proposal" className="mr-5">
              <ProposalTableView
                viewType={activeTable === 'proposal'}
                userId={userId}
                data={proposalsData}
                isLoading={isLoadingProposalsData}
                setPagination={setProposalPagination}
              />
            </Tabs.Panel>
          </Tabs>
        </div>
      </Tabs.Panel>
    </Tabs>
  );
};

export default Header;

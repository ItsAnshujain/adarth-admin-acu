import { useState } from 'react';
import { Tabs } from '@mantine/core';
import { useParams } from 'react-router-dom';
import { useFetchUsersById } from '../../../hooks/users.hooks';
import ManagingCampaignSubHeader from './ManagingSubHeader';
import OverviewUserDetails from './OverviewUserDetails';
import CampaignTableView from './CampaignTableView';
import ProposalTableView from './ProposalTableView';

const Header = () => {
  const [activeTab, setActiveTab] = useState('first');
  const [activeTable, setActiveTable] = useState('campaign');
  const { id: userId } = useParams();
  const { data: userDetails, isLoading: isUserDetailsLoading } = useFetchUsersById(userId);

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
        <ManagingCampaignSubHeader activeTable={activeTable} />
        <div>
          <Tabs value={activeTable} onTabChange={setActiveTable}>
            <Tabs.List className="h-16">
              <Tabs.Tab className="hover:bg-transparent text-base" value="campaign">
                Campaign
              </Tabs.Tab>
              <Tabs.Tab className="hover:bg-transparent text-base" value="proposal">
                Proposals
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="campaign">
              <CampaignTableView />
            </Tabs.Panel>
            <Tabs.Panel value="proposal" className="mr-5">
              <ProposalTableView />
            </Tabs.Panel>
          </Tabs>
        </div>
      </Tabs.Panel>
    </Tabs>
  );
};

export default Header;

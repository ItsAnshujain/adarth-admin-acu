import { Button, Switch, Tabs } from '@mantine/core';
import { ArrowLeft } from 'react-feather';
import { useNavigate, useParams } from 'react-router-dom';
import { useToggle } from '@mantine/hooks';
import { useState } from 'react';
import Booking from './Booking';
import BasicInfo from './BasicInformation';

// TODO:Add count prop to Booking to send it to table
const Main = () => {
  const navigate = useNavigate();
  const { id: inventoryId } = useParams();
  const [isUnderMaintenance, toggle] = useToggle(false);
  const [activeTab, setActiveTab] = useState('basic-info');

  const handleBack = () => navigate('/inventory');
  const handleEditDetails = () => navigate(`/inventory/edit-details/${inventoryId}`);

  return (
    <Tabs value={activeTab} onTabChange={setActiveTab}>
      <Tabs.List className="flex items-center justify-between">
        <div className="flex items-center">
          <Button onClick={handleBack} className="mr-4">
            <ArrowLeft color="#000" />
          </Button>
          <Tabs.Tab value="basic-info" className="py-6 px-3 text-lg">
            Basic Information
          </Tabs.Tab>
          <Tabs.Tab value="booking" className="py-6 px-3 text-lg">
            Booking
          </Tabs.Tab>
        </div>
        <div className="flex pr-7">
          {activeTab === 'basic-info' ? (
            <div className="flex items-center pr-7">
              <p className="text-lg mr-3">Under maintenance</p>
              <Switch checked={isUnderMaintenance} onClick={() => toggle()} size="xl" />
            </div>
          ) : null}
          <Button onClick={handleEditDetails} className="bg-purple-450" size="md">
            Edit Space
          </Button>
        </div>
      </Tabs.List>

      <Tabs.Panel value="basic-info" pt="xs">
        <BasicInfo />
      </Tabs.Panel>
      <Tabs.Panel value="booking" pt="xs">
        <Booking />
      </Tabs.Panel>
    </Tabs>
  );
};

export default Main;

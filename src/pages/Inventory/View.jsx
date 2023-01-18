import { Button, Switch, Tabs } from '@mantine/core';
import { ArrowLeft } from 'react-feather';
import { useNavigate, useParams } from 'react-router-dom';
import { useToggle } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import Booking from '../../components/Inventory/ViewSpace/Booking';
import BasicInfo from '../../components/Inventory/ViewSpace/BasicInformation';
import { useFetchInventoryById, useUpdateInventory } from '../../hooks/inventory.hooks';

const SpaceDetails = () => {
  const navigate = useNavigate();
  const { id: inventoryId } = useParams();
  const [isUnderMaintenance, toggle] = useToggle();
  const [activeTab, setActiveTab] = useState('basic-info');

  const { data: inventoryDetails } = useFetchInventoryById(inventoryId, !!inventoryId);
  const { mutate: update, isLoading: isUpdateInventoryLoading } = useUpdateInventory();

  const handleBack = () => navigate('/inventory');
  const handleEditDetails = () => navigate(`/inventory/edit-details/${inventoryId}`);
  const onUpdateMaintenance = toggleValue => {
    toggle(toggleValue);
    if (inventoryId) {
      const data = { isUnderMaintenance: toggleValue };
      update({ inventoryId, data });
    }
  };

  useEffect(() => {
    // current maintenance state
    if (inventoryDetails?.isUnderMaintenance) {
      toggle(inventoryDetails.isUnderMaintenance);
    }
  }, [inventoryDetails]);

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto">
      <Tabs value={activeTab} onTabChange={setActiveTab}>
        <Tabs.List className="flex items-center justify-between">
          <div className="flex items-center">
            <Button onClick={handleBack} className="mr-4">
              <ArrowLeft color="#000" />
            </Button>
            <Tabs.Tab value="basic-info" className="px-3 text-lg h-[60px]">
              Basic Information
            </Tabs.Tab>
            <Tabs.Tab value="booking" className="px-3 text-lg h-[60px]">
              Booking
            </Tabs.Tab>
          </div>
          {activeTab === 'basic-info' ? (
            <div className="flex pr-7">
              <div className="flex items-center pr-7">
                <p className="text-lg mr-3">Under maintenance</p>
                <Switch
                  checked={isUnderMaintenance}
                  onChange={e => onUpdateMaintenance(e.currentTarget.checked)}
                  size="xl"
                  disabled={isUpdateInventoryLoading}
                />
              </div>
              <Button onClick={handleEditDetails} className="bg-purple-450 rounded-md">
                Edit Space
              </Button>
            </div>
          ) : null}
        </Tabs.List>

        <Tabs.Panel value="basic-info" pt="xs">
          <BasicInfo />
        </Tabs.Panel>
        <Tabs.Panel value="booking" pt="xs">
          <Booking inventoryId={inventoryId} />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default SpaceDetails;

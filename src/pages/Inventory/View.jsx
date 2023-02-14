import { Button, Switch, Tabs } from '@mantine/core';
import { ArrowLeft } from 'react-feather';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useToggle } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import Booking from '../../components/Inventory/ViewSpace/Booking';
import BasicInfo from '../../components/Inventory/ViewSpace/BasicInformation';
import OperationalCost from '../../components/Inventory/ViewSpace/OperationalCost';
import { useFetchInventoryById, useUpdateInventory } from '../../hooks/inventory.hooks';

const SpaceDetails = () => {
  const navigate = useNavigate();
  const { id: inventoryId } = useParams();
  const [isUnderMaintenance, toggle] = useToggle();
  const [activeTab, setActiveTab] = useState('basic-info');

  const { data: inventoryDetails, isLoading: isInventoryDetailsLoading } = useFetchInventoryById(
    inventoryId,
    !!inventoryId,
  );
  const { mutate: update, isLoading: isUpdateInventoryLoading } = useUpdateInventory();

  const handleBack = () => navigate('/inventory');
  const onUpdateMaintenance = toggleValue => {
    toggle(toggleValue);
    if (inventoryId) {
      const data = { isUnderMaintenance: toggleValue };
      update({ inventoryId, data });
    }
  };

  useEffect(() => {
    // current maintenance state
    if (inventoryDetails?.inventory?.isUnderMaintenance) {
      toggle(inventoryDetails?.inventory.isUnderMaintenance);
    }
  }, [inventoryDetails?.inventory]);

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
            <Tabs.Tab value="operational-cost" className="px-3 text-lg h-[60px]">
              Operational Cost
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
              <div>
                <Link
                  to={`/inventory/edit-details/${inventoryId}`}
                  className="bg-purple-450 flex items-center text-white rounded-md px-4 h-full font-bold text-sm"
                >
                  Edit Space
                </Link>
              </div>
            </div>
          ) : null}
        </Tabs.List>

        <Tabs.Panel value="basic-info" pt="xs">
          <BasicInfo
            inventoryDetails={inventoryDetails?.inventory}
            isInventoryDetailsLoading={isInventoryDetailsLoading}
            operationalCost={inventoryDetails?.operationalCost}
            totalCompletedBooking={inventoryDetails?.totalCompletedBooking}
            totalOccupancy={inventoryDetails?.totalOccupancy}
            totalRevenue={inventoryDetails?.totalRevenue}
          />
        </Tabs.Panel>
        <Tabs.Panel value="booking" pt="xs">
          <Booking inventoryId={inventoryId} />
        </Tabs.Panel>
        <Tabs.Panel value="operational-cost" pt="xs">
          <OperationalCost inventoryDetails={inventoryDetails?.inventory} />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default SpaceDetails;

import { ActionIcon, Box, Button, Group } from '@mantine/core';
import { useModals } from '@mantine/modals';
import React from 'react';
import { Edit } from 'react-feather';
import toIndianCurrency from '../../../utils/currencyFormat';
import modalConfig from '../../../utils/modalConfig';
import AddOperationalCostModal from './AddOperationalCostModal';

// TOOD: integration left
const OperationalCost = ({ inventoryDetails }) => {
  const modals = useModals();
  const handleOperationalCost = () =>
    modals.openContextModal('basic', {
      title: 'Add Operational Cost',
      innerProps: {
        modalBody: <AddOperationalCostModal />,
      },
      ...modalConfig,
    });

  return (
    <div className="px-5 py-2 bg-red-20 ">
      <p className="font-medium text-lg">View Operational Cost</p>

      <div className="border border-gray-300 mt-4 rounded-md">
        <Group className="p-3 mb-3 border-b border-black  bg-slate-200 ">
          <p className="font-medium">Space Name: {inventoryDetails?.basicInformation?.spaceName}</p>
          <p>Operational Cost</p>
        </Group>
        <div className="p-5">
          <div className="min-h-[400px] max-h-[400px] overflow-y-auto ">
            {Array.from({ length: 10 }, () => (
              <Box className="py-3 border-b border-black flex justify-between pl-5 pr-10">
                <Group>
                  <ActionIcon onClick={handleOperationalCost}>
                    <Edit className="text-black" />
                  </ActionIcon>
                  <p>lorem</p>
                </Group>
                <p>{toIndianCurrency(Math.random())}</p>
              </Box>
            ))}
          </div>
          <p className="py-3 font-medium">Total: {toIndianCurrency(0)}</p>
          <Group position="right">
            <Button className="primary-button" onClick={handleOperationalCost}>
              Add Operational Cost
            </Button>
          </Group>
        </div>
      </div>
    </div>
  );
};

export default OperationalCost;

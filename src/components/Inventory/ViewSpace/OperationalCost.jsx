import { ActionIcon, Box, Button, Group, Loader } from '@mantine/core';
import { useModals } from '@mantine/modals';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { Edit } from 'react-feather';
import { useParams } from 'react-router-dom';
import { useFetchOperationalCost } from '../../../hooks/operationalCost.hooks';
import toIndianCurrency from '../../../utils/currencyFormat';
import modalConfig from '../../../utils/modalConfig';
import AddOperationalCostModal from './AddOperationalCostModal';

const DATE_FORMAT = 'DD-MM-YYYY';

const OperationalCost = ({ inventoryDetails }) => {
  const modals = useModals();
  const { id: inventoryId } = useParams();
  const { data: operationaCostData, isLoading } = useFetchOperationalCost(inventoryId);

  const handleOperationalCost = (_, costId, type, amount, description, date) =>
    modals.openContextModal('basic', {
      title: `${costId ? 'Edit' : 'Add'} Operational Cost`,
      innerProps: {
        modalBody: (
          <AddOperationalCostModal
            inventoryId={inventoryId}
            onClose={id => modals.closeModal(id)}
            costId={costId}
            type={type}
            amount={amount}
            description={description}
            date={date}
          />
        ),
      },
      ...modalConfig,
    });

  const totalAmount = useMemo(() => {
    const result = operationaCostData?.reduce((acc, item) => acc + +item.amount || 0, 0);
    return result;
  }, [operationaCostData]);

  return (
    <div className="px-5 py-2 bg-red-20 ">
      <p className="font-medium text-lg">View Operational Cost</p>

      {isLoading ? (
        <Loader className="mx-auto mt-20" />
      ) : (
        <div className="border border-gray-300 mt-4 rounded-md">
          <Group className="p-3 mb-3 border-b border-black  bg-slate-200 ">
            <p className="font-medium">
              Space Name: {inventoryDetails?.basicInformation?.spaceName}
            </p>
          </Group>
          <div className="p-5">
            <div className="min-h-[400px] max-h-[400px] overflow-y-auto ">
              {operationaCostData?.length ? (
                operationaCostData.map(item => (
                  <Box
                    key={item?._id}
                    className="py-3 border-b border-black flex justify-between pl-5 pr-10"
                  >
                    <Group align="flex-start">
                      <ActionIcon
                        onClick={e =>
                          handleOperationalCost(
                            e,
                            item?._id,
                            item?.type,
                            item?.amount,
                            item?.description,
                            item?.date,
                          )
                        }
                      >
                        <Edit className="text-black" />
                      </ActionIcon>
                      <div>
                        <p className="font-medium">{item?.type?.name}</p>
                        <p className="text-xs">Created at:</p>
                        <p className="text-xs text-gray-500 font-medium">
                          {item?.date ? dayjs(item.date).format(DATE_FORMAT) : null}
                        </p>
                      </div>
                    </Group>
                    <p>{toIndianCurrency(item?.amount)}</p>
                  </Box>
                ))
              ) : (
                <p className="text-center text-lg">No records found</p>
              )}
            </div>
            <p className="py-3 font-medium">Total: {toIndianCurrency(totalAmount ?? 0)}</p>
            <Group position="right">
              <Button className="primary-button" onClick={handleOperationalCost}>
                Add Operational Cost
              </Button>
            </Group>
          </div>
        </div>
      )}
    </div>
  );
};

export default OperationalCost;

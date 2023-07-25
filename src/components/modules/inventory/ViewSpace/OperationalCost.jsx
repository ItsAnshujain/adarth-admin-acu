import { ActionIcon, Box, Button, Group, Loader } from '@mantine/core';
import { useModals } from '@mantine/modals';
import React, { useMemo } from 'react';
import { Edit } from 'react-feather';
import { useParams, useSearchParams } from 'react-router-dom';
import { useFetchOperationalCost } from '../../../../apis/queries/operationalCost.queries';
import toIndianCurrency from '../../../../utils/currencyFormat';
import modalConfig from '../../../../utils/modalConfig';
import AddOperationalCostModal from './AddOperationalCostModal';

const OperationalCost = ({ inventoryDetails, isPeer }) => {
  const modals = useModals();
  const [searchParams] = useSearchParams();
  const { id: inventoryId } = useParams();
  const { data: operationaCostData, isLoading } = useFetchOperationalCost(inventoryId);
  const bookingIdFromUrl = searchParams.get('bookingId');

  const handleOperationalCost = (
    _,
    costId,
    type,
    amount,
    description,
    year,
    month,
    day,
    bookingId,
  ) =>
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
            bookingId={bookingId}
            bookingIdFromUrl={bookingIdFromUrl}
            year={year}
            month={month}
            day={day}
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
    <div>
      <p className="font-medium text-lg">View Operational Cost</p>

      {isLoading ? (
        <Loader className="mx-auto mt-20" />
      ) : (
        <div className="border border-gray-300 mt-4 rounded-md">
          <Group className="p-3 border-b border-black  bg-slate-200">
            <p className="font-medium">
              Space Name: {inventoryDetails?.basicInformation?.spaceName}
            </p>
          </Group>
          <div className="">
            <div className="min-h-[400px] max-h-[400px] overflow-y-auto px-3">
              {operationaCostData?.length ? (
                operationaCostData.map(item => (
                  <Box
                    key={item?._id}
                    className="py-3 border-b border-black flex justify-between pl-5 pr-10"
                  >
                    <div className="flex">
                      {!isPeer ? (
                        <ActionIcon
                          onClick={e =>
                            handleOperationalCost(
                              e,
                              item?._id,
                              item?.type,
                              item?.amount,
                              item?.description,
                              item?.year,
                              item?.month,
                              item?.day,
                              item?.bookingId,
                            )
                          }
                        >
                          <Edit className="text-black" />
                        </ActionIcon>
                      ) : null}

                      <div className="ml-3">
                        <p className="font-medium">{item?.type?.name}</p>
                        <p className="font-light text-sm w-[80%] mb-1 text-gray-500">
                          {item?.description}
                        </p>
                        <p className="text-xs mb-1">Created at:</p>
                        <p className="text-xs text-gray-500 font-medium">
                          {item?.day || 'NA'}/{item?.month || 'NA'}/{item?.year}
                        </p>
                      </div>
                    </div>
                    <p>{toIndianCurrency(item?.amount)}</p>
                  </Box>
                ))
              ) : (
                <p className="text-center text-lg py-5">No records found</p>
              )}
            </div>
            <p className="p-3 font-medium text-end">Total: {toIndianCurrency(totalAmount ?? 0)}</p>
            {!isPeer ? (
              <Group position="right" className="px-3 pb-3">
                <Button className="primary-button" onClick={handleOperationalCost}>
                  Add Operational Cost
                </Button>
              </Group>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default OperationalCost;

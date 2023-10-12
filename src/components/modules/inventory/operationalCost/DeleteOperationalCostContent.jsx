import { Button, Divider, Image } from '@mantine/core';
import { useModals } from '@mantine/modals';
import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import CheckIcon from '../../../../assets/check.svg';
import TrashIcon from '../../../../assets/trash.svg';
import { useDeleteOperationalCost } from '../../../../apis/queries/operationalCost.queries';

const DeleteOperationalCostContent = ({ onClickCancel = () => {}, itemId }) => {
  const modals = useModals();
  const queryClient = useQueryClient();
  const [accept, setAccept] = useState(false);
  const deleteOperationalCost = useDeleteOperationalCost();

  const handleConfirm = () =>
    deleteOperationalCost.mutate(itemId, {
      onSuccess: () => {
        queryClient.invalidateQueries(['operational-cost']);
        setAccept(true);
        setTimeout(() => modals.closeModal(), 2000);
      },
    });

  return (
    <>
      <Divider />
      <div className="flex flex-col justify-evenly items-center min-h-[230px]">
        <Image src={!accept ? TrashIcon : CheckIcon} height={65} width={65} />
        <p className="font-bold text-2xl">
          {!accept ? 'Are you sure you want to delete?' : 'Deleted successfully'}
        </p>
        {!accept ? (
          <div className="flex gap-2  justify-end">
            <Button
              onClick={onClickCancel}
              className="bg-black text-white rounded-md text-sm px-8 py-3"
              disabled={deleteOperationalCost.isLoading}
            >
              No
            </Button>
            <Button
              className="primary-button"
              onClick={handleConfirm}
              loading={deleteOperationalCost.isLoading}
              disabled={deleteOperationalCost.isLoading}
            >
              Yes
            </Button>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default DeleteOperationalCostContent;

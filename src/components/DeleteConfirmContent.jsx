import { Divider, Image } from '@mantine/core';
import React from 'react';

import CheckIcon from '../assets/check.svg';
import TrashIcon from '../assets/trash.svg';

const DeleteConfirmContent = ({ onClickCancel = () => {}, setIsConfirmed = () => {} }) => {
  const [accept, setAccept] = React.useState(false);

  const handleConfirm = () => {
    setAccept(true);
    setIsConfirmed(true);
  };

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
            <button
              onClick={onClickCancel}
              type="button"
              className="bg-black text-white rounded-md text-sm px-8 py-3"
            >
              No
            </button>
            <button
              type="button"
              className="bg-purple-450 text-white rounded-md text-sm px-8 py-3"
              onClick={handleConfirm}
            >
              Yes
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default DeleteConfirmContent;

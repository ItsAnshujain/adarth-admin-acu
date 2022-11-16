import { Button } from '@mantine/core';
import { useState } from 'react';
import { Plus } from 'react-feather';
import Modal from './InputModal';

const Header = ({ text }) => {
  const [opened, setOpened] = useState(false);
  const toggleAddModal = () => setOpened(!opened);

  return (
    <>
      <div className="h-[60px] border-b border-gray-450 flex justify-between items-center pr-7">
        <div className="pl-5">
          <p className="text-lg font-bold">{text}</p>
        </div>
        <Button
          onClick={toggleAddModal}
          className="bg-purple-450 flex align-center py-2 text-white rounded-md px-4 text-sm"
        >
          <Plus size={16} className="mt-[1px] mr-1" /> Add {text}
        </Button>
      </div>
      <Modal opened={opened} setOpened={setOpened} />
    </>
  );
};

export default Header;

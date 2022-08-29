import { useState } from 'react';
import { Text } from '@mantine/core';
import { Plus } from 'react-feather';
import Modal from './InputModal';

const Header = ({ text }) => {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <div className="h-20 border-b border-gray-450 flex justify-between items-center pr-7">
        <div className="pl-5">
          <Text size="lg" weight="bold">
            {text}
          </Text>
        </div>
        <button
          onClick={() => setOpened(true)}
          variant="default"
          className="bg-purple-450 flex align-center py-2 text-white rounded-md px-4 text-sm"
          type="button"
        >
          <Plus size={16} className="mt-[1px] mr-1" /> Add {text}
        </button>
      </div>
      <Modal opened={opened} setOpened={setOpened} />
    </>
  );
};

export default Header;

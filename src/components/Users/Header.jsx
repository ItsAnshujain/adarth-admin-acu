import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Text, Button } from '@mantine/core';
import { Plus, ChevronDown } from 'react-feather';
import Filter from '../Filter';

const AreaHeader = ({ text }) => {
  const navigate = useNavigate();

  const [showFilter, setShowFilter] = useState(false);

  return (
    <div className="h-20 border-b border-gray-450 flex justify-between items-center">
      <div className="pl-5">
        <Text size="lg" weight="bold">
          {text}
        </Text>
      </div>
      <div className="flex justify-around mr-7">
        <div className="mr-2">
          <Button onClick={() => setShowFilter(!showFilter)} variant="default" type="button">
            <ChevronDown size={16} className="mt-[1px] mr-1" /> Filter
          </Button>
          {showFilter && <Filter isOpened={showFilter} setShowFilter={setShowFilter} />}
        </div>
        <div className="relative">
          <button
            onClick={() => {
              navigate('create-user');
            }}
            variant="default"
            className="bg-purple-450 flex align-center py-2 text-white rounded-md px-4"
            type="button"
          >
            <Plus size={16} className="mt-[1px] mr-1" /> Add User
          </button>
        </div>
      </div>
    </div>
  );
};

export default AreaHeader;

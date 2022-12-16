import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Select } from '@mantine/core';
import { Plus, ChevronDown } from 'react-feather';
import Filter from './Filter';

const styles = {
  rightSection: { pointerEvents: 'none' },
};

const AreaHeader = ({ setFilter = () => {}, filter }) => {
  const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false);
  const toggleFilter = () => setShowFilter(!showFilter);
  const handleFilter = val => setFilter(val?.toLowerCase());
  const handleNavigate = () => navigate('create-user');

  return (
    <div className="h-[60px] border-b border-gray-450 flex justify-between items-center">
      <div className="pl-5">
        <Select
          value={filter.charAt(0).toUpperCase() + filter.slice(1)}
          onChange={handleFilter}
          data={['Team', 'Peer']}
          styles={styles}
          rightSection={<ChevronDown size={16} className="mt-[1px] mr-1" />}
        />
      </div>
      <div className="flex justify-around mr-7">
        <div className="mr-2">
          <Button onClick={toggleFilter} variant="default">
            <ChevronDown size={16} className="mt-[1px] mr-1" /> Filter
          </Button>
          {showFilter && <Filter isOpened={showFilter} setShowFilter={setShowFilter} />}
        </div>
        <div className="relative">
          <Button
            onClick={handleNavigate}
            className="bg-purple-450 flex align-center py-2 text-white rounded-md px-4"
          >
            <Plus size={16} className="mt-[1px] mr-1" /> Add User
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AreaHeader;

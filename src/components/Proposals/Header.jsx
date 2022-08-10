import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Text, Button } from '@mantine/core';
import down from '../../assets/down.svg';
import add from '../../assets/add.svg';
import Filter from '../Filter';

const Header = ({ text }) => {
  const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false);
  return (
    <div className="h-20 border-b border-gray-450 flex justify-between items-center pl-5 pr-5">
      <Text weight="bold" size="md">
        {text}
      </Text>
      <div className="mr-2 flex gap-2">
        <Button
          onClick={() => setShowFilter(!showFilter)}
          variant="default"
          type="button"
          className="font-medium"
        >
          <img className="mr-2" src={down} alt="down" /> Filter
        </Button>
        {showFilter && <Filter isOpened={showFilter} setShowFilter={setShowFilter} />}

        <button
          onClick={() => navigate('create-proposals')}
          variant="default"
          className="bg-purple-450 flex align-center py-2 text-white rounded-md px-4"
          type="button"
        >
          <img className="inline mr-1" src={add} alt="Add" /> Create Proposals
        </button>
      </div>
    </div>
  );
};

export default Header;

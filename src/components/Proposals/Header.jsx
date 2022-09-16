import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import classNames from 'classnames';
import { Text, Button } from '@mantine/core';
import { Plus, ChevronDown, Server, Grid } from 'react-feather';
import Filter from './Filter';

const initialState = {
  grid: { fill: true },
  list: { fill: false },
  map: { fill: true },
};

const Header = ({ text, setView }) => {
  const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false);
  const [color, setColor] = useState(initialState);

  const handleListClick = () => {
    setColor({
      grid: { fill: true },
      list: { fill: false },
      map: { fill: true },
    });
    setView('list');
  };

  const handleGridClick = () => {
    setColor({
      grid: { fill: false },
      list: { fill: true },
      map: { fill: true },
    });
    setView('grid');
  };

  return (
    <div className="h-20 border-b border-gray-450 flex justify-between items-center pl-5 pr-5">
      <Text weight="bold" size="md">
        {text}
      </Text>
      <div className="mr-2 flex gap-2">
        <div className="flex">
          <button
            className={classNames(
              `px-4 border-gray-300 border rounded-md ${color.list.fill ? 'bg-white' : 'bg-black'}`,
            )}
            onClick={handleListClick}
            type="button"
          >
            <Server
              strokeWidth="3px"
              className={`max-h-5 ${classNames(color.list.fill ? 'text-black' : 'text-white')}`}
            />
          </button>
          <button
            className={classNames(
              `text-white border-gray-300 border px-4 rounded-md ${
                color.grid.fill ? 'bg-white' : 'bg-black'
              }`,
            )}
            onClick={handleGridClick}
            type="button"
          >
            <Grid
              strokeWidth="3px"
              className={`max-h-5 ${classNames(color.grid.fill ? 'text-black' : 'text-white')}`}
            />
          </button>
        </div>
        <Button
          onClick={() => setShowFilter(!showFilter)}
          variant="default"
          type="button"
          className="font-medium"
        >
          <ChevronDown size={16} className="mt-[1px] mr-1" /> Filter
        </Button>
        {showFilter && <Filter isOpened={showFilter} setShowFilter={setShowFilter} />}

        <button
          onClick={() => navigate('create-proposals')}
          className="bg-purple-450 flex align-center py-2 text-white rounded-md px-4"
          type="button"
        >
          <Plus size={16} className="mt-[1px] mr-1" /> Create Proposals
        </button>
      </div>
    </div>
  );
};

export default Header;

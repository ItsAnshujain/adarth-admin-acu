import { useState } from 'react';
import { Text, Button } from '@mantine/core';
import add from '../assets/add.svg';
import down from '../assets/down.svg';
import calendar from '../assets/data-table.svg';
import Grid from '../assets/Icons/Grid';
import List from '../assets/Icons/Server';
import DateRange from './DateRange';
import Filter from './Filter';

const initialState = {
  grid: { stroke: false, fill: true },
  list: { stroke: true, fill: false },
};
const AreaHeader = ({ text, setView }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [color, setColor] = useState(initialState);
  const handleListClick = () => {
    setColor({
      grid: { stroke: false, fill: true },
      list: { stroke: true, fill: false },
    });
    setView('list');
  };

  const handleGridClick = () => {
    setColor({
      grid: { stroke: true, fill: false },
      list: { stroke: false, fill: true },
    });
    setView('grid');
  };

  const openDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  return (
    <div className="h-20 border-b border-gray-450 flex justify-between items-center">
      <div className="pl-5">
        <Text size="lg" weight="bold">
          {text}
        </Text>
      </div>
      <div className="flex justify-around mr-7">
        <div className="mr-2 flex align-center">
          <button
            className={`px-4 border-gray-300 border rounded-md ${
              color.list.fill ? 'bg-white' : 'bg-black'
            }`}
            onClick={handleListClick}
            variant="default"
            type="button"
          >
            <List
              fill={color.list.stroke ? 'black' : 'white'}
              stroke={color.list.fill ? 'black' : 'white'}
            />
          </button>
          <button
            className={`text-white border-gray-300 border px-4 rounded-md ${
              color.grid.fill ? 'bg-white' : 'bg-black'
            }`}
            onClick={handleGridClick}
            variant="default"
            type="button"
          >
            <Grid
              fill={color.grid.fill ? 'white' : 'black'}
              stroke={color.grid.stroke ? 'white' : 'black'}
            />
          </button>
        </div>
        <div className="mr-2 relative">
          <Button onClick={openDatePicker} variant="default" type="button">
            <img src={calendar} className="h-5" alt="calendar" />
          </Button>
          {showDatePicker && (
            <div className="absolute z-20 -translate-x-1/2 bg-white -top-0.3">
              <DateRange handleClose={openDatePicker} />
            </div>
          )}
        </div>
        <div className="mr-2">
          <Button onClick={() => setShowFilter(!showFilter)} variant="default" type="button">
            <img className="mr-2" src={down} alt="down" /> Filter
          </Button>
          {showFilter && <Filter isOpened={showFilter} setShowFilter={setShowFilter} />}
        </div>
        <div>
          <button
            variant="default"
            className="bg-purple-450 flex align-center py-2 text-white rounded-md px-4"
            type="button"
          >
            <img className="inline" src={add} alt="Add" /> Add Space
          </button>
        </div>
      </div>
    </div>
  );
};

export default AreaHeader;

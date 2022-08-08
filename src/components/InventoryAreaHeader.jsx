import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Text, Button } from '@mantine/core';
import classNames from 'classnames';
import add from '../assets/add.svg';
import down from '../assets/down.svg';
import calendar from '../assets/data-table.svg';
import Map from '../assets/Icons/Map';
import Grid from '../assets/Icons/Grid';
import List from '../assets/Icons/List';
import DateRange from './DateRange';
import Filter from './Filter';

const initialState = {
  grid: { stroke: false, fill: true },
  list: { stroke: true, fill: false },
  map: { stroke: false, fill: true },
};
const AreaHeader = ({ text, setView, selectAll, setSelectAll }) => {
  const [addDetailsClicked, setAddDetails] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [color, setColor] = useState(initialState);
  const handleListClick = () => {
    setColor({
      grid: { stroke: false, fill: true },
      list: { stroke: true, fill: false },
      map: { stroke: false, fill: true },
    });
    setView('list');
  };

  const handleGridClick = () => {
    setColor({
      grid: { stroke: true, fill: false },
      list: { stroke: false, fill: true },
      map: { stroke: false, fill: true },
    });
    setView('grid');
  };

  const handleMapClick = () => {
    setColor({
      grid: { stroke: false, fill: true },
      list: { stroke: false, fill: true },
      map: { stroke: true, fill: false },
    });
    setView('map');
  };

  const openDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const btnList = classNames({
    'px-4': true,
    'border-gray-300': true,
    border: true,
    'rounded-md': true,
    'bg-white': color.list.fill,
    'bg-black': !color.list.fill,
  });

  const btnGrid = classNames({
    'text-white': true,
    'border-gray-300': true,
    'border': true,
    'px-4': true,
    'rounded-md': true,
    'bg-white': color.grid.fill,
    'bg-black': !color.grid.fill,
  });

  const btnMap = classNames({
    'text-white': true,
    'border-gray-300': true,
    'border': true,
    'px-4': true,
    'rounded-md': true,
    'bg-white': color.map.fill,
    'bg-black': !color.map.fill,
  });

  return (
    <div className="h-20 border-b border-gray-450 flex justify-between items-center">
      <div className="pl-5">
        <Text size="lg" weight="bold">
          {text}
        </Text>
      </div>
      <div className="flex justify-around mr-7">
        {color.grid.stroke && (
          <div className="mr-4 text-gray-400 flex items-center justify-center">
            <Text size="sm" className="mr-2">
              Select All Product
            </Text>
            <input type="checkbox" checked={selectAll} onChange={() => setSelectAll(!selectAll)} />
          </div>
        )}
        <div className="mr-2 flex ">
          <button className={btnList} onClick={handleListClick} variant="default" type="button">
            <List
              fill={color.list.fill ? 'white' : 'black'}
              stroke={color.list.stroke ? 'white' : 'black'}
            />
          </button>
          <button className={btnGrid} onClick={handleGridClick} variant="default" type="button">
            <Grid
              fill={color.grid.fill ? 'white' : 'black'}
              stroke={color.grid.stroke ? 'white' : 'black'}
            />
          </button>
          <button className={btnMap} onClick={handleMapClick} variant="default" type="button">
            <Map
              fill={color.map.fill ? 'white' : 'black'}
              stroke={color.map.stroke ? 'white' : 'black'}
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
        <div className="relative">
          <button
            onClick={() => setAddDetails(!addDetailsClicked)}
            variant="default"
            className="bg-purple-450 flex align-center py-2 text-white rounded-md px-4"
            type="button"
          >
            <img className="inline" src={add} alt="Add" /> Add Space
          </button>
          {addDetailsClicked && (
            <div className="absolute text-sm z-20 bg-white shadow-lg px-2 right-7  w-36 py-4">
              <Link to="create-space">
                <div className="mb-2 cursor-pointer">Single Entry</div>
              </Link>
              <div className="cursor-pointer">Bulk/CSV Upload</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AreaHeader;

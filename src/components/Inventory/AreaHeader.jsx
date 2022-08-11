import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Text, Button } from '@mantine/core';
import classNames from 'classnames';
import { Plus, ChevronDown, Server, Grid, MapPin } from 'react-feather';
import calendar from '../../assets/data-table.svg';
import DateRange from '../DateRange';
import Filter from '../Filter';

const initialState = {
  grid: { fill: true },
  list: { fill: false },
  map: { fill: true },
};

const AreaHeader = ({ text, setView, selectAll, setSelectAll }) => {
  const [addDetailsClicked, setAddDetails] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
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

  const handleMapClick = () => {
    setColor({
      grid: { fill: true },
      list: { fill: true },
      map: { fill: false },
    });
    setView('map');
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
        {color.grid.stroke && (
          <div className="mr-4 text-gray-400 flex items-center justify-center">
            <Text size="sm" className="mr-2">
              Select All Product
            </Text>
            <input type="checkbox" checked={selectAll} onChange={() => setSelectAll(!selectAll)} />
          </div>
        )}
        <div className="mr-2 flex ">
          <button
            className={classNames(
              `px-4 border-gray-300 border rounded-md ${color.list.fill ? 'bg-white' : 'bg-black'}`,
            )}
            onClick={handleListClick}
            variant="default"
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
            variant="default"
            type="button"
          >
            <Grid
              strokeWidth="3px"
              className={`max-h-5 ${classNames(color.grid.fill ? 'text-black' : 'text-white')}`}
            />
          </button>
          <button
            className={classNames(
              `px-4 border-gray-300 border rounded-md ${color.map.fill ? 'bg-white' : 'bg-black'}`,
            )}
            onClick={handleMapClick}
            variant="default"
            type="button"
          >
            <MapPin
              strokeWidth="3px"
              className={`max-h-5 ${classNames(color.map.fill ? 'text-black' : 'text-white')}`}
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
          <Button
            onClick={() => setShowFilter(!showFilter)}
            variant="default"
            type="button"
            className="font-medium"
          >
            <ChevronDown size={16} className="mt-[1px] mr-1" /> Filter
          </Button>
          {showFilter && <Filter isOpened={showFilter} setShowFilter={setShowFilter} />}
        </div>
        <div className="relative">
          <button
            onClick={() => setAddDetails(!addDetailsClicked)}
            variant="default"
            className="bg-purple-450 flex align-center py-2 text-white rounded-md px-4 text-sm"
            type="button"
          >
            <Plus size={16} className="mt-[1px] mr-1" /> Add Space
          </button>
          {addDetailsClicked && (
            <div className="absolute text-sm z-20 bg-white shadow-lg p-4 right-7 w-36">
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

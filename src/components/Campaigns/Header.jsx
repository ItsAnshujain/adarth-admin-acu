import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mantine/core';
import classNames from 'classnames';
import { Plus, ChevronDown, Server, Grid } from 'react-feather';
import { useClickOutside } from '@mantine/hooks';
import calendar from '../../assets/data-table.svg';
import DateRange from '../DateRange';
import Filter from '../Filter';

const initialState = {
  grid: { fill: true },
  list: { fill: false },
};

const AreaHeader = ({ text, setView }) => {
  const navigate = useNavigate();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [color, setColor] = useState(initialState);
  const ref = useClickOutside(() => setShowDatePicker(false));

  const handleListClick = () => {
    setColor({
      grid: { fill: true },
      list: { fill: false },
    });
    setView('list');
  };

  const handleGridClick = () => {
    setColor({
      grid: { fill: false },
      list: { fill: true },
    });
    setView('grid');
  };

  const openDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  return (
    <div className="h-[60px] border-b border-gray-450 flex justify-between items-center">
      <div className="pl-5">
        <p className="text-lg text-bold">{text}</p>
      </div>
      <div className="flex justify-around mr-7">
        <div className="mr-2 flex ">
          <button
            className={classNames(
              `px-4 border-gray-300 border rounded-md ${color.list.fill ? 'bg-white' : 'bg-black'}`,
            )}
            onClick={handleListClick}
            type="button"
          >
            <Server
              strokeWidth="3px"
              className={`h-5 ${classNames(color.list.fill ? 'text-black' : 'text-white')}`}
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
              className={`h-5 ${classNames(color.grid.fill ? 'text-black' : 'text-white')}`}
            />
          </button>
        </div>
        <div ref={ref} className="mr-2 relative">
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
            onClick={() => {
              navigate('create-campaign');
            }}
            className="bg-purple-450 flex align-center py-2 text-white rounded-md px-4"
            type="button"
          >
            <Plus size={16} className="mt-[1px] mr-1" /> Add Campaign
          </button>
        </div>
      </div>
    </div>
  );
};

export default AreaHeader;

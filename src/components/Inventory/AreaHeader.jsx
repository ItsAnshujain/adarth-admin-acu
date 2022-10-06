import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Text, Button, Image } from '@mantine/core';
import classNames from 'classnames';
import { Plus, ChevronDown, Server, Grid, MapPin } from 'react-feather';
import { useClickOutside } from '@mantine/hooks';
import calendar from '../../assets/data-table.svg';
import DateRange from '../DateRange';
import Filter from '../Filter';
import useLayoutView from '../../store/layout.store';

const AreaHeader = ({ text }) => {
  const { pathname } = useLocation();
  const [addDetailsClicked, setAddDetails] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const dateRef = useClickOutside(() => setShowDatePicker(false));
  const addDetailsButtonRef = useClickOutside(() => setAddDetails(false));

  const { activeLayout, setActiveLayout } = useLayoutView(state => ({
    activeLayout: state.activeLayout,
    setActiveLayout: state.setActiveLayout,
  }));

  const handleListClick = () => setActiveLayout('list');
  const handleGridClick = () => setActiveLayout('grid');
  const handleMapClick = () => setActiveLayout('map');

  const openDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  return (
    <div className="h-20 border-b border-gray-450 flex justify-between items-center">
      <div className="pl-5">
        <Text size="lg" weight="bold">
          {!pathname.includes('reports') ? text : 'Inventory Report'}
        </Text>
      </div>
      <div className="flex justify-around mr-7">
        {!pathname.includes('reports') && (
          <div className="mr-2 flex ">
            <Button
              className={classNames(
                `px-4 border-gray-300 border rounded-md ${
                  activeLayout === 'list' ? 'bg-black' : 'bg-white'
                }`,
              )}
              onClick={handleListClick}
            >
              <Server
                strokeWidth="3px"
                className={`max-h-5 ${classNames(
                  activeLayout === 'list' ? 'text-white' : 'text-black',
                )}`}
              />
            </Button>
            <Button
              className={classNames(
                `text-white border-gray-300 border px-4 rounded-md ${
                  activeLayout === 'grid' ? 'bg-black' : 'bg-white'
                }`,
              )}
              onClick={handleGridClick}
            >
              <Grid
                strokeWidth="3px"
                className={`max-h-5 ${classNames(
                  activeLayout === 'grid' ? 'text-white' : 'text-black',
                )}`}
              />
            </Button>
            <Button
              className={classNames(
                `px-4 border-gray-300 border rounded-md ${
                  activeLayout === 'map' ? 'bg-black' : 'bg-white'
                }`,
              )}
              onClick={handleMapClick}
            >
              <MapPin
                strokeWidth="3px"
                className={`max-h-5 ${classNames(
                  activeLayout === 'map' ? 'text-white' : 'text-black',
                )}`}
              />
            </Button>
          </div>
        )}
        <div ref={dateRef} className="mr-2 relative">
          <Button onClick={openDatePicker} variant="default" type="button">
            <Image src={calendar} height={20} alt="calendar" />
          </Button>
          {showDatePicker && (
            <div className="absolute z-20 -translate-x-2/3 bg-white -top-0.3">
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
        {!pathname.includes('reports') && (
          <div className="relative">
            <Button
              onClick={() => setAddDetails(!addDetailsClicked)}
              className="bg-purple-450 flex align-center py-2 text-white rounded-md px-4 text-sm"
            >
              <Plus size={16} className="mt-[1px] mr-1" /> Add Space
            </Button>
            {addDetailsClicked && (
              <div
                ref={addDetailsButtonRef}
                className="absolute text-sm z-20 bg-white shadow-lg p-4 right-7 w-36"
              >
                <Link to="create-space/single">
                  <div className="mb-2 cursor-pointer">Single Entry</div>
                </Link>
                <Link to="create-space/bulk">
                  <div className="cursor-pointer">Bulk/CSV Upload</div>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AreaHeader;

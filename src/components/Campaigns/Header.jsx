import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mantine/core';
import classNames from 'classnames';
import { Plus, ChevronDown, Server, Grid } from 'react-feather';
import shallow from 'zustand/shallow';
import { useClickOutside } from '@mantine/hooks';
import calendar from '../../assets/data-table.svg';
import DateRange from '../DateRange';
import CampaignFilter from './Filter';
import useLayoutView from '../../store/layout.store';

const AreaHeader = ({ text }) => {
  const navigate = useNavigate();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const ref = useClickOutside(() => setShowDatePicker(false));
  const { activeLayout, setActiveLayout } = useLayoutView(
    state => ({
      activeLayout: state.activeLayout,
      setActiveLayout: state.setActiveLayout,
    }),
    shallow,
  );

  const handleListClick = () => setActiveLayout({ ...activeLayout, campaign: 'list' });
  const handleGridClick = () => setActiveLayout({ ...activeLayout, campaign: 'grid' });
  const toggleFilter = () => setShowFilter(!showFilter);
  const toggleDatePicker = () => setShowDatePicker(!showDatePicker);
  const handleCreateCampaign = () => navigate('create-campaign');

  return (
    <div className="h-[60px] border-b border-gray-450 flex justify-between items-center">
      <div className="pl-5">
        <p className="text-lg text-bold">{text}</p>
      </div>
      <div className="flex justify-around mr-7">
        <div className="mr-2 flex ">
          <Button
            className={classNames(
              `px-4 border-gray-300 border rounded-md ${
                activeLayout.campaign === 'grid' ? 'bg-white' : 'bg-purple-450'
              }`,
            )}
            onClick={handleListClick}
          >
            <Server
              strokeWidth="3px"
              className={`max-h-5 ${classNames(
                activeLayout.campaign === 'grid' ? 'text-black' : 'text-white',
              )}`}
            />
          </Button>
          <Button
            className={classNames(
              `text-white border-gray-300 border px-4 rounded-md ${
                activeLayout.campaign === 'list' ? 'bg-white' : 'bg-purple-450'
              }`,
            )}
            onClick={handleGridClick}
          >
            <Grid
              strokeWidth="3px"
              className={`max-h-5 ${classNames(
                activeLayout.campaign === 'list' ? 'text-black' : 'text-white',
              )}`}
            />
          </Button>
        </div>
        <div ref={ref} className="mr-2 relative">
          <Button onClick={toggleDatePicker} variant="default">
            <img src={calendar} className="h-5" alt="calendar" />
          </Button>
          {showDatePicker && (
            <div className="absolute z-20 -translate-x-1/2 bg-white -top-0.3">
              <DateRange handleClose={toggleDatePicker} />
            </div>
          )}
        </div>
        <div className="mr-2">
          <Button onClick={toggleFilter} variant="default" className="font-medium">
            <ChevronDown size={16} className="mt-[1px] mr-1" /> Filter
          </Button>
          {showFilter && <CampaignFilter isOpened={showFilter} onClose={toggleFilter} />}
        </div>
        <div className="relative">
          <Button
            onClick={handleCreateCampaign}
            className="bg-purple-450 flex align-center py-2 text-white rounded-md px-4"
          >
            <Plus size={16} className="mt-[1px] mr-1" /> Add Campaign
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AreaHeader;

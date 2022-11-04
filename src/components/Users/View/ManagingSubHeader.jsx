import React, { useState } from 'react';
import { ChevronDown, Plus } from 'react-feather';
import { Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import calendar from '../../../assets/data-table.svg';
import DateRange from '../../DateRange';
import greenfolder from '../../../assets/ongoing.svg';
import purplefolder from '../../../assets/completed.svg';
import orangefolder from '../../../assets/upcoming.svg';
import redfolder from '../../../assets/redfolder.svg';
import bluefolder from '../../../assets/bluefolder.svg';
import ProposalFilter from '../../Proposals/Filter';

const ManagingSubHeader = ({ activeTable }) => {
  const navigate = useNavigate();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const toggleDatePicker = () => setShowDatePicker(!showDatePicker);
  const handleCreateProposal = () => navigate('/proposals/create-proposals');

  return (
    <div>
      <div className="h-20 border-b flex justify-between items-center pl-5 pr-7">
        <p className="font-bold">Managing Campaign</p>
        <div className="flex">
          <div className="mr-2 relative">
            <Button onClick={toggleDatePicker} variant="default" type="button">
              <img src={calendar} className="h-5" alt="calendar" />
            </Button>
            {showDatePicker && (
              <div className="absolute z-20 -translate-x-1/2 bg-white -top-0.3">
                <DateRange handleClose={toggleDatePicker} />
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
            {/* TODO:add campaign filter */}
            {showFilter && activeTable === 'proposal' && (
              <ProposalFilter isOpened={showFilter} setShowFilter={setShowFilter} />
            )}
          </div>
          {activeTable === 'proposal' && (
            <div className="mr-2">
              <Button
                variant="default"
                onClick={handleCreateProposal}
                className="font-medium bg-purple-450 text-white"
              >
                <Plus className="h-4" />
                Add Proposal
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="pl-5 pr-7 flex justify-between mt-8 mb-8">
        <div className="flex gap-3  flex-wrap">
          <div className="border rounded p-8  pr-20">
            <img src={purplefolder} alt="folder" />
            <p className="my-2 text-slate-400 text-sm">Ongoing Orders</p>
            <p>0</p>
          </div>
          <div className="border rounded p-8 pr-20">
            <img src={orangefolder} alt="folder" />
            <p className="my-2 text-slate-400 text-sm">Upcoming Orders</p>
            <p>0</p>
          </div>
          <div className="border rounded p-8 pr-20">
            <img src={bluefolder} alt="folder" />
            <p className="my-2 text-slate-400 text-sm">Completed Orders</p>
            <p>0</p>
          </div>
          <div className="border rounded p-8 pr-20">
            <img src={redfolder} alt="folder" />
            <p className="my-2 text-slate-400 text-sm">Total Proposal</p>
            <p>0</p>
          </div>
          <div className="border rounded p-8 pr-20">
            <img src={greenfolder} alt="folder" />
            <p className="my-2 text-slate-400 text-sm">Total Campaign</p>
            <p>0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagingSubHeader;

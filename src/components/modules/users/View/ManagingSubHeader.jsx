import React, { useState } from 'react';
import { ChevronDown, Plus } from 'react-feather';
import { Button, Image } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { useClickOutside } from '@mantine/hooks';
import calendar from '../../../../assets/data-table.svg';
import DateRange from '../../../DateRange';
import OngoingOrdersIcon from '../../../../assets/ongoing-orders.svg';
import CompletedOrdersIcon from '../../../../assets/completed-orders.svg';
import UpcomingOrdersIcon from '../../../../assets/upcoming-orders.svg';
import ProposalSentIcon from '../../../../assets/proposal-sent.svg';
import BookingsIcon from '../../../../assets/total-bookings.svg';
import ProposalFilter from '../../proposals/Filter';
import BookingFilter from '../../bookings/Filter';
import { useBookingStatByIncharge } from '../../../../apis/queries/booking.queries';
import { serialize } from '../../../../utils';

const ManagingSubHeader = ({ activeChildTab, userId }) => {
  const navigate = useNavigate();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const ref = useClickOutside(() => setShowDatePicker(false));
  const { data: bookingStatsByIncharge } = useBookingStatByIncharge(
    serialize({ inCharge: userId }),
  );
  const toggleFilter = () => setShowFilter(!showFilter);
  const toggleDatePicker = () => setShowDatePicker(!showDatePicker);
  const handleCreateProposal = () => navigate('/proposals/create-proposals');

  return (
    <div>
      <div className="h-20 border-b flex justify-between items-center pl-5 pr-7">
        <p className="font-bold">Managing Bookings &amp; Proposals</p>
        <div className="flex">
          <div ref={ref} className="mr-2 relative">
            <Button onClick={toggleDatePicker} variant="default">
              <img src={calendar} className="h-5" alt="calendar" />
            </Button>
            {showDatePicker && (
              <div
                className={classNames(
                  activeChildTab === 'booking' ? '-translate-x-[460px]' : '-translate-x-1/2',
                  'absolute z-20 bg-white -top-0.3',
                )}
              >
                <DateRange handleClose={toggleDatePicker} dateKeys={['from', 'to']} />
              </div>
            )}
          </div>
          <div className="mr-2">
            <Button onClick={toggleFilter} variant="default" className="font-medium">
              <ChevronDown size={16} className="mt-[1px] mr-1" /> Filter
            </Button>
            {showFilter && activeChildTab === 'booking' && (
              <BookingFilter isOpened={showFilter} setShowFilter={setShowFilter} />
            )}
            {showFilter && activeChildTab === 'proposal' && (
              <ProposalFilter isOpened={showFilter} setShowFilter={setShowFilter} />
            )}
          </div>
          {activeChildTab === 'proposal' && (
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
            <Image src={OngoingOrdersIcon} alt="ongoing" height={24} width={24} fit="contain" />
            <p className="my-2 text-slate-400 text-sm">Ongoing Orders</p>
            <p>{bookingStatsByIncharge?.Ongoing}</p>
          </div>
          <div className="border rounded p-8 pr-20">
            <Image src={UpcomingOrdersIcon} alt="upcoming" height={24} width={24} fit="contain" />
            <p className="my-2 text-slate-400 text-sm">Upcoming Orders</p>
            <p>{bookingStatsByIncharge?.Upcoming}</p>
          </div>
          <div className="border rounded p-8 pr-20">
            <Image src={CompletedOrdersIcon} alt="completed" height={24} width={24} fit="contain" />
            <p className="my-2 text-slate-400 text-sm">Completed Orders</p>
            <p>{bookingStatsByIncharge?.Completed}</p>
          </div>
          <div className="border rounded p-8 pr-20">
            <Image src={ProposalSentIcon} alt="folder" fit="contain" height={24} width={24} />
            <p className="my-2 text-slate-400 text-sm">Total Proposal</p>
            <p>{bookingStatsByIncharge?.totalProposal || 0}</p>
          </div>
          <div className="border rounded p-8 pr-20">
            <Image src={BookingsIcon} alt="folder" fit="contain" height={24} width={24} />
            <p className="my-2 text-slate-400 text-sm">Total Bookings</p>
            <p>{bookingStatsByIncharge?.totalBooking || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagingSubHeader;

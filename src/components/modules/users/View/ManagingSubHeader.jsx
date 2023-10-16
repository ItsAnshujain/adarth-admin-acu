import React from 'react';
import { Image } from '@mantine/core';
import OngoingOrdersIcon from '../../../../assets/ongoing-orders.svg';
import CompletedOrdersIcon from '../../../../assets/completed-orders.svg';
import UpcomingOrdersIcon from '../../../../assets/upcoming-orders.svg';
import ProposalSentIcon from '../../../../assets/proposal-sent.svg';
import BookingsIcon from '../../../../assets/total-bookings.svg';
import { useBookingStatByIncharge } from '../../../../apis/queries/booking.queries';
import { serialize } from '../../../../utils';

const ManagingSubHeader = ({ userId }) => {
  const { data: bookingStatsByIncharge } = useBookingStatByIncharge(
    serialize({ inCharge: userId }),
  );

  return (
    <div>
      <div className="h-20 border-b flex justify-between items-center pl-5 pr-7">
        <p className="font-bold text-lg">Analytics</p>
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

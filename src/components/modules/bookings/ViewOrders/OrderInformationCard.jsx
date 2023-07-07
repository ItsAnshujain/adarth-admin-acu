import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import React from 'react';
import { useParams } from 'react-router-dom';
import { Group } from '@mantine/core';
import toIndianCurrency from '../../../../utils/currencyFormat';
import { DATE_SECOND_FORMAT } from '../../../../utils/constants';
import NoData from '../../../shared/NoData';

const OrderInformationCard = () => {
  const queryClient = useQueryClient();
  const { id: bookingId } = useParams();
  const bookingData = queryClient.getQueryData(['booking-by-id', bookingId]);

  return (
    <div>
      <p className="font-bold text-lg mb-2">Order Info</p>
      <div className="flex p-4 gap-12 border flex-wrap">
        <div>
          <p className="text-slate-400">Order Id</p>
          <p className="font-bold">{bookingData?.bookingId || ''}</p>
        </div>
        <div>
          <p className="text-slate-400">Order Date</p>
          <p className="font-bold">
            {bookingData?.createdAt ? dayjs(bookingData?.createdAt).format('D MMMM  YYYY') : ''}
          </p>
        </div>
        <div>
          <p className="text-slate-400">Price</p>
          <Group className="gap-1">
            <p className="font-bold">{toIndianCurrency(bookingData?.campaign?.price)}</p>
            <p className="text-xs italic">**inclusive of gst</p>
          </Group>
        </div>
        <div>
          <p className="text-slate-400">Start Date</p>
          <p className="font-bold">
            {bookingData?.campaign?.startDate ? (
              dayjs(bookingData.campaign.startDate).format(DATE_SECOND_FORMAT)
            ) : (
              <NoData type="na" />
            )}
          </p>
        </div>
        <div>
          <p className="text-slate-400">End Date</p>
          <p className="font-bold">
            {bookingData?.campaign?.endDate ? (
              dayjs(bookingData.campaign.endDate).format(DATE_SECOND_FORMAT)
            ) : (
              <NoData type="na" />
            )}
          </p>
        </div>
        <div>
          <p className="text-slate-400">Printing Status</p>
          <p className="font-bold capitalize">
            {bookingData?.currentStatus?.printingStatus?.toLowerCase()?.includes('upcoming')
              ? 'Printing upcoming'
              : bookingData?.currentStatus?.printingStatus?.toLowerCase()?.includes('in progress')
              ? 'Printing in progress'
              : bookingData?.currentStatus?.printingStatus?.toLowerCase()?.includes('completed')
              ? 'Printing completed'
              : '-'}
          </p>
        </div>
        <div>
          <p className="text-slate-400">Booking Type</p>
          <p className="font-bold capitalize">{bookingData?.type}</p>
        </div>
        <div>
          <p className="text-slate-400">Mounting Status</p>
          <p className="font-bold capitalize">
            {bookingData?.currentStatus?.mountingStatus?.toLowerCase()?.includes('upcoming')
              ? 'Mounting upcoming'
              : bookingData?.currentStatus?.mountingStatus?.toLowerCase()?.includes('in progress')
              ? 'Mounting in progress'
              : bookingData?.currentStatus?.mountingStatus?.toLowerCase()?.includes('completed')
              ? 'Mounting completed'
              : '-'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderInformationCard;
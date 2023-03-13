import { Fragment, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import StatusNode from './StatusNode';

const ProcessPipeline = ({ bookingData }) => {
  const pipelineList = useMemo(
    () => [
      {
        status: 'Order Processed',
        date: bookingData?.paymentStatus?.Unpaid || bookingData?.paymentStatus?.Paid,
        isSuccess: bookingData?.currentStatus?.paymentStatus?.toLowerCase() === 'unpaid' || 'paid',
        hasRightEdge: false,
      },
      {
        status: 'Order Confirmed',
        date: bookingData?.paymentStatus?.Paid,
        isSuccess: bookingData?.currentStatus?.paymentStatus?.toLowerCase() === 'paid',
        hasRightEdge: false,
      },
      {
        statusArr: [
          {
            status: 'Media Received',
            date: bookingData?.printingStatus?.Upcoming || bookingData?.paymentStatus?.Paid,
            isSuccess:
              (bookingData?.currentStatus?.paymentStatus?.toLowerCase() === 'paid' &&
                bookingData?.campaign?.medias?.length) ||
              bookingData?.currentStatus?.printingStatus?.toLowerCase() === 'in progress' ||
              bookingData?.currentStatus?.printingStatus?.toLowerCase() === 'completed',
          },
          {
            status: 'Sent For Printing',
            date:
              bookingData?.printingStatus?.['In Progress'] ||
              bookingData?.printingStatus?.Completed,
            isSuccess:
              bookingData?.currentStatus?.printingStatus?.toLowerCase() === 'in progress' ||
              bookingData?.currentStatus?.printingStatus?.toLowerCase() === 'completed',
            hasBottomEdge: false,
            className: 'ml-[55px]',
          },
          {
            status: 'Printing Completed',
            date: bookingData?.printingStatus?.Completed,
            isSuccess: bookingData?.currentStatus?.printingStatus?.toLowerCase() === 'completed',
            hasRightEdge: false,
            hasBottomEdge: false,
            className: 'ml-[55px]',
          },
        ],
      },
      {
        statusArr: [
          {
            status: 'Mounting Upcoming',
            date:
              bookingData?.mountingStatus?.Upcoming ||
              bookingData?.mountingStatus?.Mount ||
              bookingData?.printingStatus?.Completed,
            isSuccess:
              (bookingData?.currentStatus?.printingStatus?.toLowerCase() === 'completed' &&
                bookingData?.currentStatus?.mountingStatus?.toLowerCase() === 'upcoming') ||
              bookingData?.currentStatus?.mountingStatus?.toLowerCase() === 'in progress' ||
              bookingData?.currentStatus?.mountingStatus?.toLowerCase() === 'completed',
          },
          {
            status: 'Mounting in Progress',
            date:
              bookingData?.mountingStatus?.['In Progress'] ||
              bookingData?.mountingStatus?.Completed,
            isSuccess:
              bookingData?.currentStatus?.mountingStatus?.toLowerCase() === 'in progress' ||
              bookingData?.currentStatus?.mountingStatus?.toLowerCase() === 'completed',
            hasBottomEdge: false,
            className: 'ml-[55px]',
          },
          {
            status: 'Mounting Completed',
            date: bookingData?.mountingStatus?.Completed,
            isSuccess: bookingData?.currentStatus?.mountingStatus?.toLowerCase() === 'completed',
            hasRightEdge: false,
            hasBottomEdge: false,
            className: 'ml-[55px]',
          },
        ],
      },
      {
        statusArr: [
          {
            status: 'Campaign Upcoming',
            date:
              bookingData?.campaignStatus?.Upcoming ||
              bookingData?.campaignStatus?.Ongoing ||
              bookingData?.mountingStatus?.Completed,
            isSuccess:
              (bookingData?.currentStatus?.mountingStatus?.toLowerCase() === 'completed' &&
                bookingData?.currentStatus?.campaignStatus?.toLowerCase() === 'upcoming') ||
              bookingData?.currentStatus?.campaignStatus?.toLowerCase() === 'ongoing' ||
              bookingData?.currentStatus?.campaignStatus?.toLowerCase() === 'completed',
            hasBottomEdge: false,
          },
          {
            status: 'Campaign Started',
            date: bookingData?.campaignStatus?.Ongoing || bookingData?.campaignStatus?.Completed,
            isSuccess:
              bookingData?.currentStatus?.campaignStatus?.toLowerCase() === 'ongoing' ||
              bookingData?.currentStatus?.campaignStatus?.toLowerCase() === 'completed',
            hasBottomEdge: false,
            className: 'ml-[55px]',
          },
          {
            status: 'Campaign Completed',
            date: bookingData?.campaignStatus?.Completed,
            isSuccess: bookingData?.currentStatus?.campaignStatus?.toLowerCase() === 'completed',
            hasRightEdge: false,
            hasBottomEdge: false,
            className: 'ml-[55px]',
          },
        ],
      },
    ],
    [bookingData],
  );

  return (
    <div className="p-5">
      {pipelineList.map(item => (
        <Fragment key={uuidv4()}>
          {item?.status ? (
            <StatusNode
              status={item.status}
              isSuccess={item?.isSuccess}
              dateAndTime={item?.date}
              hasRightEdge={item?.hasRightEdge}
              hasBottomEdge={item?.hasBottomEdge}
              className={item?.className}
            />
          ) : null}
          <div className="flex flex-row">
            {item?.statusArr?.map(subItem => (
              <StatusNode
                key={uuidv4()}
                status={subItem.status}
                isSuccess={subItem?.isSuccess}
                dateAndTime={subItem?.date}
                hasRightEdge={subItem?.hasRightEdge}
                hasBottomEdge={subItem?.hasBottomEdge}
                className={subItem?.className}
              />
            ))}
          </div>
        </Fragment>
      ))}
    </div>
  );
};

export default ProcessPipeline;

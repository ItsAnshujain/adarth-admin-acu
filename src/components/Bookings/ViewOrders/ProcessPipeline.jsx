import React, { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import StatusNode from './StatusNode';

const ProcessPipeline = () => {
  const pipelineList = useMemo(
    () => [
      {
        status: 'Order Processed',
        date: new Date(),
        hasRightEdge: false,
        isSuccess: true,
      },
      {
        status: 'Order Confirmed',
        date: new Date(),
        hasRightEdge: false,
      },
      {
        statusArr: [
          {
            status: 'Media Received',
            date: new Date(),
          },
          {
            status: 'Sent For Printing',
            date: new Date(),
            hasBottomEdge: false,
            className: 'ml-[55px]',
          },
          {
            status: 'Printing Completed',
            date: new Date(),
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
            date: new Date(),
          },
          {
            status: 'Mounting in Progress',
            date: new Date(),
            hasBottomEdge: false,
            className: 'ml-[55px]',
          },
          {
            status: 'Mounting Completed',
            date: new Date(),
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
            date: new Date(),
            hasBottomEdge: false,
          },
          {
            status: 'Campaign Started',
            date: new Date(),
            hasBottomEdge: false,
            className: 'ml-[55px]',
          },
          {
            status: 'Campaign Completed',
            date: new Date(),
            hasRightEdge: false,
            hasBottomEdge: false,
            className: 'ml-[55px]',
          },
        ],
      },
    ],
    [],
  );

  return (
    <div className="p-5">
      {pipelineList.map(item => (
        <React.Fragment key={uuidv4()}>
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
                status={subItem.status}
                isSuccess={subItem?.isSuccess}
                dateAndTime={subItem?.date}
                hasRightEdge={subItem?.hasRightEdge}
                hasBottomEdge={subItem?.hasBottomEdge}
                className={subItem?.className}
              />
            ))}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProcessPipeline;

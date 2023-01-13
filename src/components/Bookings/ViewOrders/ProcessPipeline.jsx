import { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import StatusNode from './StatusNode';

const ProcessPipeline = () => {
  const pipelineList = useMemo(
    () => [
      {
        id: uuidv4(),
        status: 'Order Processed',
        date: new Date(),
        hasRightEdge: false,
        isSuccess: true,
      },
      {
        id: uuidv4(),
        status: 'Order Confirmed',
        date: new Date(),
        hasRightEdge: false,
      },
      {
        id: uuidv4(),
        statusArr: [
          {
            id: uuidv4(),
            status: 'Media Received',
            date: new Date(),
          },
          {
            id: uuidv4(),
            status: 'Sent For Printing',
            date: new Date(),
            hasBottomEdge: false,
            className: 'ml-[55px]',
          },
          {
            id: uuidv4(),
            status: 'Printing Completed',
            date: new Date(),
            hasRightEdge: false,
            hasBottomEdge: false,
            className: 'ml-[55px]',
          },
        ],
      },
      {
        id: uuidv4(),
        statusArr: [
          {
            id: uuidv4(),
            status: 'Mounting Upcoming',
            date: new Date(),
          },
          {
            id: uuidv4(),
            status: 'Mounting in Progress',
            date: new Date(),
            hasBottomEdge: false,
            className: 'ml-[55px]',
          },
          {
            id: uuidv4(),
            status: 'Mounting Completed',
            date: new Date(),
            hasRightEdge: false,
            hasBottomEdge: false,
            className: 'ml-[55px]',
          },
        ],
      },
      {
        id: uuidv4(),
        statusArr: [
          {
            status: 'Campaign Upcoming',
            date: new Date(),
            hasBottomEdge: false,
          },
          {
            id: uuidv4(),
            status: 'Campaign Started',
            date: new Date(),
            hasBottomEdge: false,
            className: 'ml-[55px]',
          },
          {
            id: uuidv4(),
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
        <>
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
        </>
      ))}
    </div>
  );
};

export default ProcessPipeline;

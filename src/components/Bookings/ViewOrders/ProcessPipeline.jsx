import classNames from 'classnames';
import checkgreen from '../../../assets/check-success.svg';
import checkbw from '../../../assets/check-other.svg';

const test = {
  '2022-06-20': [
    {
      status: 'Successful',
      dateTime: '2022-06-20 7 PM',
      title: 'Order processed',
    },
  ],
  '2022-06-23': [
    {
      status: 'Successful',
      dateTime: '2022-06-25 7 PM',
      title: 'Order Confirmed',
    },
  ],
  '2022-06-25': [
    {
      status: 'Successful',
      dateTime: '2022-06-25 7 PM',
      title: 'Media received',
    },
    {
      status: 'Successful',
      dateTime: '2022-06-25 8 PM',
      title: 'Sent for printing',
    },
    {
      status: 'Successful',
      dateTime: '2022-06-25 8 PM',
      title: 'Printing Complete',
    },
  ],
  '2022-06-27': [
    {
      status: 'Successful',
      dateTime: '2022-06-25 7 PM',
      title: 'Mounting In Progress',
    },
    {
      status: 'Successful',
      dateTime: '2022-06-25 8 PM',
      title: 'Mounting Completed',
    },
  ],
  '2022-06-28': [
    {
      status: 'Ongoing',
      dateTime: '2022-06-25 7 PM',
      title: 'Campaign Started',
    },
  ],
};

const ProcessPipeline = () => (
  <div className="flex flex-col gap-8 pl-5 p7-7 mt-4 mb-10">
    {Object.keys(test).map((data, outerIndex) => (
      <div className="flex gap-8">
        {test[data].map((process, index) => (
          <div className="relative">
            <div
              className={classNames(
                `border rounded-xl p-5 border-slate-200 ${
                  index !== 0
                    ? 'before:content-[""] before:absolute before:h-[1px] before:-left-8 before:w-8 before:top-[50%] before:bg-green-400'
                    : ''
                } ${
                  index === 0 && outerIndex !== Object.keys(test).length - 1
                    ? 'after:content-[""] after:rotate-90 after:absolute after:h-[1px] after:left-24  after:w-8 after:top-[111%] after:bg-green-400'
                    : ''
                }`,
              )}
            >
              <div className="flex gap-3">
                {process.status === 'Successful' ? (
                  <img src={checkgreen} alt="checked" />
                ) : (
                  <img src={checkbw} alt="checked" />
                )}
                <p className="text-xl font-bold">{process.title}</p>
              </div>
              <p
                className={classNames(
                  `text-sm ${
                    process.status === 'Successful' ? 'text-green-500' : 'text-orange-350'
                  } relative left-8 mt-1`,
                )}
              >
                {process.status}
              </p>
              <div className="mt-4 relative left-8">
                <p className="text-sm text-slate-400">Date &amp; Time</p>
                <p className="font-semibold mt-1">{process.dateTime}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    ))}
  </div>
);

export default ProcessPipeline;

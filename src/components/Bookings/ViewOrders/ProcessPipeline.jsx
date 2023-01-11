import classNames from 'classnames';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import checkgreen from '../../../assets/check-success.svg';
// import checkbw from '../../../assets/check-other.svg';

const ProcessPipeline = ({ bookingData = {}, printStatus, mountStatus }) => {
  const steps = useMemo(
    () =>
      ['campaignStatus', 'mountingStatus', 'printingStatus', 'paymentStatus']
        .filter(item => !!bookingData[item])
        .reverse(),
    [bookingData],
  );
  // TODO: wip
  return (
    <div className="flex flex-col gap-8 pl-5 p7-7 mt-4 mb-10">
      {steps?.length || printStatus || mountStatus ? (
        <>
          {steps.map((step, outerIndex) => (
            <div className="flex gap-8">
              {Object.keys(bookingData[step]).map((process, index) => (
                <div className="relative min-w-[220px]">
                  <div
                    className={classNames(
                      index !== 0
                        ? 'before:content-[""] before:absolute before:h-[1px] before:-left-8 before:w-8 before:top-[50%] before:bg-green-400'
                        : '',
                      index === 0 && outerIndex !== steps.length - 1
                        ? 'after:content-[""] after:rotate-90 after:absolute after:h-[1px] after:left-24  after:w-8 after:top-[111%] after:bg-green-400'
                        : '',
                      'border rounded-xl p-5 border-slate-200',
                    )}
                  >
                    <div className="flex gap-3 items-start">
                      <img src={checkgreen} alt="checked" className="mt-1" />
                      <div>
                        <p className="text-xl font-bold">{process.toUpperCase()}</p>
                        <p className="text-green-500 font-medium">Successful</p>
                      </div>
                    </div>
                    <div className="mt-3 relative left-8">
                      <p className="text-sm text-slate-400 font-medium">Date &amp; Time</p>
                      <p className="font-semibold mt-1">
                        {dayjs(bookingData[step][process]).format('YYYY-MM-DD hh a')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
          {[printStatus, mountStatus]
            .filter(item => !!item)
            .map((item, index) => (
              <div className="relative max-w-[220px]">
                <div
                  className={classNames(
                    (steps.length !== 0 && index === 0) || index === 1
                      ? 'after:content-[""] after:rotate-90 after:absolute after:h-[1px] after:left-24  after:w-8 after:top-[-10%] after:bg-green-400'
                      : '',
                    'border rounded-xl p-5 border-slate-200',
                  )}
                >
                  <div className="flex gap-3 items-start">
                    <img src={checkgreen} alt="checked" className="mt-1" />
                    <div>
                      <p className="text-xl font-bold">{item.toUpperCase()}</p>
                      <p className="text-green-500 font-medium">Successful</p>
                    </div>
                  </div>
                  <div className="mt-3 relative left-8">
                    <p className="text-sm text-slate-400 font-medium">Date &amp; Time</p>
                    <p className="font-semibold mt-1">{dayjs().format('YYYY-MM-DD h a')}</p>
                  </div>
                </div>
              </div>
            ))}
        </>
      ) : (
        <div className="w-full min-h-[400px] flex justify-center items-center">
          <p className="text-xl">No status found</p>
        </div>
      )}
    </div>
  );
};

export default ProcessPipeline;

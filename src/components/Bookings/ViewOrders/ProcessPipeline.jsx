import classNames from 'classnames';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import checkgreen from '../../../assets/check-success.svg';
import checkbw from '../../../assets/check-other.svg';

const ProcessPipeline = ({ bookingData = {}, printStatus, mountStatus }) => {
  const steps = useMemo(
    () =>
      ['campaignStatus', 'mountingStatus', 'printingStatus', 'paymentStatus']
        .filter(item => !!bookingData[item])
        .reverse(),
    [bookingData],
  );
  console.log(steps, printStatus, mountStatus, bookingData);

  return (
    <div className="flex flex-col gap-8 pl-5 p7-7 mt-4 mb-10">
      {steps?.length || printStatus || mountStatus ? (
        <>
          {steps.map((step, outerIndex) => (
            <div className="flex gap-8">
              {Object.keys(bookingData[step]).map((process, index) => (
                <div className="relative min-w-[200px]">
                  <div
                    className={classNames(
                      `border rounded-xl p-5 border-slate-200 ${
                        index !== 0
                          ? 'before:content-[""] before:absolute before:h-[1px] before:-left-8 before:w-8 before:top-[50%] before:bg-green-400'
                          : ''
                      } ${
                        index === 0 && outerIndex !== steps.length - 1
                          ? 'after:content-[""] after:rotate-90 after:absolute after:h-[1px] after:left-24  after:w-8 after:top-[111%] after:bg-green-400'
                          : ''
                      }`,
                    )}
                  >
                    <div className="flex gap-3">
                      {/* TODO: status prop is useless */}
                      <img
                        src={process?.status === 'Successful' ? checkgreen : checkbw}
                        alt="checked"
                      />
                      <p className="text-xl font-bold">{process.toUpperCase()}</p>
                    </div>
                    {/* TODO: status prop is useless */}
                    <p
                      className={classNames(
                        `text-sm ${
                          process?.status === 'Successful' ? 'text-green-500' : 'text-orange-350'
                        } relative left-8 mt-1`,
                      )}
                    >
                      {process?.status}
                    </p>
                    <div className="mt-4 relative left-8">
                      <p className="text-sm text-slate-400">Date &amp; Time</p>
                      <p className="font-semibold mt-1">
                        {dayjs(bookingData[step][process]).format('YYYY-MM-DD h A')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {/* step === printingStatus ? '' */}
            </div>
          ))}
          {[printStatus, mountStatus]
            .filter(item => !!item)
            .map((item, index) => (
              <div className="relative max-w-[220px]">
                <div
                  className={classNames(
                    `border rounded-xl p-5 border-slate-200 ${
                      index !== 0
                        ? 'before:content-[""] before:absolute before:h-[1px] before:-left-8 before:w-8 before:top-[50%] before:bg-green-400'
                        : ''
                    } ${
                      index === 0
                        ? 'after:content-[""] after:rotate-90 after:absolute after:h-[1px] after:left-24  after:w-8 after:top-[111%] after:bg-green-400'
                        : ''
                    }`,
                  )}
                >
                  <div className="flex gap-3">
                    <img
                      src={printStatus?.includes('completed') ? checkgreen : checkbw}
                      alt="checked"
                    />
                    <p className="text-xl font-bold">{item.toUpperCase()}</p>
                  </div>
                  <div className="mt-4 relative left-8">
                    <p className="text-sm text-slate-400">Date &amp; Time</p>
                    <p className="font-semibold mt-1">{dayjs().format('YYYY-MM-DD h A')}</p>
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

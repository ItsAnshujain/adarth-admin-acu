import classNames from 'classnames';
import { useMemo } from 'react';
import dayjs from 'dayjs';
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

const d = {
  '_id': '6350f425f95dc0e62c6c2cc3',
  'client': {
    'companyName': 'Somemthing',
    'name': 'Rajat',
    'email': 'rajat@coebuddy.co',
    'contactNumber': '5465320221',
    'panNumber': 'BNZAA2318J',
    'gstNumber': '18AABCU9603R1ZM',
    '_id': '6350f425f95dc0e62c6c2cc4',
    'isDeleted': false,
    'deletedAt': null,
    'createdAt': '2022-10-20T07:09:25.266Z',
    'updatedAt': '2022-10-20T07:09:25.266Z',
  },
  'type': 'offline',
  'bookingId': '1gfaetm10',
  'company': 'Codebuddy Pvt Ltd',
  'createdAt': '2022-10-20T07:09:25.266Z',
  'campaignStatus': {
    'ongoing': '2022-11-07T09:24:27.547Z',
    'Created': '2022-11-10T12:47:44.738Z',
  },
  'currentStatus': {
    'campaignStatus': 'Created',
  },
  'campaign': {
    '_id': '633ffcfc7bbe512cc9511447',
    'name': 'string',
    'status': '636cbbe5434be62b9209bc49',
    'incharge': '631b33b14e9e68808412e9f7',
  },
  'totalSpaces': 2,
  'totalPrice': 1120,
};

const ProcessPipeline = ({ data = d }) => {
  const steps = useMemo(
    () =>
      ['campaignStatus', 'mountingStatus', 'printingStatus', 'paymentStatus']
        .filter(item => !!data[item])
        .reverse(),
    [data],
  );

  return (
    <div className="flex flex-col gap-8 pl-5 p7-7 mt-4 mb-10">
      {steps.map((step, outerIndex) =>
        data[step] ? (
          <div className="flex gap-8">
            {Object.keys(data[step]).map((process, index) => (
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
                    <img
                      src={process?.status === 'Successful' ? checkgreen : checkbw}
                      alt="checked"
                    />
                    <p className="text-xl font-bold">{process.toUpperCase()}</p>
                  </div>
                  <p
                    className={classNames(
                      `text-sm ${
                        process?.status === 'Successful' ? 'text-green-500' : 'text-orange-350'
                      } relative left-8 mt-1`,
                    )}
                  >
                    {/* TODO: missing status from api */}
                    {process?.status}
                  </p>
                  <div className="mt-4 relative left-8">
                    <p className="text-sm text-slate-400">Date &amp; Time</p>
                    <p className="font-semibold mt-1">
                      {dayjs(data[step][process]).format('YYYY-MM-DD h A')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null,
      )}
    </div>
  );
};

export default ProcessPipeline;

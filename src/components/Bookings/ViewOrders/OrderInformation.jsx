import { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Button, Loader, Select } from '@mantine/core';
import { ChevronDown } from 'react-feather';
import dayjs from 'dayjs';
import completed from '../../../assets/completed.svg';
import toIndianCurrency from '../../../utils/currencyFormat';
import upload from '../../../assets/upload.svg';
import { useFetchMasters } from '../../../hooks/masters.hooks';
import { serialize } from '../../../utils';
import { useUpdateBookingStatus } from '../../../hooks/booking.hooks';
import NoData from '../../shared/NoData';

ChartJS.register(ArcElement, Tooltip, Legend);

export const data = {
  datasets: [
    {
      data: [3425, 3425],
      backgroundColor: ['#FF900E', '#914EFB'],
      borderColor: ['#FF900E', '#914EFB'],
      borderWidth: 1,
    },
  ],
};
const config = {
  type: 'line',
  data,
  options: { responsive: true },
};

const OrderInformation = ({ bookingData = {}, isLoading = true }) => {
  const printingStatusData = useFetchMasters(
    serialize({ type: 'printing_status', parentId: null, page: 1, limit: 100 }),
  );

  const mountStatusData = useFetchMasters(
    serialize({ type: 'mounting_status', parentId: null, page: 1, limit: 100 }),
  );

  const printList = useMemo(() => {
    if (printingStatusData?.data?.docs?.length) {
      return printingStatusData.data.docs.map(item => item.name);
    }

    return [];
  }, [printingStatusData]);

  const mountList = useMemo(() => {
    if (mountStatusData?.data?.docs?.length) {
      return mountStatusData.data.docs.map(item => item.name);
    }

    return [];
  }, [mountStatusData]);

  const { mutate } = useUpdateBookingStatus();

  return isLoading ? (
    <div className="flex justify-center items-center h-[400px]">
      <Loader />
    </div>
  ) : (
    <div className="pl-10 pr-7">
      <p className="mt-5 font-bold text-lg">Stats</p>
      <div className="mt-2 flex flex-col gap-8">
        <div className="flex flex-wrap">
          <div className="flex gap-x-4 p-4 border rounded-md items-center mr-20">
            <div className="w-32">
              <Doughnut options={config.options} data={config.data} />
            </div>
            <div>
              <p className="font-normal text -md">Revenue Status</p>
              <div className="flex gap-8 mt-6">
                <div className="flex gap-2 items-center">
                  <div className="h-2 w-1 p-2 bg-orange-350 rounded-full" />
                  <div>
                    <p className="text-xs font-lighter mb-1">Online Sale</p>
                    <p className="font-bold text-md">coming soon</p>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="h-2 w-1 p-2 rounded-full bg-purple-350" />
                  <div>
                    <p className="font-lighter text-xs mb-1">Offline Sale</p>
                    <p className="font-bold text-md">coming soon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border rounded p-8  pr-20">
            <img src={completed} alt="ongoing" />
            <p className="my-2 text-xs font-lighter mt-3 text-muted">Total Places</p>
            <p className="font-bold">{bookingData?.totalSpaces || 0}</p>
          </div>
        </div>
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
              <p className="font-bold">{toIndianCurrency(bookingData?.totalPrice)}</p>
            </div>
            <div>
              <p className="text-slate-400">Start Date</p>
              <p className="font-bold">
                <NoData type="unknown" />
              </p>
            </div>
            <div>
              <p className="text-slate-400">End Date</p>
              <p className="font-bold">15 May 2037</p>
            </div>
            <div>
              <p className="text-slate-400">Printing Status</p>
              <Select
                className="mr-2"
                defaultValue={bookingData?.currentStatus?.printingStatus}
                onChange={val =>
                  mutate({ id: bookingData._id, query: serialize({ printingStatus: val }) })
                }
                data={printList}
                styles={{
                  rightSection: { pointerEvents: 'none' },
                }}
                rightSection={<ChevronDown size={16} className="mt-[1px] mr-1" />}
                rightSectionWidth={40}
              />
            </div>
            <div>
              <p className="text-slate-400">Upload Media</p>
              <Button className="py-1.5 px-2 ml-1  flex items-center gap-2 border border-slate-400 rounded text-black font-thin">
                <span className="text-sm mr-2">Upload</span>
                <img src={upload} alt="Upload" className="mr-1 h-3" />
              </Button>
            </div>
            <div>
              <p className="text-slate-400">Booking Type</p>
              <p className="font-bold">{bookingData?.type}</p>
            </div>
            <div>
              <p className="text-slate-400">Mounting Status</p>
              <Select
                className="mr-2"
                defaultValue={bookingData?.currentStatus?.mountingStatus}
                onChange={val =>
                  mutate({ id: bookingData._id, query: serialize({ mountingStatus: val }) })
                }
                data={mountList}
                styles={{
                  rightSection: { pointerEvents: 'none' },
                }}
                rightSection={<ChevronDown size={16} className="mt-[1px] mr-1" />}
                rightSectionWidth={40}
              />
            </div>
          </div>
        </div>
        <div>
          <p className="font-bold text-lg mb-2">Campaign Info</p>
          <div className="flex p-4 gap-8 border  flex-wrap">
            <div>
              <p className="text-slate-400">Campaign Id</p>
              <p className="font-bold">#{bookingData.campaign?._id}</p>
            </div>
            <div>
              <p className="text-slate-400">Campaign Name</p>
              <p className="font-bold">{bookingData.campaign?.name}</p>
            </div>
            <div>
              <p className="text-slate-400">Booking Status</p>
              <p className="font-bold">
                {bookingData.campaign?.status || <NoData type="unknown" />}
              </p>
            </div>
            <div>
              <p className="text-slate-400">Campaing Incharge</p>
              <p className="font-bold">
                {bookingData?.campaign?.incharge?.[0]?.name || <NoData type="na" />}
              </p>
              {/* <Select
                className="mr-2"
                value={campaignIncharge}
                onChange={setCampaignIncharge}
                data={['Completed', 'Pending']}
                styles={{
                  rightSection: { pointerEvents: 'none' },
                }}
                rightSection={<ChevronDown size={16} className="mt-[1px] mr-1" />}
                rightSectionWidth={40}
              /> */}
            </div>
            <div>
              <p className="text-slate-400">Start Date</p>
              <p className="font-bold">
                {/* 15 May 2037 comment for keeping format */}
                <NoData type="unknown" />
              </p>
            </div>
            <div>
              <p className="text-slate-400">End Date</p>
              <p className="font-bold">
                <NoData type="unknown" />
              </p>
            </div>
            <div>
              <p className="text-slate-400">Campaign Type</p>
              <p className="font-bold">{bookingData?.campaign?.type || <NoData type="na" />}</p>
            </div>
          </div>
        </div>
        <div className="mb-16">
          <p className="font-bold text-lg mb-2">Payment Info</p>
          <div className="flex p-4 gap-y-6 gap-x-32 border flex-wrap">
            <div>
              <p className="text-slate-400">Payment Type</p>
              <p className="font-bold">
                <NoData type="upcoming" />
              </p>
            </div>
            <div>
              <p className="text-slate-400">Status</p>
              <p className="font-bold">
                <NoData type="upcoming" />
              </p>
            </div>
            <div>
              <p className="text-slate-400">Card No</p>
              <p className="font-bold">
                <NoData type="upcoming" />
              </p>
            </div>
            <div>
              <p className="text-slate-400">Payment Date</p>
              <p className="font-bold">
                <NoData type="upcoming" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderInformation;

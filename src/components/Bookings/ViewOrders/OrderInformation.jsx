import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Loader, NativeSelect } from '@mantine/core';
import dayjs from 'dayjs';
import completed from '../../../assets/completed.svg';
import toIndianCurrency from '../../../utils/currencyFormat';
import { serialize } from '../../../utils';
import NoData from '../../shared/NoData';
import { useFetchUsers } from '../../../hooks/users.hooks';
import { useUpdateCampaign } from '../../../hooks/campaigns.hooks';

const styles = {
  label: {
    marginBottom: '4px',
    fontWeight: 700,
    fontSize: '15px',
    letterSpacing: '0.5px',
  },
};

const DATE_FORMAT = 'DD MMM YYYY';

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

const OrderInformation = ({
  bookingData = {},
  isLoading = true,
  bookingStats,
  mountStatus,
  printStatus,
}) => {
  const {
    data: userData,
    isSuccess: isUserDataLoaded,
    isLoading: isLoadingUserData,
  } = useFetchUsers(
    serialize({
      page: 1,
      limit: 100,
      sortOrder: 'asc',
      sortBy: 'createdAt',
    }),
  );

  const { mutate: updateCampaign } = useUpdateCampaign();

  const handleAddIncharge = inchargeId => {
    if (bookingData?.campaign) {
      updateCampaign({
        id: bookingData.campaign?._id,
        data: { incharge: inchargeId },
      });
    }
  };

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
              <Doughnut
                options={config.options}
                data={{
                  datasets: [
                    {
                      data: [bookingStats?.online || 0, bookingStats?.offline || 0],
                      backgroundColor: ['#FF900E', '#914EFB'],
                      borderColor: ['#FF900E', '#914EFB'],
                      borderWidth: 1,
                    },
                  ],
                }}
              />
            </div>
            <div>
              <p className="font-medium">Health Status</p>
              <div className="flex gap-8 mt-6">
                <div className="flex gap-2 items-center">
                  <div className="h-2 w-1 p-2 bg-orange-350 rounded-full" />
                  <div>
                    <p className="text-xs font-lighter mb-1">Online Sale</p>
                    <p className="font-bold text-md">{bookingStats?.online || 0}</p>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="h-2 w-1 p-2 rounded-full bg-purple-350" />
                  <div>
                    <p className="font-lighter text-xs mb-1">Offline Sale</p>
                    <p className="font-bold text-md">{bookingStats?.offline || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border rounded p-8  pr-20">
            <img src={completed} alt="ongoing" />
            <p className="my-2 text-xs font-lighter mt-3 text-muted">Total Places</p>
            <p className="font-bold">{bookingData?.campaign?.spaces.length || 0}</p>
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
              <p className="font-bold">{toIndianCurrency(bookingData?.campaign?.totalPrice)}</p>
            </div>
            <div>
              <p className="text-slate-400">Start Date</p>
              <p className="font-bold">
                {bookingData?.campaign?.startDate ? (
                  dayjs(bookingData.campaign.startDate).format(DATE_FORMAT)
                ) : (
                  <NoData type="na" />
                )}
              </p>
            </div>
            <div>
              <p className="text-slate-400">End Date</p>
              <p className="font-bold">
                {bookingData?.campaign?.endDate ? (
                  dayjs(bookingData.campaign.endDate).format(DATE_FORMAT)
                ) : (
                  <NoData type="na" />
                )}
              </p>
            </div>
            <div>
              <p className="text-slate-400">Printing Status</p>
              <p className="font-bold capitalize">{printStatus}</p>
            </div>
            <div>
              <p className="text-slate-400">Booking Type</p>
              <p className="font-bold capitalize">{bookingData?.type}</p>
            </div>
            <div>
              <p className="text-slate-400">Mounting Status</p>
              <p className="font-bold capitalize">{mountStatus}</p>
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
                {bookingData?.currentStatus?.campaignStatus || <NoData type="na" />}
              </p>
            </div>
            <div>
              <p className="text-slate-400">Campaing Incharge</p>
              <NativeSelect
                styles={styles}
                disabled={isLoadingUserData}
                placeholder="Select..."
                data={
                  isUserDataLoaded
                    ? userData?.docs?.map(item => ({ label: item?.name, value: item?._id }))
                    : []
                }
                onChange={e => handleAddIncharge(e.target.value)}
                className="mb-7"
                defaultValue={bookingData?.campaign?.incharge?.map(item => item._id) || ''}
              />
            </div>
            <div>
              <p className="text-slate-400">Start Date</p>
              <p className="font-bold">
                {bookingData?.campaign?.startDate ? (
                  dayjs(bookingData.campaign.startDate).format(DATE_FORMAT)
                ) : (
                  <NoData type="na" />
                )}
              </p>
            </div>
            <div>
              <p className="text-slate-400">End Date</p>
              <p className="font-bold">
                {bookingData?.campaign?.startDate ? (
                  dayjs(bookingData.campaign.endDate).format(DATE_FORMAT)
                ) : (
                  <NoData type="na" />
                )}
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
              <p className="font-bold uppercase">
                {bookingData?.paymentType || <NoData type="upcoming" />}
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

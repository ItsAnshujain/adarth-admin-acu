import { useCallback, useEffect, useMemo, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Group, Loader, Select } from '@mantine/core';
import dayjs from 'dayjs';
import { useQueryClient } from '@tanstack/react-query';
import completed from '../../../../assets/completed.svg';
import toIndianCurrency from '../../../../utils/currencyFormat';
import { serialize } from '../../../../utils';
import NoData from '../../../shared/NoData';
import { useFetchUsers, useFetchUsersById } from '../../../../apis/queries/users.queries';
import { useUpdateCampaign } from '../../../../apis/queries/campaigns.queries';
import useTokenIdStore from '../../../../store/user.store';
import { useFetchMasters } from '../../../../apis/queries/masters.queries';

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

const query = {
  parentId: null,
  limit: 100,
  page: 1,
  sortBy: 'name',
  sortOrder: 'asc',
};

const OrderInformation = ({ bookingData = {}, isLoading = true, bookingStats, bookingId }) => {
  const queryClient = useQueryClient();
  const userId = useTokenIdStore(state => state.id);
  const { data: userDetails } = useFetchUsersById(userId);
  const [activeOrganization, setActiveOrganization] = useState('');
  const [activeIncharge, setActiveIncharge] = useState('');
  const {
    data: organizationData,
    isSuccess: isOrganizationDataLoaded,
    isLoading: isOrganizationDataLoading,
  } = useFetchMasters(serialize({ type: 'organization', ...query }), userDetails?.role === 'admin');

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
      filter: userDetails?.role === 'admin' ? 'all' : 'team',
      company: activeOrganization !== '' ? activeOrganization : undefined,
    }),
    userDetails?.role !== 'associate',
  );

  const { mutate: updateCampaign } = useUpdateCampaign();

  const handleActiveIncharge = useCallback(
    inchargeId => {
      if (inchargeId === '') return;

      if (bookingData?.campaign) {
        updateCampaign(
          {
            id: bookingData.campaign?._id,
            data: { incharge: inchargeId },
          },
          { onSuccess: () => queryClient.invalidateQueries(['booking-by-id', bookingId]) },
        );
      }
    },
    [bookingData?.campaign],
  );

  const handleActiveOrganization = e => {
    setActiveOrganization(e);
    setActiveIncharge('');
  };

  const healthStatusData = useMemo(
    () => ({
      datasets: [
        {
          data: [bookingStats?.offline ?? 0, bookingStats?.online ?? 0],
          backgroundColor: ['#FF900E', '#914EFB'],
          borderColor: ['#FF900E', '#914EFB'],
          borderWidth: 1,
        },
      ],
    }),
    [bookingStats],
  );

  const inchargeList = useMemo(() => {
    let arr = [];
    if (userData?.docs && bookingData?.campaign?.incharge?.[0]?._id === userDetails?._id) {
      arr = [
        { label: userDetails?.name, value: userDetails?._id },
        ...userData.docs.map(item => ({ label: item?.name, value: item?._id })),
      ];
      return arr;
    }
    if (userData?.docs) {
      arr = [...arr, ...userData.docs.map(item => ({ label: item?.name, value: item?._id }))];
    }
    return arr;
  }, [userData?.docs, bookingData?.campaign]);

  const getDefaultIncharge = useMemo(
    () =>
      inchargeList?.filter(item =>
        item?.value?.includes(bookingData?.campaign?.incharge?.[0]?._id),
      )[0]?.value,
    [bookingData?.campaign, inchargeList],
  );

  const organizationList = useMemo(() => {
    let arr = [];
    if (organizationData?.docs?.length) {
      arr = [...organizationData.docs.map(item => ({ label: item?.name, value: item?.name }))];

      return arr;
    }

    return [];
  }, [organizationData?.docs?.length]);

  const getDefaultOrganization = useMemo(
    () =>
      organizationList?.filter(item =>
        item?.value
          ?.toLowerCase()
          ?.includes(bookingData?.campaign?.incharge?.[0]?.company?.toLowerCase()),
      )[0]?.label,
    [bookingData?.campaign, organizationList],
  );

  useEffect(() => {
    setActiveIncharge(getDefaultIncharge);
  }, [bookingData?.campaign]);

  useEffect(() => {
    setActiveOrganization(getDefaultOrganization);
  }, [bookingData?.campaign, organizationList]);

  return isLoading ? (
    <div className="flex justify-center items-center h-[400px]">
      <Loader />
    </div>
  ) : (
    <div className="px-5">
      <p className="mt-5 font-bold text-lg">Statistics</p>
      <div className="mt-2 flex flex-col gap-8">
        <div className="flex flex-wrap">
          <div className="flex gap-x-4 p-4 border rounded-md items-center mr-20">
            <div className="w-32">
              {isLoading ? (
                <Loader className="mx-auto" />
              ) : bookingStats?.online === 0 && bookingStats?.offline === 0 ? (
                <p className="text-center">NA</p>
              ) : (
                <Doughnut options={config.options} data={healthStatusData} />
              )}
            </div>
            <div>
              <p className="font-medium">Health Status</p>
              <div className="flex gap-8 mt-6">
                <div className="flex gap-2 items-center">
                  <div className="h-2 w-1 p-2 rounded-full bg-purple-350" />
                  <div>
                    <p className="text-xs font-lighter mb-1">Online Sale</p>
                    <p className="font-bold text-md">{bookingStats?.online ?? 0}</p>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="h-2 w-1 p-2 bg-orange-350 rounded-full" />
                  <div>
                    <p className="font-lighter text-xs mb-1">Offline Sale</p>
                    <p className="font-bold text-md">{bookingStats?.offline ?? 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border rounded p-8  pr-20">
            <img src={completed} alt="ongoing" />
            <p className="my-2 text-xs font-lighter mt-3 text-muted">Total Places</p>
            <p className="font-bold">{bookingData?.campaign?.spaces.length ?? 0}</p>
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
              <Group className="gap-1">
                <p className="font-bold">{toIndianCurrency(bookingData?.campaign?.price)}</p>
                <p className="text-xs italic">**inclusive of gst</p>
              </Group>
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
              <p className="font-bold capitalize">
                {bookingData?.currentStatus?.printingStatus?.toLowerCase()?.includes('upcoming')
                  ? 'Printing upcoming'
                  : bookingData?.currentStatus?.printingStatus
                      ?.toLowerCase()
                      ?.includes('in progress')
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
                  : bookingData?.currentStatus?.mountingStatus
                      ?.toLowerCase()
                      ?.includes('in progress')
                  ? 'Mounting in progress'
                  : bookingData?.currentStatus?.mountingStatus?.toLowerCase()?.includes('completed')
                  ? 'Mounting completed'
                  : '-'}
              </p>
            </div>
          </div>
        </div>
        <div>
          <p className="font-bold text-lg mb-2">Campaign Info</p>
          <div className="flex p-4 gap-8 border flex-wrap">
            <div>
              <p className="text-slate-400">Campaign Id</p>
              <p className="font-bold">{bookingData.campaign?.campaignId || '--'}</p>
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
            {userDetails && userDetails?.role === 'admin' ? (
              <div>
                <p className="text-slate-400">Organization</p>
                <Select
                  styles={styles}
                  placeholder="Select..."
                  data={isOrganizationDataLoaded ? organizationList : []}
                  disabled={isOrganizationDataLoading}
                  onChange={e => handleActiveOrganization(e)}
                  value={activeOrganization}
                />
              </div>
            ) : null}
            <div>
              <p className="text-slate-400">Campaign Incharge</p>
              {userDetails?.role === 'associate' ? (
                <p className="font-bold">{userDetails?.name}</p>
              ) : (
                <Select
                  styles={styles}
                  disabled={
                    isLoadingUserData ||
                    (userDetails?.role === 'associate' &&
                      bookingData?.campaign?.incharge?.[0]?._id !== userDetails?._id)
                  }
                  placeholder="Select..."
                  data={isUserDataLoaded ? inchargeList : []}
                  onChange={e => handleActiveIncharge(e)}
                  className="mb-7"
                  value={activeIncharge}
                />
              )}
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
                {bookingData?.currentStatus?.paymentStatus || <NoData type="upcoming" />}
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
                {bookingData?.paymentStatus?.Paid ? (
                  dayjs(bookingData.paymentStatus.Paid).format('DD MMM YYYY h:mm A')
                ) : (
                  <NoData type="upcoming" />
                )}
              </p>
            </div>
            <div>
              <p className="text-slate-400">Payment Reference Number</p>
              <p className="font-bold">{bookingData?.paymentReference || '--'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderInformation;
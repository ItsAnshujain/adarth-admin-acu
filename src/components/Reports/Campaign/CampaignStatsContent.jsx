import { Image, Loader } from '@mantine/core';
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import TotalCampaignIcon from '../../../assets/total-campaign.svg';
import OngoingCampaignIcon from '../../../assets/ongoing-campaign.svg';
import UpcomingCampaignIcon from '../../../assets/upcoming-campaign.svg';
import CompletedCampaignIcon from '../../../assets/completed-campaign.svg';
import ImpressionsIcon from '../../../assets/impressions.svg';

const config = {
  type: 'line',
  options: { responsive: true },
};

const CampaignStatsContent = ({ isStatsLoading, healthStatusData, stats }) => (
  <div className="flex justify-between gap-4 flex-wrap mb-8">
    <div className="flex gap-2 w-2/3 flex-wrap">
      <div className="border rounded p-8 flex-1">
        <Image src={TotalCampaignIcon} alt="folder" fit="contain" height={24} width={24} />
        <p className="my-2 text-sm font-light text-slate-400">Total Campaign(Overall)</p>
        <p className="font-bold">{stats?.total ?? 0}</p>
      </div>
      <div className="border rounded p-8  flex-1">
        <Image src={OngoingCampaignIcon} alt="folder" fit="contain" height={24} width={24} />
        <p className="my-2 text-sm font-light text-slate-400">Total Ongoing Campaign</p>
        <p className="font-bold">{stats?.ongoing ?? 0}</p>
      </div>
      <div className="border rounded p-8  flex-1">
        <Image src={UpcomingCampaignIcon} alt="folder" fit="contain" height={24} width={24} />
        <p className="my-2 text-sm font-light text-slate-400">Upcoming Campaign</p>
        <p className="font-bold">{stats?.upcoming ?? 0}</p>
      </div>
      <div className="border rounded p-8 flex-1">
        <Image src={CompletedCampaignIcon} alt="folder" fit="contain" height={24} width={24} />
        <p className="my-2 text-sm font-light text-slate-400">Completed Campaign</p>
        <p className="font-bold">{stats?.completed ?? 0}</p>
      </div>
      <div className="border rounded p-8 flex-1">
        <Image src={ImpressionsIcon} alt="folder" fit="contain" height={24} width={24} />
        <p className="my-2 text-sm font-light text-slate-400">Total Impression Count</p>
        <p
          className="font-bold overflow-x-hidden overflow-ellipsis w-[80px]"
          title={stats?.impression}
        >
          {stats?.impression ? stats.impression.toLocaleString() : 0}
        </p>
      </div>
    </div>
    <div className="flex gap-4 p-4 border rounded-md items-center flex-1 flex-wrap-reverse">
      <div className="w-32">
        {isStatsLoading ? (
          <Loader className="mx-auto" />
        ) : stats?.healthy === 0 && stats?.unhealthy === 0 ? (
          <p className="text-center">NA</p>
        ) : (
          <Doughnut options={config.options} data={healthStatusData} />
        )}
      </div>
      <div>
        <p className="font-medium">Health Status</p>
        <div className="flex gap-8 mt-6 flex-wrap">
          <div className="flex gap-2 items-center">
            <div className="h-2 w-1 p-2 bg-orange-350 rounded-full" />
            <div>
              <p className="my-2 text-xs font-light text-slate-400">Healthy</p>
              <p className="font-bold text-lg">{stats?.healthy ?? 0}</p>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <div className="h-2 w-1 p-2 rounded-full bg-purple-350" />
            <div>
              <p className="my-2 text-xs font-light text-slate-400">Unhealthy</p>
              <p className="font-bold text-lg">{stats?.unhealthy ?? 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default CampaignStatsContent;

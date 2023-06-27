import { Image } from '@mantine/core';
import React from 'react';
import toIndianCurrency from '../../../utils/currencyFormat';
import TotalRevenueIcon from '../../../assets/total-revenue.svg';
import OfflineRevenueIcon from '../../../assets/offline-revenue.svg';
import OnlineRevenueIcon from '../../../assets/online-revenue.svg';
import ProposalSentIcon from '../../../assets/proposal-sent.svg';
import OperationalCostIcon from '../../../assets/operational-cost.svg';

const RevenueStatsContent = ({ revenueData }) => (
  <div className="flex flex-1 justify-between gap-4 flex-wrap mb-5">
    <div className="border rounded p-8 flex-1">
      <Image src={TotalRevenueIcon} alt="folder" fit="contain" height={24} width={24} />
      <p className="my-2 text-sm font-light text-slate-400">Total Revenue</p>
      <p className="font-bold">{toIndianCurrency(revenueData?.revenue ?? 0)}</p>
    </div>
    <div className="border rounded p-8  flex-1">
      <Image src={OfflineRevenueIcon} alt="folder" fit="contain" height={24} width={24} />
      <p className="my-2 text-sm font-light text-slate-400">Offline Revenue</p>
      <p className="font-bold">{toIndianCurrency(revenueData?.offline ?? 0)}</p>
    </div>
    <div className="border rounded p-8 flex-1">
      <Image src={OnlineRevenueIcon} alt="folder" fit="contain" height={24} width={24} />
      <p className="my-2 text-sm font-light text-slate-400">Online Revenue</p>
      <p className="font-bold">{revenueData?.online ?? 0}</p>
    </div>
    <div className="border rounded p-8 flex-1">
      <Image src={ProposalSentIcon} alt="folder" fit="contain" height={24} width={24} />
      <p className="my-2 text-sm font-light text-slate-400">Total Proposals Sent</p>
      <p className="font-bold">{revenueData?.totalProposalSent}</p>
    </div>
    <div className="border rounded p-8 flex-1">
      <Image src={OperationalCostIcon} alt="folder" fit="contain" height={24} width={24} />
      <p className="my-2 text-sm font-light text-slate-400">Total Operational Cost</p>
      <p className="font-bold">{toIndianCurrency(revenueData?.operationalCost ?? 0)}</p>
    </div>
  </div>
);

export default RevenueStatsContent;

import { Avatar, Badge } from '@mantine/core';
import dayjs from 'dayjs';
import {
  DATE_THIRD_FORMAT,
  leadCommunicationTypeOptions,
  leadStageOptions,
} from '../../../utils/constants';

const LeadHistoryCard = ({ followUpData }) => (
  <div className="flex flex-col border border-gray-200 rounded-md w-full p-4 gap-3">
    <Badge className="bg-purple-350 text-white font-medium w-fit capitalize text-sm py-3">
      {leadStageOptions?.filter(({ value }) => value === followUpData?.stage)?.[0]?.label}
    </Badge>
    <div className="text-sm">{followUpData?.notes}</div>
    <div className="text-purple-450">
      {followUpData?.communicationType
        ? `Over the ${
            leadCommunicationTypeOptions.filter(
              type => type.value === followUpData?.communicationType,
            )?.[0]?.label
          } communication`
        : null}
    </div>
    <div className="flex">
      <div className="w-1/3">
        <div className="text-sm text-gray-500">Primary Incharge</div>
        <div className="flex items-center">
          <Avatar />
          <div className="text-sm">{followUpData?.primaryInCharge?.name || 'None'}</div>
        </div>
      </div>
      <div className="w-1/3">
        <div className="text-sm text-gray-500">Secondary Incharge</div>
        <div className="flex items-center">
          <Avatar />
          <div className="text-sm">{followUpData?.secondaryInCharge?.name || 'None'}</div>
        </div>
      </div>
    </div>
    <div className="w-1/3">
      <div className="text-sm text-gray-500">Next Follow Up</div>
      <div className="flex items-center">
        <div className="text-sm">
          {followUpData?.nextFollowUpDate
            ? dayjs(followUpData?.nextFollowUpDate).format(DATE_THIRD_FORMAT)
            : '-'}
        </div>
      </div>
    </div>
  </div>
);

export default LeadHistoryCard;

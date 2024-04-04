import { Avatar, Badge } from '@mantine/core';
import dayjs from 'dayjs';
import { useModals } from '@mantine/modals';
import {
  DATE_THIRD_FORMAT,
  leadCommunicationTypeOptions,
  leadStageOptions,
} from '../../../utils/constants';
import FollowUpMenuPopover from '../../Popovers/FollowUpMenuPopover';
import modalConfig from '../../../utils/modalConfig';
import AddFollowUpContent from './AddFollowUpContent';

const updatedModalConfig = {
  ...modalConfig,
  classNames: {
    title: 'font-dmSans text-xl px-4',
    header: 'p-4 border-b border-gray-800',
    body: 'px-8',
    close: 'mr-4',
  },
  size: 800,
};

const LeadHistoryCard = ({ followUpData }) => {
  const modals = useModals();
  const toggleEditFollowUp = id =>
    modals.openModal({
      title: 'Edit Follow Up',
      modalId: 'editFollowUpModal',
      children: (
        <AddFollowUpContent
          onCancel={() => modals.closeModal('editFollowUpModal')}
          leadId={id}
          followUpData={followUpData}
        />
      ),
      ...updatedModalConfig,
    });
  return (
    <div className="flex flex-col border border-gray-200 rounded-md w-full p-4 gap-3">
      <div className="flex justify-between items-center">
        <Badge className="bg-purple-450 text-white font-medium w-fit capitalize text-sm py-3">
          {leadStageOptions?.filter(({ value }) => value === followUpData?.leadStage)?.[0]?.label}
        </Badge>
        <FollowUpMenuPopover itemId={followUpData?._id} toggleEditFollowUp={toggleEditFollowUp} />
      </div>
      {followUpData?.notes ? <div className="text-sm">{followUpData?.notes}</div> : null}
      <div className="text-purple-450 font-medium">
        {followUpData?.communicationType
          ? `${
              leadCommunicationTypeOptions.filter(
                type => type.value === followUpData?.communicationType,
              )?.[0]?.label
            }`
          : null}
      </div>
      <div className="flex gap-2">
        <div className="w-1/3">
          <div className="text-sm text-gray-500">Primary Incharge</div>
          <div className="flex items-center">
            <Avatar />
            <div className="text-sm max-w-sm truncate" title={followUpData?.primaryInCharge?.name}>
              {followUpData?.primaryInCharge?.name || 'None'}
            </div>
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
};

export default LeadHistoryCard;

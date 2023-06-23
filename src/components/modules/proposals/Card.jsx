import { Text } from '@mantine/core';
import ProposalsMenuPopover from '../../Popovers/ProposalsMenuPopover';

const Card = ({ proposalData }) => (
  <div className="flex flex-col drop-shadow-md bg-white w-[270px] max-h-[380px] mb-6">
    <div className="flex-1 p-4 pt-4 pb-7 flex flex-col gap-y-1">
      <Text size="md" weight="bold" lineClamp={1} className="w-full">
        {proposalData?.name || 'NA'}
      </Text>
      <p className="text-purple-450 text-sm font-bold">{proposalData?.status?.name || 'NA'}</p>
      <div className="flex justify-between">
        <div>
          <p className="text-slate-400 text-sm">Client</p>
          <Text size="sm" lineClamp={1} className="w-full">
            {proposalData?.client?.company || 'NA'}
          </Text>
        </div>
        <div>
          <p className="text-slate-400 text-sm">Total Places</p>
          <p>{proposalData?.totalPlaces || 0}</p>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-purple-450 font-bold">₹{proposalData?.price || 0}</p>
        <ProposalsMenuPopover itemId={proposalData?._id} />
      </div>
    </div>
  </div>
);

export default Card;

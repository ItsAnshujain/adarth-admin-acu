import { Box, Image, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import ProposalsMenuPopover from '../Popovers/ProposalsMenuPopover';

const Card = ({ proposalData }) => {
  const navigate = useNavigate();

  const handleProposalDetails = () =>
    navigate(`view-details/${proposalData?._id}`, { replace: true });

  return (
    <Box
      className="flex flex-col drop-shadow-md bg-white w-[270px] max-h-[380px] mb-6"
      onClick={handleProposalDetails}
    >
      <div className="flex-1 w-full">
        {proposalData.image ? (
          <Image
            height={170}
            src={proposalData.image}
            alt="card"
            withPlaceholder
            placeholder={
              <Text align="center">Unexpected error occured. Image cannot be loaded</Text>
            }
          />
        ) : (
          <Image height={170} src={null} alt="card" fit="contain" withPlaceholder />
        )}
      </div>
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
    </Box>
  );
};

export default Card;

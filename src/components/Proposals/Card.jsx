import { Box, Image, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import MenuPopover from '../../pages/Proposal/MenuPopover';

const Card = ({ proposalData }) => {
  const navigate = useNavigate();

  const handleProposalDetails = () =>
    navigate(`view-details/${proposalData?._id}`, { replace: true });

  return (
    <Box
      className="flex flex-col px-4 pt-4 pb-8 shadow-md gap-4 max-w-72 bg-white cursor-pointer"
      onClick={handleProposalDetails}
    >
      <div>
        {proposalData.image ? (
          <Image
            className="w-full"
            height={176}
            src={proposalData.image}
            alt="card"
            withPlaceholder
            placeholder={
              <Text align="center">Unexpected error occured. Image cannot be loaded</Text>
            }
          />
        ) : (
          <Image height={176} src={null} alt="card" fit="contain" withPlaceholder />
        )}
      </div>
      <p className="font-bold text-ellipsis w-full overflow-hidden capitalize">
        {proposalData?.name || 'NA'}
      </p>
      <p className="text-purple-450 text-sm font-bold">{proposalData?.status?.name || 'NA'}</p>
      <div className="flex justify-between">
        <div>
          <p className="text-slate-400 text-sm">Client</p>
          <p>{proposalData?.client?.company || 'NA'}</p>
        </div>
        <div>
          <p className="text-slate-400 text-sm">Total Places</p>
          <p>{proposalData?.totalPlaces || 0}</p>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-purple-450 font-bold">₹{proposalData?.price || 0}</p>
        <MenuPopover itemId={proposalData?._id} />
      </div>
    </Box>
  );
};

export default Card;

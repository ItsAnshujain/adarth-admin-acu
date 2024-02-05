import { Button } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { ArrowLeft, Share2, ChevronDown } from 'react-feather';
import { Link, useNavigate, useParams } from 'react-router-dom';
import modalConfig from '../../../../utils/modalConfig';
import ShareContent from './ShareContent';

const Header = ({ isPeer, bookingId, onOpenVersionsDrawer }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const handleBack = () => navigate(-1);
  const modals = useModals();

  const toggleShareOptions = () => {
    modals.openModal({
      modalId: 'shareProposalOption',
      title: 'Share and Download Option',
      children: (
        <ShareContent
          shareType="proposal"
          id={id}
          onClose={() => modals.closeModal('shareProposalOption')}
        />
      ),
      ...modalConfig,
    });
  };

  return (
    <div className="h-[60px] border-b border-gray-450 flex justify-between items-center">
      <div>
        <ArrowLeft className="cursor-pointer" onClick={handleBack} />
      </div>
      <div className="flex gap-4">
        <Button
          variant="default"
          onClick={onOpenVersionsDrawer}
          leftIcon={<ChevronDown size={16} className="mt-[1px] mr-1" />}
        >
          Versions
        </Button>
        <div className="relative">
          <Button
            className="bg-black"
            onClick={toggleShareOptions}
            leftIcon={<Share2 className="h-5" />}
          >
            Share and Download
          </Button>
        </div>
        {!isPeer && !bookingId ? (
          <div>
            <Link
              to={`/proposals/edit-details/${id}`}
              className="bg-purple-450 flex items-center text-white rounded-md px-4 h-full font-bold text-sm"
            >
              Edit Proposal
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Header;

import { Button } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { ArrowLeft } from 'react-feather';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useGenerateProposalPdf } from '../../../hooks/proposal.hooks';
import { downloadPdf } from '../../../utils';
import modalConfig from '../../../utils/modalConfig';
import ShareContent from './ShareContent';

const Header = ({ isPeer }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const handleBack = () => navigate(-1);
  const modals = useModals();
  const { mutateAsync: generatePdf, isLoading } = useGenerateProposalPdf();

  const toggleShareOptions = () => {
    modals.openContextModal('basic', {
      title: 'Share Option',
      innerProps: {
        modalBody: <ShareContent id={id} />,
      },
      ...modalConfig,
    });
  };

  const onClickDownloadPdf = async () => {
    const res = await generatePdf(id);
    downloadPdf(res?.link);
  };

  return (
    <div className="h-[60px] border-b border-gray-450 flex justify-between items-center pl-5 pr-5">
      <div>
        <ArrowLeft className="cursor-pointer" onClick={handleBack} />
      </div>
      <div className="flex gap-4">
        <Button
          className="border-black text-black radius-md"
          onClick={onClickDownloadPdf}
          loading={isLoading}
          loaderProps={{ color: 'black' }}
        >
          Download PDF
        </Button>
        <div className="relative">
          <Button className="bg-black" onClick={toggleShareOptions}>
            Share
          </Button>
        </div>
        {!isPeer ? (
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

import { Button } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { ArrowLeft } from 'react-feather';
import { Link, useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useGenerateProposalPdf } from '../../../../apis/queries/proposal.queries';
import { downloadPdf, serialize } from '../../../../utils';
import modalConfig from '../../../../utils/modalConfig';
import ShareContent from './ShareContent';

const Header = ({ isPeer }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const handleBack = () => navigate(-1);
  const modals = useModals();
  const { mutateAsync: generatePdf, isLoading } = useGenerateProposalPdf();

  const toggleShareOptions = () => {
    modals.openModal({
      modalId: 'shareProposalOption',
      title: 'Share Option',
      children: <ShareContent id={id} onClose={() => modals.closeModal('shareProposalOption')} />,
      ...modalConfig,
    });
  };

  const onClickDownloadPdf = async () => {
    const res = await generatePdf({ id, queries: serialize({ utcOffset: dayjs().utcOffset() }) });
    downloadPdf(res?.link);
  };

  return (
    <div className="h-[60px] border-b border-gray-450 flex justify-between items-center">
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

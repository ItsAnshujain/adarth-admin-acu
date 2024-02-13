import { Button, Image, Menu } from '@mantine/core';
import { IconDownload } from '@tabler/icons';
import { useModals } from '@mantine/modals';
import logoWhite from '../../../../assets/logo.svg';
import powerpoint from '../../../../assets/powerpoint.svg';
import excel from '../../../../assets/excel.svg';
import pdf from '../../../../assets/pdfIc.svg';
import modalConfig from '../../../../utils/modalConfig';
import ShareContent from './ShareContent';

const updatedModalConfig = {
  ...modalConfig,
  classNames: {
    title: 'font-dmSans text-xl px-4',
    header: 'px-4 pt-4',
    body: 'px-8',
    close: 'mr-4',
  },
};

const DownloadButtons = ({ proposalId, clientCompanyName }) => {
  const modals = useModals();

  const toggleShareOptions = fileType => {
    modals.openModal({
      modalId: 'downloadProposalOption',
      title: `Download ${fileType}`,
      children: (
        <ShareContent
          shareType="proposal"
          fileType={fileType}
          proposalId={proposalId}
          onClose={() => modals.closeModal('downloadProposalOption')}
          clientCompanyName={clientCompanyName}
        />
      ),
      ...updatedModalConfig,
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <Button
        variant="outline"
        className="border-none md:border-solid md:border md:border-black text-black font-normal"
        leftIcon={<Image src={powerpoint} alt="powerpoint" />}
        onClick={() => {
          toggleShareOptions('PPT');
        }}
      >
        Download PPT
      </Button>
      <Button
        variant="outline"
        className="border-none md:border-solid md:border md:border-black text-black font-normal"
        leftIcon={<Image src={pdf} alt="pdf" />}
        onClick={() => {
          toggleShareOptions('PDF');
        }}
      >
        Download PDF
      </Button>
      <Button
        variant="outline"
        className="border-none md:border-solid md:border md:border-black text-black font-normal"
        leftIcon={<Image src={excel} alt="excel" />}
        onClick={() => {
          toggleShareOptions('Excel');
        }}
      >
        Download Excel
      </Button>
    </div>
  );
};

const Header = ({ proposalId, clientCompanyName }) => (
  <div className="flex justify-between my-4 md:my-8">
    <Image className="w-24 lg:w-28" src={logoWhite} alt="logo" />
    <div className="hidden md:flex">
      <DownloadButtons proposalId={proposalId} clientCompanyName={clientCompanyName} />
    </div>
    <Menu shadow="md" classNames={{ item: 'cursor-pointer' }} className="md:hidden">
      <Menu.Target>
        <Button
          variant="outline"
          className="text-black border-black font-normal"
          size="xs"
          leftIcon={<IconDownload size={20} />}
        >
          Download
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <DownloadButtons proposalId={proposalId} clientCompanyName={clientCompanyName} />
      </Menu.Dropdown>
    </Menu>
  </div>
);

export default Header;

import React from 'react';
import { ActionIcon, Anchor, Menu } from '@mantine/core';
import { Share2, Mail, Link as LinkIcon } from 'react-feather';
import { useModals } from '@mantine/modals';
import MenuIcon from '../Menu';
import whatsapp from '../../assets/whatsapp.svg';
import modalConfig from '../../utils/modalConfig';
import DeleteFinanceContent from '../DeleteFinanceContent';
import ShareContent from '../Finance/ShareContent';

const MenuPopover = ({
  itemId,
  onClickCopyLink = () => {},
  onClickDownloadPdf = () => {},
  pdfLink,
  type,
}) => {
  const modals = useModals();

  const toggleDeleteModal = () =>
    modals.openContextModal('basic', {
      title: '',
      innerProps: {
        modalBody: (
          <DeleteFinanceContent
            onClickCancel={id => modals.closeModal(id)}
            financeId={itemId}
            type={type}
          />
        ),
      },
      ...modalConfig,
    });

  const toggleShareOptions = () => {
    modals.openContextModal('basic', {
      title: 'Share Option',
      innerProps: {
        modalBody: <ShareContent id={itemId} />,
      },
      ...modalConfig,
    });
  };

  return (
    <div className="flex gap-2 items-center">
      <Menu shadow="md" width={150}>
        <Menu.Target>
          <ActionIcon>
            <Share2 size="20" color="black" />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            icon={<img src={whatsapp} alt="whatsapp-icon" className="h-4 mx-1" />}
            disabled={!pdfLink}
          >
            <Anchor
              href={`https://web.whatsapp.com/send?text=${pdfLink}`}
              data-action="share/whatsapp/share"
              target="_blank"
              rel="noreferrer"
              className="py-2"
              underline={false}
            >
              Whatsapp
            </Anchor>
          </Menu.Item>
          <Menu.Item
            icon={<Mail className="h-4" />}
            disabled={!pdfLink}
            onClick={() => toggleShareOptions()}
          >
            <span>Send Email</span>
          </Menu.Item>
          <Menu.Item
            icon={<LinkIcon className="h-4" />}
            onClick={onClickCopyLink}
            disabled={!pdfLink}
          >
            Copy Link
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <Menu shadow="md" width={150}>
        <Menu.Target>
          <ActionIcon>
            <MenuIcon />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            className="cursor-pointer flex items-center gap-1 w-full"
            onClick={onClickDownloadPdf}
          >
            <span className="ml-1">Download</span>
          </Menu.Item>
          <Menu.Item
            className="cursor-pointer flex items-center gap-1 w-full"
            onClick={() => toggleDeleteModal()}
          >
            <span className="ml-1">Delete</span>
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
};

export default MenuPopover;

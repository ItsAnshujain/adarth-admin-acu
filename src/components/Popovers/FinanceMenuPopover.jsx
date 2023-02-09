import React from 'react';
import { ActionIcon, Menu } from '@mantine/core';
import { Share2, Mail, Link as LinkIcon } from 'react-feather';
import MenuIcon from '../Menu';
import whatsapp from '../../assets/whatsapp.svg';

const MenuPopover = ({ onClickCopyLink = () => {}, onClickDownloadPdf = () => {} }) => (
  <div className="flex gap-2 items-center">
    <Menu shadow="md" width={150}>
      <Menu.Target>
        <ActionIcon>
          <Share2 size="20" color="black" />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item icon={<img src={whatsapp} alt="whatsapp-icon" className="h-4 mx-1" />}>
          {/* TODO: need actual mail address */}
          <a
            href="https://web.whatsapp.com/send?text=example"
            data-action="share/whatsapp/share"
            target="_blank"
            rel="noreferrer"
          >
            Whatsapp
          </a>
        </Menu.Item>
        <Menu.Item icon={<Mail className="h-4" />}>
          {/* TODO: need actual mail address */}
          <a href="mailto:example@email.com" target="_blank" rel="noreferrer">
            Send Email
          </a>
        </Menu.Item>
        <Menu.Item icon={<LinkIcon className="h-4" />} onClick={onClickCopyLink}>
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
      </Menu.Dropdown>
    </Menu>
  </div>
);

export default MenuPopover;

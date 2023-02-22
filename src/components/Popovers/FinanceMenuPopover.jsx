import React from 'react';
import { ActionIcon, Anchor, Menu } from '@mantine/core';
import { Share2, Mail, Link as LinkIcon } from 'react-feather';
import MenuIcon from '../Menu';
import whatsapp from '../../assets/whatsapp.svg';

const MenuPopover = ({ onClickCopyLink = () => {}, onClickDownloadPdf = () => {}, pdfLink }) => (
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
        <Menu.Item icon={<Mail className="h-4" />} disabled={!pdfLink}>
          <Anchor
            href={`mailto:?body=${pdfLink}`}
            target="_blank"
            rel="noreferrer"
            className="py-2"
            underline={false}
          >
            Send Email
          </Anchor>
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
        {/* TODO: api and client dependent */}
        {/* <Menu.Item className="cursor-pointer flex items-center gap-1 w-full">
          <span className="ml-1">Delete</span>
        </Menu.Item> */}
      </Menu.Dropdown>
    </Menu>
  </div>
);

export default MenuPopover;

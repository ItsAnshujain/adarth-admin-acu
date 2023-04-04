import {
  // Anchor, Button, Menu,
  Text,
} from '@mantine/core';
// import { Mail, Share2, Download, Link as LinkIcon } from 'react-feather';
// import whatsapp from '../../assets/whatsapp.svg';
import ViewByFilter from './ViewByFilter';

const Header = ({
  text,
  // onClickDownloadPdf = () => {},
  // onClickSharePdf = () => {},
  // pdfLink,
  handleRevenueGraphViewBy = () => {},
  showGlobalFilter = false,
}) => (
  <div className="h-[60px] border-b border-gray-450 flex justify-between items-center pl-5 pr-7">
    <Text size="lg" weight="bold">
      {text}
    </Text>
    <div className="flex items-start">
      {showGlobalFilter ? <ViewByFilter handleViewBy={handleRevenueGraphViewBy} /> : null}
      {/* TODO: commented for now */}
      {/* <Button
        leftIcon={<Download size="20" color="white" />}
        className="primary-button mx-3"
        onClick={onClickDownloadPdf}
      >
        Download
      </Button>

      <Menu shadow="md" width={150}>
        <Menu.Target>
          <Button
            leftIcon={<Share2 size="20" color="black" />}
            className="secondary-button"
            onClick={onClickSharePdf}
          >
            Share
          </Button>
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
            onClick={() => navigator.clipboard.writeText(pdfLink)}
            disabled={!pdfLink}
          >
            Copy Link
          </Menu.Item>
        </Menu.Dropdown>
      </Menu> */}
    </div>
  </div>
);

export default Header;

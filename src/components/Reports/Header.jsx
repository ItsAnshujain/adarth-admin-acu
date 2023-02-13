import { Button, Text } from '@mantine/core';

const Header = ({ text, onClickDownloadPdf = () => {} }) => (
  <div className="h-[60px] border-b border-gray-450 flex justify-between items-center pl-5 pr-7">
    <Text size="lg" weight="bold">
      {text}
    </Text>
    <Button className="primary-button" onClick={onClickDownloadPdf}>
      Download
    </Button>
  </div>
);

export default Header;

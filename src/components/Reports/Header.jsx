import { Text } from '@mantine/core';

const Header = ({ text }) => (
  <div className="h-[60px] border-b border-gray-450 flex justify-between items-center">
    <div className="pl-5">
      <Text size="lg" weight="bold">
        {text}
      </Text>
    </div>
  </div>
);

export default Header;

import { Button, Text } from '@mantine/core';
import logo from '../assets/logo.svg';

const Header = ({ title }) => (
  <header className="grid grid-cols-12 h-20  border-b border-gray-450">
    <div className="col-span-2 pl-7 self-center">
      <img src={logo} alt="logo" />
    </div>
    <div className="flex justify-between items-center col-span-10 border-l border-gray-450">
      <div className="pl-5">
        <Text size="lg" weight="700">
          {title}
        </Text>
      </div>
      <div className="flex items-center mr-7">
        <Button variant="subtle" color="gray">
          Notifications
        </Button>
        <Button variant="subtle" color="gray">
          Settings
        </Button>
        <Button variant="default">
          <img className="w-8 h-8 mr-2" src={logo} alt="logo" />
          <Text size="sm">Profile</Text>
        </Button>
      </div>
    </div>
  </header>
);
export default Header;

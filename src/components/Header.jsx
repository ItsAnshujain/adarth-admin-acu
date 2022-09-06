import { Button } from '@mantine/core';
import { useState } from 'react';
import { Menu } from 'react-feather';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';
import DrawerSidebar from './DrawerSidebar';

const Header = ({ title }) => {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <header className="grid grid-cols-12 h-20  border-b border-gray-450 relative w-screen">
        <div className="flex items-center col-span-2 pl-2 lg:pl-7 self-center">
          <Menu onClick={() => setOpened(true)} className="mr-2 h-6 w-6 inline-block lg:hidden" />
          <img className="w-16 lg:w-24" src={logo} alt="logo" />
        </div>
        <div className="flex justify-between items-center col-span-10 border-l border-gray-450">
          <div className="pl-5">
            <p className="text-2xl font-bold tracking-wide">{title}</p>
          </div>
          <div className="flex items-center mr-7">
            <Link to="/notification">
              <Button variant="subtle" color="gray" className="font-medium">
                Notifications
              </Button>
            </Link>
            <Link to="/setting">
              <Button variant="subtle" color="gray" className="font-medium">
                Settings
              </Button>
            </Link>
            <Button variant="default">
              <img className="w-8 h-8 mr-2" src={logo} alt="logo" />
              <p className="font-medium text-sm">Profile</p>
            </Button>
          </div>
        </div>
      </header>
      {opened && <DrawerSidebar setOpened={setOpened} opened={opened} />}
    </>
  );
};

export default Header;

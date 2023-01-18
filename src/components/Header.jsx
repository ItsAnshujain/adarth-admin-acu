import { Avatar, Button, Image, Menu as MenuProfile } from '@mantine/core';
import { useState } from 'react';
import { Menu } from 'react-feather';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import shallow from 'zustand/shallow';
import { showNotification } from '@mantine/notifications';
import classNames from 'classnames';
import { useQueryClient } from '@tanstack/react-query';
import logo from '../assets/logo.svg';
import useUserStore from '../store/user.store';
import DrawerSidebar from './DrawerSidebar';
import NotificationsIcon from '../assets/notifications.svg';
import SettingsIcon from '../assets/settings.svg';
import UserImage from '../assets/placeholders/user.png';

const Header = ({ title }) => {
  const { pathname } = useLocation();
  const [opened, setOpened] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userId = useUserStore(state => state.id);
  const user = queryClient.getQueryData(['users-by-id', userId]);

  const { setToken, setId } = useUserStore(
    state => ({
      setToken: state.setToken,
      setId: state.setId,
    }),
    shallow,
  );

  const handleLogout = () => {
    setToken(null);
    setId(null);
    navigate('/login');
    showNotification({
      title: 'Logged out successfully',
      color: 'green',
    });
  };

  return (
    <>
      <header className="grid grid-cols-12 h-[60px] border-b border-gray-450 relative w-screen">
        <div className="flex items-center col-span-2 pl-2 lg:pl-7 self-center">
          <Menu onClick={() => setOpened(true)} className="mr-2 h-6 w-6 inline-block lg:hidden" />
          <Link to="/">
            <img className="w-16 lg:w-24" src={logo} alt="logo" />
          </Link>
        </div>
        <div className="flex justify-between items-center col-span-10 border-l border-gray-450">
          <div className="pl-5">
            <p className="text-2xl font-bold tracking-wide font-sans">{title}</p>
          </div>
          <div className="flex items-center mr-7">
            <Link to="/notification">
              <Button
                variant="subtle"
                color="gray"
                className={classNames(
                  'font-medium font-sans',
                  ['/notification'].includes(pathname) ? 'text-purple-450' : '',
                )}
                leftIcon={<Image src={NotificationsIcon} height={24} width={24} />}
              >
                Notifications
              </Button>
            </Link>
            <Link to="/settings">
              <Button
                variant="subtle"
                color="gray"
                className={classNames(
                  'font-medium font-sans',
                  ['/settings'].includes(pathname) ? 'text-purple-450' : '',
                )}
                leftIcon={<Image src={SettingsIcon} height={24} width={24} />}
              >
                Settings
              </Button>
            </Link>
            <MenuProfile shadow="md" width={150}>
              <MenuProfile.Target>
                <Button variant="default">
                  <Avatar
                    size="sm"
                    src={user?.image || UserImage}
                    className="rounded-full mr-2"
                    alt="user-logo"
                  />
                  <p className="font-medium text-sm font-sans max-w-[120px] min-w-[100px] overflow-hidden text-ellipsis">
                    {user?.name || 'Profile'}
                  </p>
                </Button>
              </MenuProfile.Target>

              <MenuProfile.Dropdown>
                <Link to="/profile">
                  <MenuProfile.Item className="font-sans">My Profile</MenuProfile.Item>
                </Link>
                <Link to="/edit-profile">
                  <MenuProfile.Item className="font-sans">Edit Profile</MenuProfile.Item>
                </Link>
                <MenuProfile.Item className="text-red-500 font-sans" onClick={handleLogout}>
                  Logout
                </MenuProfile.Item>
              </MenuProfile.Dropdown>
            </MenuProfile>
          </div>
        </div>
      </header>
      {opened && <DrawerSidebar setOpened={setOpened} opened={opened} />}
    </>
  );
};

export default Header;

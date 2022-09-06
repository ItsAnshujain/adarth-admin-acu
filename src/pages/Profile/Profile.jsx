import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import useSideBarState from '../../store/sidebar.store';

const Profile = () => {
  const setColor = useSideBarState(state => state.setColor);

  useEffect(() => {
    setColor(4);
  }, []);

  return (
    <div className="absolute top-0">
      <Header title="My Profile" />
      <div className="grid grid-cols-12">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
};

export default Profile;

import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import useSideBarState from '../../store/sidebar.store';

const Campaigns = () => {
  const { pathname } = useLocation();
  const setColor = useSideBarState(state => state.setColor);

  useEffect(() => {
    setColor(5);
  }, []);

  let headerTitle = '';

  if (pathname.includes('view')) {
    headerTitle = 'Campaign Details';
  } else if (pathname.includes('create')) {
    headerTitle = 'Create Campaign';
  } else {
    headerTitle = 'Campaign';
  }

  return (
    <div className="absolute top-0">
      <Header title={headerTitle} />
      <div className="grid grid-cols-12">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
};

export default Campaigns;
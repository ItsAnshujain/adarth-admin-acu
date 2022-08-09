import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import useSideBarState from '../../store/sidebar.the.store';

const Campaigns = () => {
  const { pathname } = useLocation();
  const setColor = useSideBarState(state => state.setColor);
  useEffect(() => {
    setColor(0);
  }, []);
  let headerTitle = '';
  if (pathname.includes('view')) {
    headerTitle = 'Spaces Details';
  } else if (pathname.includes('create')) {
    headerTitle = 'Create Spaces';
  } else {
    headerTitle = 'Spaces';
  }
  return (
    <>
      <Header title={headerTitle} />
      <div className="grid grid-cols-12">
        <Sidebar />
        <Outlet />
      </div>
    </>
  );
};

export default Campaigns;

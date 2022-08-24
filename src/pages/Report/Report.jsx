import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import useSideBarState from '../../store/sidebar.store';

const Reports = () => {
  const setColor = useSideBarState(state => state.setColor);

  useEffect(() => {
    setColor(6);
  }, []);

  return (
    <>
      <Header title="Reports" />
      <div className="grid grid-cols-12">
        <Sidebar />
        <Outlet />
      </div>
    </>
  );
};

export default Reports;

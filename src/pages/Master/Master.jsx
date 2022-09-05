import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import useSideBarState from '../../store/sidebar.store';

const Master = () => {
  const setColor = useSideBarState(state => state.setColor);

  useEffect(() => {
    setColor(5);
  }, []);

  return (
    <div className="absolute top-0">
      <Header title="Masters" />
      <div className="grid grid-cols-12">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
};

export default Master;

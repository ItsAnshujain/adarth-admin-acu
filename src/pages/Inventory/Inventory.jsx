import { Outlet, useLocation } from 'react-router-dom';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';

const Inventory = () => {
  const { pathname } = useLocation();
  let headerTitle = '';

  if (pathname.includes('view')) {
    headerTitle = 'Spaces Details';
  } else if (pathname.includes('create')) {
    headerTitle = 'Create Spaces';
  } else {
    headerTitle = 'Inventory';
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

export default Inventory;

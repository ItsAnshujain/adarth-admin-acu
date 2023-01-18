import { Outlet, useLocation } from 'react-router-dom';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';

const Campaigns = () => {
  const { pathname } = useLocation();
  let headerTitle = '';

  if (pathname.includes('view')) {
    headerTitle = 'Order Details';
  } else if (pathname.includes('create')) {
    headerTitle = 'Create Order';
  } else {
    headerTitle = 'Bookings';
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

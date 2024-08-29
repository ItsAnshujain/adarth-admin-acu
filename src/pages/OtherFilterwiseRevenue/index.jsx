import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

const OtherFilterwiseRevenue = () => (
  <div>
    <Header title="Filter wise Revenue" />
    <div className="grid grid-cols-12 h-[calc(100vh-60px)]">
      <Sidebar />
      <Outlet />
    </div>
  </div>
);

export default OtherFilterwiseRevenue;

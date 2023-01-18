import { Outlet } from 'react-router-dom';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';

const Inventory = () => (
  <div className="absolute top-0">
    <Header title="Finance" />
    <div className="grid grid-cols-12">
      <Sidebar />
      <Outlet />
    </div>
  </div>
);

export default Inventory;

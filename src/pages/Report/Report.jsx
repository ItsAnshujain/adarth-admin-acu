import { Outlet } from 'react-router-dom';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';

const Reports = () => (
  <div className="absolute top-0">
    <Header title="Reports" />
    <div className="grid grid-cols-12">
      <Sidebar />
      <Outlet />
    </div>
  </div>
);

export default Reports;

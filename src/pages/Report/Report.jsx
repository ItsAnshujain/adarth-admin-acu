import { Outlet } from 'react-router-dom';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';

const Reports = () => (
  <div>
    {/* TODO: hide for pdf */}
    <Header title="Reports" />
    <div className="grid grid-cols-12 h-[calc(100vh-60px)]">
      {/* TODO: hide for pdf */}
      <Sidebar />
      <Outlet />
    </div>
  </div>
);

export default Reports;

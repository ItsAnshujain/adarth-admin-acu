import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

const OtherReport1 = () => (
  <div>
    <Header title="Other Reports" />
    <div className="grid grid-cols-12 h-[calc(100vh-60px)]">
      <Sidebar />
      <Outlet />
    </div>
  </div>
);

export default OtherReport1;

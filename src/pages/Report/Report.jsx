import { Outlet } from 'react-router-dom';
import Header from '../../components/Header';

const Reports = () => (
  <div className="absolute top-0">
    <Header title="Reports" />
    <div className="grid grid-cols-12">
      <div aria-hidden className="col-span-2 bg-red-100 -z-50 invisible h-0">
        Invisible
      </div>
      <Outlet />
    </div>
  </div>
);

export default Reports;

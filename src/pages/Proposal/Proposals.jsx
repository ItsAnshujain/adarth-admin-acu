import { Outlet, useLocation } from 'react-router-dom';
import Header from '../../components/Header';

const Campaigns = () => {
  const { pathname } = useLocation();

  let headerTitle = '';
  if (pathname.includes('view')) {
    headerTitle = 'Proposal Details';
  } else if (pathname.includes('create')) {
    headerTitle = 'Create Proposals';
  } else {
    headerTitle = 'Proposals';
  }
  return (
    <div className="absolute top-0">
      <Header title={headerTitle} />
      <div className="grid grid-cols-12">
        <div aria-hidden className="col-span-2 bg-red-100 -z-50 invisible h-0">
          Invisible
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default Campaigns;

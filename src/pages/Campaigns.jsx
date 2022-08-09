import { useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import useSideBarState from '../store/sidebar.the.store';

const Campaigns = () => {
  const setColor = useSideBarState(state => state.setColor);
  useEffect(() => {
    setColor(5);
  }, []);
  return (
    <>
      <Header title="Campaigns" />
      <div className="grid grid-cols-12">
        <Sidebar />
        <div className="col-span-10 border-gray-450 border-l">body</div>
      </div>
    </>
  );
};

export default Campaigns;

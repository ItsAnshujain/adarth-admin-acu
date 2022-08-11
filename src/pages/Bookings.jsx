import { useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import useSideBarState from '../store/sidebar.store';

const Bookings = () => {
  const setColor = useSideBarState(state => state.setColor);
  useEffect(() => {
    setColor(1);
  }, []);

  return (
    <>
      <Header title="Bookings" />
      <div className="grid grid-cols-12">
        <Sidebar />
        <div className="col-span-10 border-gray-450 border-l">body</div>
      </div>
    </>
  );
};

export default Bookings;

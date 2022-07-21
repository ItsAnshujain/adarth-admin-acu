import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import AreaHeader from '../components/AreaHeader';

const Inventory = () => (
  <>
    <Header title="Inventory" />
    <div className="grid grid-cols-12">
      <Sidebar />
      <div className="col-span-10 border-gray-450 border-l">
        <AreaHeader text="List of spaces" />
      </div>
    </div>
  </>
);

export default Inventory;

import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const Landlords = () => (
  <div className="absolute top-0 w-screen ">
    <Header title="Landlords" />
    <div className="grid grid-cols-12">
      <Sidebar />
      <div className="col-span-10 border-gray-450 border-l">body</div>
    </div>
  </div>
);

export default Landlords;

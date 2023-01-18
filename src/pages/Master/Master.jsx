import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Home from '../../components/Masters';

const Master = () => (
  <div className="absolute top-0">
    <Header title="Masters" />
    <div className="grid grid-cols-12">
      <Sidebar />
      <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto">
        <Home />
      </div>
    </div>
  </div>
);

export default Master;

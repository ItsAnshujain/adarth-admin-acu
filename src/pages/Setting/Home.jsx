import Setting from '../../components/Settings';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';

const Settings = () => (
  <div className="absolute top-0 w-screen ">
    <Header title="Settings" />
    <div className="grid grid-cols-12">
      <Sidebar />
      <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto">
        <Setting />
      </div>
    </div>
  </div>
);

export default Settings;

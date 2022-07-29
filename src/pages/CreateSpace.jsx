import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MainArea from '../components/Inventory/AddSpace/CreateSpaceMain';

const CreateSpace = () => (
  <>
    <Header title="Create Space" />
    <div className="grid grid-cols-12">
      <Sidebar />
      <div className="col-span-10 border-gray-450 border-l">
        <MainArea />
      </div>
    </div>
  </>
);

export default CreateSpace;

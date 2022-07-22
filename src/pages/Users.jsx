import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const Users = () => (
  <>
    <Header title="Users" />
    <div className="grid grid-cols-12">
      <Sidebar />
      <div className="col-span-10 border-gray-450 border-l">body</div>
    </div>
  </>
);

export default Users;

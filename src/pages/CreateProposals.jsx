import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Main from '../components/Proposals/CreateProposal';

const CreateProposals = () => (
  <>
    <Header title="Create Space" />
    <div className="grid grid-cols-12">
      <Sidebar />
      <div className="col-span-10 border-gray-450 border-l">
        <Main />
      </div>
    </div>
  </>
);

export default CreateProposals;

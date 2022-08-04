import { useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Main from '../components/Proposals/ViewProposal';
import useSideBarState from '../store/sidebar.the.store';

const ProposalDetails = () => {
  const setColor = useSideBarState(state => state.setColor);
  useEffect(() => {
    setColor(2);
  }, []);

  return (
    <>
      <Header title="Proposal Details" />
      <div className="grid grid-cols-12">
        <Sidebar />
        <div className="col-span-10 border-gray-450 border-l">
          <Main />
        </div>
      </div>
    </>
  );
};

export default ProposalDetails;

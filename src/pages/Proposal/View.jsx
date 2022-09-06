import { useEffect } from 'react';
import Main from '../../components/Proposals/ViewProposal';
import useSideBarState from '../../store/sidebar.store';

const ProposalDetails = () => {
  const setColor = useSideBarState(state => state.setColor);

  useEffect(() => {
    setColor(3);
  }, []);

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto">
      <Main />
    </div>
  );
};

export default ProposalDetails;

import { useEffect } from 'react';
import Main from '../../components/Proposals/ViewProposal';
import useSideBarState from '../../store/sidebar.the.store';

const ProposalDetails = () => {
  const setColor = useSideBarState(state => state.setColor);
  useEffect(() => {
    setColor(2);
  }, []);

  return (
    <div className="col-span-10 border-gray-450 border-l">
      <Main />
    </div>
  );
};

export default ProposalDetails;

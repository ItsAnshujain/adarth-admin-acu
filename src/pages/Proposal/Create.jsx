import { useEffect } from 'react';
import Main from '../../components/Proposals/CreateProposal';
import useSideBarState from '../../store/sidebar.the.store';

const CreateProposals = () => {
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

export default CreateProposals;

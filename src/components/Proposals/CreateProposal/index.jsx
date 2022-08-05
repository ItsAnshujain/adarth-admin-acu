import { useState } from 'react';
import BasicInfo from './BasicInfo';
import Spaces from '../../shared/Spaces';
import SuccessModal from '../../shared/Modal';
import Header from './Header';
import column from '../shared/column';
import data from '../../../Dummydata/CREATE_PROPOSAL_DATA.json';

const Main = () => {
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const getForm = () => (formStep === 1 ? <BasicInfo /> : <Spaces column={column} data={data} />);

  return (
    <>
      <div className="h-20 border-b border-gray-450 flex justify-between items-center">
        <Header
          setFormStep={setFormStep}
          formStep={formStep}
          setOpenSuccessModal={setOpenSuccessModal}
        />
      </div>
      <form>{getForm()}</form>
      <SuccessModal
        title="Proposal Successfully Created"
        text="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        prompt="Visit Proposals"
        open={openSuccessModal}
        setOpenSuccessModal={setOpenSuccessModal}
        path="proposals"
      />
    </>
  );
};

export default Main;

import { useState } from 'react';
import BasicInfo from './BasicInfo';
import Spaces from './Spaces';
import SuccessModal from '../../shared/Modal';
import Header from './Header';

const Main = () => {
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const getForm = () => (formStep === 1 ? <BasicInfo /> : <Spaces />);

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
      <SuccessModal open={openSuccessModal} setOpenSuccessModal={setOpenSuccessModal} id={1} />
    </>
  );
};

export default Main;

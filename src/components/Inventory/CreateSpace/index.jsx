import { useEffect, useState } from 'react';
import BasicInfo from './BasicInformation';
import Specification from './Specification';
import Location from './Location';
import SuccessModal from '../../shared/Modal';
import Preview from './Preview';
import Header from './Header';

const formInitialState = {
  spacename: '',
  landlord: '',
  category: '',
  mediatype: '',
  supportedmedia: '',
  price: '',
  description: '',
  illumination: '',
  resolutions: '',
  healthstatus: '',
  unit: '',
  width: '',
  height: '',
  impression: [],
  previousbrands: [],
  tags: [],
  address: '',
  state: '',
  latitute: '',
  landmark: '',
  city: '',
  zip: '',
  longitude: '',
};

const MainArea = () => {
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState(formInitialState);

  const getForm = () =>
    formStep === 1 ? (
      <BasicInfo formData={formData} setFormData={setFormData} />
    ) : formStep === 2 ? (
      <Specification formData={formData} setFormData={setFormData} />
    ) : formStep === 3 ? (
      <Location formData={formData} setFormData={setFormData} />
    ) : (
      <Preview formData={formData} />
    );

  useEffect(() => {
    const draft = JSON.parse(localStorage.getItem('inv-drafts'));

    if (draft) {
      setFormData(draft);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('inv-drafts', JSON.stringify(formData));
    return () => {
      localStorage.removeItem('inv-drafts', JSON.stringify(formData));
    };
  }, [formStep]);

  return (
    <>
      <Header
        setFormStep={setFormStep}
        formStep={formStep}
        setOpenSuccessModal={setOpenSuccessModal}
      />
      <div>
        <div>
          <form>{getForm()}</form>
        </div>
      </div>
      <SuccessModal open={openSuccessModal} setOpenSuccessModal={setOpenSuccessModal} id={1} />
    </>
  );
};

export default MainArea;

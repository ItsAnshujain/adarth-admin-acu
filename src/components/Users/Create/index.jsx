import { useEffect, useState } from 'react';
import Credentials from './Credentials';
import BasicInfo from './BasicInfo';
import Documents from './Documents';
import SuccessModal from '../../shared/Modal';
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
      <Credentials formData={formData} setFormData={setFormData} />
    ) : formStep === 2 ? (
      <BasicInfo formData={formData} setFormData={setFormData} />
    ) : (
      <Documents formData={formData} setFormData={setFormData} />
    );

  useEffect(() => {
    const draft = JSON.parse(localStorage.getItem('inv-drafts'));

    if (draft) {
      setFormData(draft);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('user-drafts', JSON.stringify(formData));
    return () => {
      localStorage.removeItem('user-drafts', JSON.stringify(formData));
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
      <SuccessModal
        title="Inventory Successfully Added"
        text="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        prompt="Go to inventory"
        open={openSuccessModal}
        setOpenSuccessModal={setOpenSuccessModal}
        path="inventory"
      />
    </>
  );
};

export default MainArea;

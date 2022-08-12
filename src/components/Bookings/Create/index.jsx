import { useEffect, useState } from 'react';
import BasicInfo from './BasicInformation';
import SelectSpaces from './SelectSpaces';
import OrderInfo from './OrderInformation';
import SuccessModal from '../../shared/Modal';
import Header from './Header';
import column from './column';
import data from '../../../Dummydata/CAMPAIGN_SPACES.json';

const formInitialState = {
  companyname: '',
  clientemail: '',
  clientpannumber: '',
  clientname: '',
  clientcontactnumber: '',
  clientgstnumber: '',
  campaignname: '',
  media: '',
  description: '',
};

const MainArea = () => {
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState(formInitialState);

  const getForm = () =>
    formStep === 1 ? (
      <BasicInfo formData={formData} setFormData={setFormData} />
    ) : formStep === 2 ? (
      <OrderInfo formData={formData} setFormData={setFormData} />
    ) : (
      <SelectSpaces data={data} column={column} />
    );

  useEffect(() => {
    const draft = JSON.parse(localStorage.getItem('order-drafts'));

    if (draft) {
      setFormData(draft);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('order-drafts', JSON.stringify(formData));
    return () => {
      localStorage.removeItem('order-drafts', JSON.stringify(formData));
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
        title="Order Successfully Created"
        text="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        prompt="Visit Order List"
        open={openSuccessModal}
        setOpenSuccessModal={setOpenSuccessModal}
        path="bookings"
      />
    </>
  );
};

export default MainArea;

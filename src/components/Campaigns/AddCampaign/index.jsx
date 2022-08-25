import { useEffect, useState } from 'react';
import BasicInfo from './BasicInformation';
import SuccessModal from '../../shared/Modal';
import Preview from '../shared/Preview';
import CoverImage from './CoverImage';
import Header from './Header';
import Spaces from './Spaces';
import data from '../../../Dummydata/CAMPAIGN_SPACES.json';
import column from './column';

const formInitialState = {
  campaignname: '',
  price: '',
  healthstatus: '',
  description: '',
  featured: false,
  previousbrands: [],
  impression: [],
  tags: [],
};

const Create = () => {
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState(formInitialState);

  const getForm = () =>
    formStep === 1 ? (
      <BasicInfo formData={formData} setFormData={setFormData} />
    ) : formStep === 2 ? (
      <Spaces formData={formData} setFormData={setFormData} data={data} column={column} />
    ) : formStep === 3 ? (
      <CoverImage />
    ) : (
      <Preview />
    );

  useEffect(() => {
    const draft = JSON.parse(localStorage.getItem('camp-drafts'));

    if (draft) {
      setFormData(draft);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('camp-drafts', JSON.stringify(formData));
    return () => {
      localStorage.removeItem('camp-drafts', JSON.stringify(formData));
    };
  }, [formStep]);

  return (
    <div className="mb-24">
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
        title="Campaign Successfully Added"
        text="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        prompt="Go to campaign"
        open={openSuccessModal}
        setOpenSuccessModal={setOpenSuccessModal}
        path="campaigns"
      />
    </div>
  );
};

export default Create;

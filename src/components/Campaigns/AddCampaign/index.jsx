import { useState, useRef } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import BasicInfo from './BasicInformation';
import SuccessModal from '../../shared/Modal';
import CoverImage from './CoverImage';
import Header from './Header';
import Spaces from './Spaces';
import data from '../../../Dummydata/CAMPAIGN_SPACES.json';
import column from './column';
import { FormProvider, useForm } from '../../../context/formContext';
import Preview from './Preview';
import { useCreateCampaign } from '../../../hooks/campaigns.hooks';

const requiredSchema = requiredText => yup.string().trim().required(requiredText);
const numberRequiredSchema = (typeErrorText, requiredText) =>
  yup.number().typeError(typeErrorText).required(requiredText);

const schema = formStep =>
  yup.object().shape({
    name: yup.string().concat(formStep === 1 ? requiredSchema('Campaign name is required') : null),
    description: yup
      .string()
      .concat(formStep === 1 ? requiredSchema('Description is required') : null),
    price: yup
      .number()
      .concat(
        formStep === 1 ? numberRequiredSchema('Price must be a number', 'Price is required') : null,
      ),
    healthStatus: yup
      .number()
      .concat(
        formStep === 1
          ? numberRequiredSchema('Health status must be a number', 'Health status is required')
          : null,
      )
      .concat(
        formStep === 1
          ? yup.number().max(100, 'Health status must be less than or equal to 100')
          : null,
      )
      .concat(
        formStep === 1
          ? yup.number().min(0, 'Health status must be greater than or equal to 0')
          : null,
      ),
    previousBrands: yup
      .mixed()
      .concat(formStep === 1 ? yup.array().min(1, 'You must select one previous brand') : null),
    minImpression: yup
      .number()
      .concat(
        formStep === 1
          ? numberRequiredSchema('Minimum Impression must be a number', 'Impression is required')
          : null,
      ),
    maxImpression: yup
      .number()
      .concat(
        formStep === 1
          ? numberRequiredSchema('Maximum Impression must be a number', 'Impression is required')
          : null,
      ),
    tags: yup.mixed().concat(formStep === 1 ? yup.array().min(1, 'You must select one tag') : null),
    isFeatured: yup.boolean(),
    thumbnail: yup.string(),
  });

const initialValues = {
  name: '',
  description: '',
  previousBrands: [],
  tags: [],
  minImpression: 200,
  maxImpression: 800,
  isFeatured: false,
  // FIXME: confirm the logic for theses two fields
  status: 'Created',
  healthTag: 'Good',
};

const Create = () => {
  const submitRef = useRef();
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const form = useForm({ initialValues, validate: yupResolver(schema(formStep)) });

  const navigate = useNavigate();

  const { mutate, isLoading } = useCreateCampaign();

  const getForm = () =>
    formStep === 1 ? (
      <BasicInfo formData={form.values} setFormData={form.setFieldValue} />
    ) : formStep === 2 ? (
      <Spaces formData={form.values} setFormData={form.setFieldValue} data={data} column={column} />
    ) : formStep === 3 ? (
      <CoverImage />
    ) : (
      <Preview />
    );

  const handleSubmit = () => {
    if (formStep <= 3) setFormStep(formStep + 1);
    if (formStep === 4) {
      const newData = { ...form.values };

      newData.place = newData.spaces.map(({ id }) => id);
      delete newData.spaces;

      newData.healthStatus = +newData.healthStatus || 0;
      newData.price = +newData.price || 0;

      mutate(newData, {
        onSuccess: () => {
          navigate('/campaign');
        },
      });
    }
  };

  return (
    <div className="mb-24">
      <Header
        setFormStep={setFormStep}
        formStep={formStep}
        setOpenSuccessModal={setOpenSuccessModal}
        submitRef={submitRef}
        disabled={isLoading}
      />
      <div>
        <div>
          <FormProvider form={form}>
            <form onSubmit={form.onSubmit(handleSubmit)}>
              {getForm()}
              <button type="submit" className="hidden" ref={submitRef} disabled={isLoading}>
                Submit
              </button>
            </form>
          </FormProvider>
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

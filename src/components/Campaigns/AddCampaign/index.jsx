import { useState, useRef, useEffect } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@mantine/form';
import { useNavigate, useParams } from 'react-router-dom';
import BasicInfo from './BasicInformation';
import SuccessModal from '../../shared/Modal';
import CoverImage from './CoverImage';
import Header from './Header';
import Spaces from './Spaces';
import { FormProvider, useForm } from '../../../context/formContext';
import Preview from './Preview';
import { useCampaign, useCreateCampaign, useUpdateCampaign } from '../../../hooks/campaigns.hooks';

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
  price: 0,
  healthStatus: 0,
  status: 'Created',
  isFeatured: false,
  previousBrands: [],
  minImpression: 200,
  maxImpression: 800,
  tags: [],
  healthTag: 'Good',
  place: [],
  thumbnail: '',
  incharge: '',
};

const Create = () => {
  const submitRef = useRef();
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const form = useForm({ initialValues, validate: yupResolver(schema(formStep)) });

  const navigate = useNavigate();
  const { id } = useParams();

  const { data } = useCampaign(id);
  const { mutate: add, isLoading: isSaving } = useCreateCampaign();
  const { mutate: update, isLoading: isUpdating } = useUpdateCampaign();

  const getForm = () =>
    formStep === 1 ? (
      <BasicInfo formData={form.values} setFormData={form.setFieldValue} />
    ) : formStep === 2 ? (
      <Spaces />
    ) : formStep === 3 ? (
      <CoverImage />
    ) : (
      <Preview data={form.values} />
    );

  const handleSubmit = () => {
    if (formStep <= 3) setFormStep(formStep + 1);
    if (formStep === 4) {
      const newData = { ...form.values };

      newData.place = newData.place.map(item => item.id);

      newData.healthStatus = +newData.healthStatus || 0;
      newData.price = +newData.price || 0;

      if (id) {
        update({ id, data: newData });
      } else
        add(newData, {
          onSuccess: () => {
            navigate('/campaigns');
          },
        });
    }
  };

  useEffect(() => {
    if (data) {
      Object.keys(initialValues).forEach(item => {
        form.setFieldValue(item, data[item]);
      });
    }
  }, [data]);

  return (
    <div className="mb-24">
      <Header
        setFormStep={setFormStep}
        formStep={formStep}
        setOpenSuccessModal={setOpenSuccessModal}
        submitRef={submitRef}
        disabled={isSaving || isUpdating}
      />
      <div>
        <FormProvider form={form}>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            {getForm()}
            <button
              type="submit"
              className="hidden"
              ref={submitRef}
              disabled={isSaving || isUpdating}
            >
              Submit
            </button>
          </form>
        </FormProvider>
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

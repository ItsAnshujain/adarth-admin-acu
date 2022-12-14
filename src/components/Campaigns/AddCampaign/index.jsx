import { useState, useRef, useEffect } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@mantine/form';
import { useParams, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import BasicInfo from './BasicInformation';
import SuccessModal from '../../shared/Modal';
import CoverImage from './CoverImage';
import Header from './Header';
import Spaces from './Spaces';
import { FormProvider, useForm } from '../../../context/formContext';
import Preview from './Preview';
import { useCampaign, useCreateCampaign, useUpdateCampaign } from '../../../hooks/campaigns.hooks';
import { useFetchMasters } from '../../../hooks/masters.hooks';
import { isValidURL, serialize } from '../../../utils';

const requiredSchema = requiredText => yup.string().trim().required(requiredText);
const numberRequiredSchema = (typeErrorText, requiredText) =>
  yup.number().min(0).typeError(typeErrorText).required(requiredText);

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
  type: 'predefined',
};

const Create = () => {
  const submitRef = useRef();
  const [publish, setPublish] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const form = useForm({ initialValues, validate: yupResolver(schema(formStep)) });
  const [searchParams] = useSearchParams({ page: 1, limit: 10, sortBy: 'name', sortOrder: 'desc' });

  const { data: campaignStatus } = useFetchMasters(
    serialize({ type: 'campaign_status', parentId: null, limit: 100, page: 1 }),
  );
  const { id } = useParams();

  const { data } = useCampaign({ id, query: searchParams.toString() }, !!id);
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
      <Preview data={form.values} place={{ docs: form.values?.place || [] }} />
    );

  const handlePublish = () => {
    setPublish(true);
    submitRef.current.click();
  };

  const handleSubmit = () => {
    if (formStep <= 3) setFormStep(formStep + 1);
    if (formStep === 4) {
      const newData = { ...form.values };

      let minDate = null;
      let maxDate = null;

      newData.place = newData.place.map(item => {
        const start = item.startDate.setHours(0, 0, 0, 0);
        const end = item.endDate.setHours(0, 0, 0, 0);

        if (!minDate) minDate = start;
        if (!maxDate) maxDate = end;

        if (start < minDate) minDate = start;
        if (end > maxDate) maxDate = end;

        return {
          id: item.id,
          price: item.price,
          media: isValidURL(item.photo) ? item.photo : undefined,
          startDate: item.startDate,
          endDate: item.endDate,
        };
      });

      newData.healthStatus = +newData.healthStatus || 0;
      newData.price = +newData.price || 0;

      if (!['predefined', 'customized'].includes(newData.type)) {
        newData.type = 'predefined';
      }
      if (publish) {
        const publishedId = campaignStatus?.docs?.find(
          item => item?.name?.toLowerCase() === 'published',
        )?.value;
        if (publishedId) {
          newData.status = publishedId;
        }
      }

      if (id) {
        update({
          id,
          data: {
            ...newData,
            startDate: dayjs(minDate).format('YYYY-MM-DD'),
            endDate: dayjs(maxDate).format('YYYY-MM-DD'),
          },
        });
      } else
        add(newData, {
          onSuccess: () => {
            setOpenSuccessModal(true);
          },
        });
    }
  };

  useEffect(() => {
    if (data?.campaign) {
      Object.keys(data.campaign).forEach(item => {
        if (item === 'place') {
          form.setFieldValue(
            item,
            data.campaign[item].map(m => ({ id: m })),
          );
        } else form.setFieldValue(item, data.campaign[item]);
      });
    }
  }, [data]);

  return (
    <div className="mb-24">
      <Header
        setFormStep={setFormStep}
        formStep={formStep}
        handlePublish={handlePublish}
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
        text=""
        prompt="Go to campaign"
        open={openSuccessModal}
        setOpenSuccessModal={setOpenSuccessModal}
        path="campaigns"
      />
    </div>
  );
};

export default Create;

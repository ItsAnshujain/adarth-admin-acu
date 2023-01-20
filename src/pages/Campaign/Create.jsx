import { useState, useRef, useEffect } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@mantine/form';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { showNotification } from '@mantine/notifications';
import BasicInfo from '../../components/Campaigns/AddCampaign/BasicInformation';
import SuccessModal from '../../components/shared/Modal';
import CoverImage from '../../components/Campaigns/AddCampaign/CoverImage';
import Header from '../../components/Campaigns/AddCampaign/Header';
import Spaces from '../../components/Campaigns/AddCampaign/Spaces';
import { FormProvider, useForm } from '../../context/formContext';
import Preview from '../../components/Campaigns/AddCampaign/Preview';
import { useCampaign, useCreateCampaign, useUpdateCampaign } from '../../hooks/campaigns.hooks';
import { useFetchMasters } from '../../hooks/masters.hooks';
import { serialize } from '../../utils';

const requiredSchema = requiredText => yup.string().trim().required(requiredText);
const numberRequiredSchema = (typeErrorText, requiredText) =>
  yup.number().min(0).typeError(typeErrorText).required(requiredText);

const schema = formStep =>
  yup.object().shape({
    name: yup.string().concat(formStep === 1 ? requiredSchema('Campaign name is required') : null),
    description: yup.string().trim(),
    healthStatus: yup
      .number()
      .nullable()
      .concat(
        formStep === 1
          ? yup
              .number()
              .min(0, 'Health Status must be greater than or equal to 0')
              .max(100, 'Health Status must be less than or equal to 100')
              .nullable(true)
          : null,
      ),
    previousBrands: yup.array().of(yup.string().trim()),
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
    tags: yup.array().of(yup.string().trim()),
    isFeatured: yup.boolean(),
    thumbnail: yup.string(),
  });

const initialValues = {
  name: '',
  description: '',
  price: null,
  healthStatus: null,
  status: 'Created',
  isFeatured: false,
  previousBrands: [],
  minImpression: 1600000,
  maxImpression: 3200000,
  tags: [],
  healthTag: 'Good',
  place: [],
  thumbnail: '',
  thumbnailId: '',
  type: 'predefined',
};

const CreateCampaign = () => {
  const navigate = useNavigate();
  const submitRef = useRef();
  const [publish, setPublish] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const form = useForm({ initialValues, validate: yupResolver(schema(formStep)) });
  const [searchParams] = useSearchParams({
    'page': 1,
    'limit': 10,
    'sortBy': 'basicInformation.spaceName',
    'sortOrder': 'desc',
  });
  const { data: campaignStatus } = useFetchMasters(
    serialize({ type: 'campaign_status', parentId: null, limit: 100, page: 1 }),
  );
  const { id } = useParams();

  const { data } = useCampaign({ id, query: searchParams.toString() }, !!id);
  const { mutateAsync: add, isLoading: isSaving } = useCreateCampaign();
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

  const handleSubmit = async () => {
    if (formStep === 2) {
      if (form.values?.place?.length === 0) {
        showNotification({
          title: 'Please select atleast one place to continue',
          color: 'blue',
        });
        return;
      }
    }

    if (formStep <= 3) setFormStep(formStep + 1);

    if (formStep === 4) {
      const newData = { ...form.values };

      let minDate = null;
      let maxDate = null;

      newData.place = newData.place.map(item => {
        const start = new Date(item.startDate).setHours(0, 0, 0, 0);
        const end = new Date(item.endDate).setHours(0, 0, 0, 0);

        if (!minDate) minDate = start;
        if (!maxDate) maxDate = end;

        if (start < minDate) minDate = start;
        if (end > maxDate) maxDate = end;

        return {
          id: item._id,
          price: item.price,
          startDate: item.startDate,
          endDate: item.endDate,
        };
      });

      const totalPrice = newData.place.reduce((acc, item) => acc + +(item.price || 0), 0);

      newData.healthStatus = +newData.healthStatus || 0;
      newData.price = totalPrice || 0;

      delete newData.createdBy;

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

      delete newData.thumbnailId;

      if (id) {
        update(
          {
            id,
            data: {
              ...newData,
              startDate: dayjs(minDate).format('YYYY-MM-DD'),
              endDate: dayjs(maxDate).format('YYYY-MM-DD'),
            },
          },
          {
            onSuccess: () => {
              setTimeout(() => navigate('/campaigns'), 2000);
            },
          },
        );
      } else
        await add(newData, {
          onSuccess: () => {
            setOpenSuccessModal(true);
            setTimeout(() => navigate('/campaigns'), 2000);
          },
        });
    }
  };

  useEffect(() => {
    if (data?.campaign && !form.isTouched()) {
      form.setValues({
        ...data.campaign,
        place: data.campaign.place.map(({ id: _id, ...item }) => ({ ...item, _id })),
      });
    }
  }, [data, form.isTouched]);

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto">
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
    </div>
  );
};

export default CreateCampaign;

import { useState, useRef, useEffect } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@mantine/form';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
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
  healthTag: '',
  place: [],
  thumbnail: '',
  thumbnailId: '',
  type: 'predefined',
  industry: '',
};

const schema = yup.object({
  name: yup.string().trim().required('Campaign Name is required'),
  description: yup.string().trim(),
  previousBrands: yup.array().of(yup.string().trim()),
  minImpression: yup
    .number()
    .positive('Min must be a positive number')
    .typeError('Minimum Impression must be a number'),
  maxImpression: yup
    .number()
    .positive('Max must be a positive number')
    .typeError('Maximum Impression must be a number'),
  tags: yup.array().of(yup.string().trim()),
  isFeatured: yup.boolean(),
  thumbnail: yup.string(),
  industry: yup.string().trim(),
});

const CreateCampaign = () => {
  const navigate = useNavigate();
  const submitRef = useRef();
  const [publish, setPublish] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const form = useForm({ initialValues, validate: yupResolver(schema) });
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
      <BasicInfo />
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
      if (!form.values?.place?.length) {
        showNotification({
          title: 'Please select atleast one place to continue',
          color: 'blue',
        });
        return;
      }
    }

    if (formStep === 3 && form.values.thumbnail === '') {
      showNotification({
        title: 'Please select one cover image to continue',
        color: 'blue',
      });
      return;
    }

    if (formStep <= 3) setFormStep(formStep + 1);

    if (formStep === 4) {
      const newData = { ...form.values };

      newData.place = newData.place.map(item => ({
        id: item._id,
        price: item.price,
      }));

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
        )?._id;

        if (publishedId) {
          newData.status = publishedId;
        }
      }
      Object.keys(newData).forEach(key => {
        if (newData[key] === '' || newData[key] === undefined || !newData[key]?.length) {
          delete newData[key];
        }
      });

      if (id) {
        update(
          {
            id,
            data: newData,
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
        place: data.campaign.place.map(({ id: inventoryObj, ...item }) => ({
          ...item,
          photo: inventoryObj?.basicInformation?.spacePhoto,
          spaceName: inventoryObj?.basicInformation?.spaceName,
          lighting: inventoryObj?.basicInformation?.mediaType,
          supportedMedia: inventoryObj?.basicInformation?.supportedMedia,
          mediaType: inventoryObj?.basicInformation?.mediaType,
          location: {
            address: inventoryObj?.location?.address,
            zip: inventoryObj?.location?.zip,
            latitude: inventoryObj?.location?.latitude,
            longitude: inventoryObj?.location?.longitude,
          },
          price: inventoryObj === null ? 0 : inventoryObj?.price,
          cost: inventoryObj === null ? 0 : inventoryObj?.price,
          dimension: {
            height: inventoryObj?.specifications?.size?.height || 0,
            width: inventoryObj?.specifications?.size?.width || 0,
          },
          illuminations: inventoryObj?.specifications?.illuminations,
          resolutions: inventoryObj?.specifications?.resolutions,
          unit: inventoryObj?.specifications?.unit,
          impression: inventoryObj?.specifications?.impressions?.max,
          _id: inventoryObj?._id,
        })),
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
          loading={isSaving || isUpdating}
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

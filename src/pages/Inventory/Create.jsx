import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { yupResolver } from '@mantine/form';
import * as yup from 'yup';
import BasicInfo from '../../components/Inventory/CreateSpace/BasicInformation';
import Specification from '../../components/Inventory/CreateSpace/Specification';
import Location from '../../components/Inventory/CreateSpace/Location';
import SuccessModal from '../../components/shared/Modal';
import Preview from '../../components/shared/Preview';
import PreviewLocation from '../../components/Inventory/CreateSpace/PreviewLocation';
import Header from '../../components/Inventory/CreateSpace/Header';
import { FormProvider, useForm } from '../../context/formContext';
import {
  useCreateInventory,
  useFetchInventoryById,
  useUpdateInventory,
} from '../../hooks/inventory.hooks';

const initialValues = {
  basicInformation: {
    spaceName: '',
    landlord: '',
    mediaOwner: '',
    category: { label: '', value: '' },
    subCategory: { label: '', value: '' },
    spaceType: { label: '', value: '' },
    mediaType: { label: '', value: '' },
    supportedMedia: '',
    description: '',
    price: 0,
    spacePhoto: '',
    otherPhotos: [],
    footFall: null,
    demographic: { label: '', value: '' },
    audience: [],
  },
  specifications: {
    illuminations: { label: '', value: '' },
    spaceStatus: { label: '', value: '' },
    unit: 0,
    resolutions: '',
    size: {
      height: 0,
      width: 0,
    },
    health: null,
    impressions: {
      min: 1600000,
      max: 3200000,
    },
    previousBrands: [],
    tags: [],
  },
  location: {
    latitude: null,
    longitude: null,
    address: '',
    city: '',
    state: '',
    zip: null,
    zone: '',
    landmark: '',
    facing: '',
    tier: '',
  },
};

const basicInformationSchema = yup.object({
  basicInformation: yup.object({
    spaceName: yup.string().trim().required('Space name is required'),
    landlord: yup.string().trim().required('Landlord is required'),
    mediaOwner: yup.string().trim(),
    spaceType: yup
      .object({
        label: yup.string().trim(),
        value: yup.string().trim(),
      })
      .test('spaceType', 'Space Type is required', obj => obj.value !== ''),
    category: yup
      .object({
        label: yup.string().trim(),
        value: yup.string().trim(),
      })
      .test('category', 'Category is required', obj => obj.value !== ''),
    subCategory: yup.object({
      label: yup.string().trim(),
      value: yup.string().trim(),
    }),
    mediaType: yup
      .object({
        label: yup.string().trim(),
        value: yup.string().trim(),
      })
      .test('mediaType', 'Media Type is required', obj => obj.value !== ''),
    supportedMedia: yup.string().trim(),
    description: yup.string().trim(),
    price: yup
      .number()
      .positive('Price must be a positive number')
      .typeError('Price must be a number')
      .required('Price is required'),
    spacePhoto: yup.string().trim(),
    otherPhotos: yup.array().of(yup.string().trim()),
    footFall: yup
      .number()
      .positive('FootFall must be a positive number')
      .typeError('FootFall must be a number')
      .nullable(),
    demographic: yup
      .object({
        label: yup.string().trim(),
        value: yup.string().trim(),
      })
      .test('demographic', 'Demographics is required', obj => obj.value !== ''),
    audience: yup.array().of(yup.object({ label: yup.string(), value: yup.string() })),
  }),
});

const specificationsValues = yup.object({
  specifications: yup.object({
    illuminations: yup
      .object({
        label: yup.string().trim(),
        value: yup.string().trim(),
      })
      .test('illuminations', 'Illumination is required', obj => obj.value !== ''),
    spaceStatus: yup
      .object({
        label: yup.string().trim(),
        value: yup.string().trim(),
      })
      .test('spaceStatus', 'Space Status is required', obj => obj.value !== ''),
    unit: yup
      .number()
      .positive('Unit must be a positive number')
      .typeError('Unit must be a number')
      .required('Unit is required'),
    resolutions: yup.string().trim(),
    size: yup.object({
      height: yup
        .number()
        .positive('Height must be a positive number')
        .typeError('Height must be a number')
        .required('Height is required'),
      width: yup
        .number()
        .positive('Width must be a positive number')
        .typeError('Width must be a number')
        .required('Width is required'),
    }),
    health: yup
      .number()
      .min(0, 'Health Status must be greater than or equal to 0')
      .max(100, 'Health Status must be less than or equal to 100')
      .nullable(true),
    impressions: yup.object({
      min: yup
        .number()
        .positive('Width must be a positive number')
        .typeError('Min must be a number'),
      max: yup
        .number()
        .positive('Width must be a positive number')
        .typeError('Max must be a number'),
    }),
    previousBrands: yup.array().of(yup.object({ label: yup.string(), value: yup.string() })),
    tags: yup.array().of(yup.object({ label: yup.string(), value: yup.string() })),
  }),
});

const locationValues = yup.object({
  location: yup.object({
    latitude: yup
      .number()
      .typeError('Latitude must be a number')
      .required('Latitude is required')
      .nullable(),
    longitude: yup
      .number()
      .typeError('Longitude must be a number')
      .required('Longitude is required')
      .nullable(),
    address: yup.string().trim().required('Address is required'),
    city: yup.string().trim().required('City is required'),
    state: yup.string().trim().required('State is required'),
    zip: yup
      .number()
      .typeError('Zip must be a number')
      .positive('Zip must be a positive number')
      .test('len', 'Zip must be 6 digits', val => val?.toString().length === 6)
      .required('Zip is required')
      .nullable(),
    zone: yup.string().trim().required('Zone is required'),
    landmark: yup.string().trim().required('Landmark is required'),
    facing: yup.string().trim().required('Facing is required'),
    tier: yup.string().trim().required('Tier is required'),
  }),
});

const schemas = [basicInformationSchema, specificationsValues, locationValues, yup.object()];

const CreateSpace = () => {
  const navigate = useNavigate();
  const { id: inventoryId } = useParams();
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [formStep, setFormStep] = useState(1);

  const form = useForm({
    validate: yupResolver(schemas[formStep - 1]),
    initialValues,
  });
  const { mutate: create, isLoading, isSuccess: isCreateSuccess } = useCreateInventory();
  const {
    mutate: update,
    isLoading: isUpdateInventoryLoading,
    isSuccess: isEditSuccess,
  } = useUpdateInventory();
  const { data: inventoryDetails } = useFetchInventoryById(inventoryId, !!inventoryId);

  const getForm = () =>
    formStep === 1 ? (
      <BasicInfo basicInformation={inventoryDetails?.basicInformation} />
    ) : formStep === 2 ? (
      <Specification />
    ) : formStep === 3 ? (
      <Location />
    ) : formStep === 4 ? (
      <>
        <Preview />
        <PreviewLocation />
      </>
    ) : null;

  const onSubmitInventoryForm = formData => {
    const data = {
      ...formData,
      basicInformation: {
        ...formData.basicInformation,
        audience: formData?.basicInformation?.audience?.map(item => item?.value),
        category: formData?.basicInformation?.category?.value,
        demographic: formData?.basicInformation?.demographic?.value,
        mediaType: formData?.basicInformation?.mediaType?.value,
        spaceType: formData?.basicInformation?.spaceType?.value,
        subCategory: formData?.basicInformation?.subCategory?.value,
        otherPhotos: formData.basicInformation?.otherPhotos?.map(item => item.trim()),
      },
      specifications: {
        ...formData.specifications,
        illuminations: formData?.specifications?.illuminations?.value,
        spaceStatus: formData?.specifications?.spaceStatus?.value,
        previousBrands: formData?.specifications?.previousBrands?.map(item => item?.value),
        tags: formData?.specifications?.tags?.map(item => item?.value),
      },
    };

    setFormStep(prevState => prevState + 1);
    if (formStep === 4) {
      setFormStep(4);
      Object.keys(data.basicInformation).forEach(key => {
        if (data.basicInformation[key] === '' || data.basicInformation[key]?.[0] === '') {
          delete data.basicInformation[key];
        }
      });
      Object.keys(data.specifications).forEach(key => {
        if (data.specifications[key] === '') {
          delete data.specifications[key];
        }
      });
      Object.keys(data.location).forEach(key => {
        if (data.location[key] === '') {
          delete data.location[key];
        }
      });

      if (inventoryId) {
        update(
          { inventoryId, data },
          { onSuccess: () => setTimeout(() => navigate('/inventory'), 2000) },
        );
      } else {
        create(data, { onSuccess: () => setTimeout(() => navigate('/inventory'), 2000) });
      }
    }
  };

  useEffect(() => {
    if (inventoryDetails) {
      const { basicInformation, specifications, location } = inventoryDetails;
      form.setFieldValue('basicInformation.spaceName', basicInformation?.spaceName || '');
      form.setFieldValue('basicInformation.landlord', basicInformation?.landlord || '');
      form.setFieldValue('basicInformation.mediaOwner', basicInformation?.mediaOwner?._id || '');
      form.setFieldValue('basicInformation.description', basicInformation?.description || '');
      form.setFieldValue(
        'basicInformation.footFall',
        basicInformation?.footFall ? parseInt(basicInformation.footFall, 10) : null,
      );
      form.setFieldValue(
        'basicInformation.price',
        basicInformation?.price ? parseInt(basicInformation?.price, 10) : null,
      );
      form.setFieldValue('basicInformation.category.label', basicInformation?.category?.name || '');
      form.setFieldValue('basicInformation.category.value', basicInformation?.category?._id || '');
      if (basicInformation?.category) {
        form.setFieldValue(
          'basicInformation.subCategory.label',
          basicInformation?.subCategory?.name || '',
        );
        form.setFieldValue(
          'basicInformation.subCategory.value',
          basicInformation?.subCategory?._id || '',
        );
      }
      form.setFieldValue(
        'basicInformation.spaceType.label',
        basicInformation?.spaceType?.name || '',
      );
      form.setFieldValue(
        'basicInformation.spaceType.value',
        basicInformation?.spaceType?._id || '',
      );
      form.setFieldValue(
        'basicInformation.mediaType.label',
        basicInformation?.mediaType?.name || '',
      );
      form.setFieldValue(
        'basicInformation.mediaType.value',
        basicInformation?.mediaType?._id || '',
      );
      form.setFieldValue('basicInformation.supportedMedia', basicInformation?.supportedMedia || '');
      form.setFieldValue(
        'basicInformation.demographic.label',
        basicInformation?.demographic?.name || '',
      );
      form.setFieldValue(
        'basicInformation.demographic.value',
        basicInformation?.demographic?._id || '',
      );
      const arrOfAudience = basicInformation?.audience?.map(item => ({
        label: item?.name,
        value: item?._id,
      }));
      form.setFieldValue('basicInformation.audience', arrOfAudience || []);
      form.setFieldValue('basicInformation.audience.value', basicInformation?.audience?._id || '');
      form.setFieldValue('basicInformation.spacePhoto', basicInformation?.spacePhoto || '');
      form.setFieldValue('basicInformation.otherPhotos', basicInformation?.otherPhotos || ['']);
      form.setFieldValue(
        'specifications.illuminations.label',
        specifications?.illuminations?.name || '',
      );
      form.setFieldValue(
        'specifications.illuminations.value',
        specifications?.illuminations?._id || '',
      );
      form.setFieldValue(
        'specifications.unit',
        specifications?.unit ? parseInt(specifications.unit, 10) : null,
      );
      form.setFieldValue(
        'specifications.health',
        specifications?.health ? parseInt(specifications.health, 10) : null,
      );
      form.setFieldValue(
        'specifications.impressions.max',
        specifications?.impressions?.max ? parseInt(specifications.impressions.max, 10) : null,
      );
      form.setFieldValue(
        'specifications.impressions.min',
        specifications?.impressions?.min ? parseInt(specifications.impressions.min, 10) : null,
      );
      form.setFieldValue('specifications.resolutions', specifications?.resolutions || '');
      form.setFieldValue(
        'specifications.size.height',
        specifications?.size?.height ? parseInt(specifications.size.height, 10) : null,
      );
      form.setFieldValue(
        'specifications.size.width',
        specifications?.size?.width ? parseInt(specifications.size.width, 10) : null,
      );
      form.setFieldValue(
        'specifications.spaceStatus.label',
        specifications?.spaceStatus?.name || '',
      );
      form.setFieldValue(
        'specifications.spaceStatus.value',
        specifications?.spaceStatus?._id || '',
      );
      const arrOfPreviousBrands = specifications?.previousBrands?.map(item => ({
        label: item?.name,
        value: item?._id,
      }));
      form.setFieldValue(
        'specifications.previousBrands',
        arrOfPreviousBrands?.length ? arrOfPreviousBrands : [],
      );
      const arrOfTags = specifications?.tags?.map(item => ({
        label: item?.name,
        value: item?._id,
      }));
      form.setFieldValue('specifications.tags', arrOfTags?.length ? arrOfTags : []);
      form.setFieldValue(
        'location.latitude',
        location?.latitude ? parseFloat(location.latitude, 10) : null,
      );
      form.setFieldValue(
        'location.longitude',
        location?.longitude ? parseFloat(location.longitude) : null,
      );
      form.setFieldValue('location.address', location?.address || '');
      form.setFieldValue('location.city', location?.city || '');
      form.setFieldValue('location.state', location?.state || '');
      form.setFieldValue('location.zip', location?.zip ? parseInt(location.zip, 10) : null);
      form.setFieldValue('location.zone', location?.zone || '');
      form.setFieldValue('location.landmark', location?.landmark || '');
      form.setFieldValue('location.facing', location?.facing || '');
      form.setFieldValue('location.tier', location?.tier || '');
    }
  }, [inventoryDetails]);

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto">
      <FormProvider form={form}>
        <form onSubmit={form.onSubmit(onSubmitInventoryForm)}>
          <Header
            setFormStep={setFormStep}
            formStep={formStep}
            isLoading={isLoading || isUpdateInventoryLoading}
            isSaved={isCreateSuccess || isEditSuccess}
          />
          {getForm()}
        </form>
      </FormProvider>

      <SuccessModal
        title="Inventory Successfully Added"
        prompt="Go to inventory"
        open={openSuccessModal}
        setOpenSuccessModal={setOpenSuccessModal}
        path="inventory"
      />
    </div>
  );
};

export default CreateSpace;

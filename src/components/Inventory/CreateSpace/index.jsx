import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@mantine/form';
import BasicInfo from './BasicInformation';
import Specification from './Specification';
import Location from './Location';
import SuccessModal from '../../shared/Modal';
import Preview from '../../shared/Preview';
import PreviewLocation from './PreviewLocation';
import Header from './Header';
import { FormProvider, useForm } from '../../../context/formContext';
import {
  useCreateInventory,
  useFetchInventoryById,
  useUpdateInventory,
} from '../../../hooks/inventory.hooks';

const requiredSchema = requiredText => yup.string().trim().required(requiredText);

const schema = action =>
  yup.object({
    basicInformation: yup.object({
      spaceName: yup
        .string()
        .trim()
        .concat(action === 1 ? requiredSchema('Space name is required') : null),
      landlord: yup
        .string()
        .trim()
        .concat(action === 1 ? requiredSchema('Landlord is required') : null),
      mediaOwner: yup.string().trim(),
      spaceType: yup.mixed().concat(
        action === 1
          ? yup
              .object({
                label: yup.string().trim(),
                value: yup.string().trim(),
              })
              .test('spaceType', 'Space Type is required', obj => obj.value !== '')
          : null,
      ),
      category: yup.mixed().concat(
        action === 1
          ? yup
              .object({
                label: yup.string().trim(),
                value: yup.string().trim(),
              })
              .test('category', 'Category is required', obj => obj.value !== '')
          : null,
      ),
      subCategory: yup.mixed().concat(
        action === 1
          ? yup.object({
              label: yup.string().trim(),
              value: yup.string().trim(),
            })
          : null,
      ),
      mediaType: yup.mixed().concat(
        action === 1
          ? yup
              .object({
                label: yup.string().trim(),
                value: yup.string().trim(),
              })
              .test('mediaType', 'Media Type is required', obj => obj.value !== '')
          : null,
      ),
      supportedMedia: yup.string().trim(),
      description: yup
        .string()
        .trim()
        .concat(action === 1 ? requiredSchema('Description is required') : null),
      price: yup
        .number()
        .nullable()
        .concat(
          action === 1
            ? yup
                .number()
                .positive('Price must be a positive number')
                .typeError('Price must be a number')
                .required('Price is required')
                .nullable()
            : null,
        ),
      spacePhotos: yup.string().trim(),
      otherPhotos: yup.array().of(yup.string().trim()),
      footFall: yup
        .number()
        .nullable()
        .concat(
          action === 1
            ? yup
                .number()
                .positive('FootFall must be a positive number')
                .typeError('FootFall must be a number')
                .required('Footfall is required')
                .nullable()
            : null,
        ),
      demographic: yup.mixed().concat(
        action === 1
          ? yup
              .object({
                label: yup.string().trim(),
                value: yup.string().trim(),
              })
              .test('demographic', 'Demographics is required', obj => obj.value !== '')
          : null,
      ),
      audience: yup
        .array()
        .of(yup.object({ label: yup.string(), value: yup.string() }))
        .test('audience', 'Audience is required', val => (action === 1 ? val?.length > 0 : true)),
    }),
    specifications: yup.object({
      illuminations: yup.mixed().concat(
        action === 2
          ? yup
              .object({
                label: yup.string().trim(),
                value: yup.string().trim(),
              })
              .test('illuminations', 'Illumination is required', obj => obj.value !== '')
          : null,
      ),
      spaceStatus: yup.mixed().concat(
        action === 2
          ? yup
              .object({
                label: yup.string().trim(),
                value: yup.string().trim(),
              })
              .test('spaceStatus', 'Space Status is required', obj => obj.value !== '')
          : null,
      ),
      unit: yup
        .number()
        .nullable()
        .concat(
          action === 2
            ? yup
                .number()
                .positive('Unit must be a positive number')
                .typeError('Unit must be a number')
                .required('Unit is required')
                .nullable()
            : null,
        ),
      resolutions: yup
        .string()
        .trim()
        .concat(action === 2 ? requiredSchema('Resolutions is required') : null),
      size: yup.object({
        height: yup
          .number()
          .nullable()
          .concat(
            action === 2
              ? yup
                  .number()
                  .positive('Height must be a positive number')
                  .typeError('Height must be a number')
                  .required('Height is required')
                  .nullable()
              : null,
          ),
        width: yup
          .number()
          .nullable()
          .concat(
            action === 2
              ? yup
                  .number()
                  .positive('Width must be a positive number')
                  .typeError('Width must be a number')
                  .required('Width is required')
                  .nullable()
              : null,
          ),
      }),
      health: yup
        .number()
        .nullable()
        .concat(
          action === 2
            ? yup
                .number()
                .positive('Health must be a positive number')
                .typeError('Health must be a number')
                .test('healthLimit', 'Health must be at max 100', val => val <= 100)
                .required('Health is required')
                .nullable()
            : null,
        ),
      impressions: yup.object({
        min: yup
          .number()
          .nullable()
          .concat(
            action === 2
              ? yup
                  .number()
                  .typeError('Min must be a number')
                  .required('Min is required')
                  .nullable()
              : null,
          ),
        max: yup
          .number()
          .nullable()
          .concat(
            action === 2
              ? yup
                  .number()
                  .typeError('Max must be a number')
                  .required('Max is required')
                  .nullable()
              : null,
          ),
      }),
      previousBrands: yup
        .array()
        .of(yup.object({ label: yup.string(), value: yup.string() }))
        .test('previousBrands', 'Previous Brand is required', val =>
          action === 2 ? val?.length > 0 : true,
        ),
      tags: yup
        .array()
        .of(yup.object({ label: yup.string(), value: yup.string() }))
        .test('tags', 'Tag is required', val => (action === 2 ? val?.length > 0 : true)),
    }),
    location: yup.object({
      latitude: yup
        .number()
        .nullable()
        .concat(
          action === 3
            ? yup
                .number()
                .typeError('Latitude must be a number')
                .required('Latitude is required')
                .nullable()
            : null,
        ),
      longitude: yup
        .number()
        .nullable()
        .concat(
          action === 3
            ? yup
                .number()
                .typeError('Longitude must be a number')
                .required('Longitude is required')
                .nullable()
            : null,
        ),
      address: yup
        .string()
        .trim()
        .concat(action === 3 ? requiredSchema('Address is required') : null),
      city: yup
        .string()
        .trim()
        .concat(action === 3 ? requiredSchema('City is required') : null),
      state: yup
        .string()
        .trim()
        .concat(action === 3 ? requiredSchema('State is required') : null),
      zip: yup
        .number()
        .nullable()
        .concat(
          action === 3
            ? yup
                .number()
                .typeError('Zip must be a number')
                .positive('Zip must be a positive number')
                .test('len', 'Zip must be 6 digits', val => val?.toString().length === 6)
                .required('Zip is required')
                .nullable()
            : null,
        ),
      zone: yup
        .string()
        .trim()
        .concat(action === 3 ? requiredSchema('Zone is required') : null),
      landmark: yup
        .string()
        .trim()
        .concat(action === 3 ? requiredSchema('Landmark is required') : null),
      facing: yup
        .string()
        .trim()
        .concat(action === 3 ? requiredSchema('Facing is required') : null),
      tier: yup
        .string()
        .trim()
        .concat(action === 3 ? requiredSchema('Tier is required') : null),
    }),
  });

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
    price: null,
    spacePhotos: '',
    otherPhotos: [''],
    footFall: null,
    demographic: { label: '', value: '' },
    audience: [],
  },
  specifications: {
    illuminations: { label: '', value: '' },
    spaceStatus: { label: '', value: '' },
    unit: null,
    resolutions: '',
    size: {
      height: null,
      width: null,
    },
    health: null,
    impressions: {
      min: null,
      max: null,
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

const MainArea = () => {
  const navigate = useNavigate();
  const { id: inventoryId } = useParams();
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const form = useForm({ validate: yupResolver(schema(formStep)), initialValues });

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
        update({ inventoryId, data });
      } else {
        create(data);
      }
      setTimeout(() => navigate('/inventory'), 2000);
    }
  };

  useEffect(() => {
    if (inventoryDetails) {
      const { basicInformation, specifications, location } = inventoryDetails;
      form.setFieldValue('basicInformation.spaceName', basicInformation?.spaceName || '');
      form.setFieldValue('basicInformation.landlord', basicInformation?.landlord || '');
      form.setFieldValue('basicInformation.mediaOwner', basicInformation?.mediaOwner?._id || '');
      form.setFieldValue('basicInformation.description', basicInformation?.description || '');
      form.setFieldValue('basicInformation.footFall', basicInformation?.footFall || null);
      form.setFieldValue('basicInformation.price', basicInformation?.price || null);
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
      form.setFieldValue('basicInformation.spacePhotos', basicInformation?.spacePhotos || '');
      form.setFieldValue('basicInformation.otherPhotos', basicInformation?.otherPhotos || ['']);
      form.setFieldValue(
        'specifications.illuminations.label',
        specifications?.illuminations?.name || '',
      );
      form.setFieldValue(
        'specifications.illuminations.value',
        specifications?.illuminations?._id || '',
      );
      form.setFieldValue('specifications.unit', specifications?.unit || null);
      form.setFieldValue('specifications.health', specifications?.health || null);
      form.setFieldValue(
        'specifications.impressions.max',
        specifications?.impressions?.max || null,
      );
      form.setFieldValue(
        'specifications.impressions.min',
        specifications?.impressions?.min || null,
      );
      form.setFieldValue('specifications.resolutions', specifications?.resolutions || '');
      form.setFieldValue('specifications.size.height', specifications?.size?.height || null);
      form.setFieldValue('specifications.size.width', specifications?.size?.width || null);
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
      form.setFieldValue('location.latitude', location?.latitude || null);
      form.setFieldValue('location.longitude', location?.longitude || null);
      form.setFieldValue('location.address', location?.address || '');
      form.setFieldValue('location.city', location?.city || '');
      form.setFieldValue('location.state', location?.state || '');
      form.setFieldValue('location.zip', location?.zip || null);
      form.setFieldValue('location.zone', location?.zone || '');
      form.setFieldValue('location.landmark', location?.landmark || '');
      form.setFieldValue('location.facing', location?.facing || '');
      form.setFieldValue('location.tier', location?.tier || '');
    }
  }, [inventoryDetails]);

  return (
    <>
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
    </>
  );
};

export default MainArea;

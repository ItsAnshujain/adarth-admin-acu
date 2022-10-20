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
  yup.object().shape({
    basicInformation: yup.object().shape({
      spaceName: yup
        .string()
        .trim()
        .concat(action === 1 ? requiredSchema('Space name is required') : null),
      landlord: yup.string().trim(),
      mediaOwner: yup.string().trim(),
      spaceType: yup
        .string()
        .trim()
        .concat(action === 1 ? requiredSchema('Space Type is required') : null),
      category: yup
        .string()
        .trim()
        .concat(action === 1 ? requiredSchema('Category is required') : null),
      subCategory: yup
        .string()
        .trim()
        .concat(action === 1 ? requiredSchema('Sub category is required') : null),
      mediaType: yup
        .string()
        .trim()
        .concat(action === 1 ? requiredSchema('Media Type is required') : null),
      supportedMedia: yup.string().trim(),
      description: yup
        .string()
        .trim()
        .concat(action === 1 ? requiredSchema('Description is required') : null),
      price: yup
        .number()
        .concat(
          action === 1
            ? yup.number().typeError('Price must be a number').required('Price is required')
            : null,
        ),
      // spacePhotos: yup.array().of(yup.string().trim()),
      spacePhotos: yup.string().trim(),
      otherPhotos: yup.array().of(yup.string().trim()),
      footFall: yup
        .number()
        .concat(
          action === 1
            ? yup.number().typeError('FootFall must be a number').required('Footfall is required')
            : null,
        ),
      demographic: yup
        .string()
        .trim()
        .concat(action === 1 ? requiredSchema('Demographics is required') : null),
      audience: yup
        .string()
        .trim()
        .concat(action === 1 ? requiredSchema('Audience is required') : null),
    }),
    specifications: yup.object().shape({
      illuminations: yup
        .string()
        .trim()
        .concat(action === 2 ? requiredSchema('Illumination is required') : null),
      unit: yup
        .number()
        .concat(
          action === 2
            ? yup.number().typeError('Unit must be a number').required('Unit is required')
            : null,
        ),
      resolutions: yup.object({
        height: yup
          .number()
          .concat(
            action === 2
              ? yup.number().typeError('Height must be a number').required('Height is required')
              : null,
          ),
        width: yup
          .number()
          .concat(
            action === 2
              ? yup.number().typeError('Width must be a number').required('Width is required')
              : null,
          ),
      }),
      health: yup
        .number()
        .concat(
          action === 2
            ? yup.number().typeError('Health must be a number').required('Health is required')
            : null,
        ),
      impressions: yup.object({
        min: yup
          .number()
          .concat(
            action === 2
              ? yup.number().typeError('Min must be a number').required('Min is required')
              : null,
          ),
        max: yup
          .number()
          .concat(
            action === 2
              ? yup.number().typeError('Max must be a number').required('Max is required')
              : null,
          ),
      }),
      previousBrands: yup.lazy(() =>
        action === 2
          ? yup
              .array()
              .of(yup.string().trim())
              .test(
                'previousBrands',
                'Previous Brand is required',
                e => e.length > 0 && e?.[0] !== '',
              )
          : yup.array(),
      ),
      tags: yup.lazy(() =>
        action === 2
          ? yup
              .array()
              .of(yup.string().trim())
              .test('tags', 'Tag is required', e => e.length > 0 && e?.[0] !== '')
          : yup.array(),
      ),
    }),
    location: yup.object().shape({
      latitude: yup
        .number()
        .concat(
          action === 3
            ? yup.number().typeError('Latitude must be a number').required('Latitude is required')
            : null,
        ),
      longitude: yup
        .number()
        .concat(
          action === 3
            ? yup.number().typeError('Longitude must be a number').required('Longitude is required')
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
        .concat(
          action === 3
            ? yup.number().typeError('Zip must be a number').required('Zip is required')
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
    }),
  });

const initialValues = {
  basicInformation: {
    spaceName: '',
    landlord: '',
    mediaOwner: '',
    category: '',
    subCategory: '',
    spaceType: '',
    mediaType: '',
    supportedMedia: '',
    description: '',
    price: 0,
    // spacePhotos: [''],
    spacePhotos: '',
    otherPhotos: [''],
    footFall: 0,
    demographic: '',
    audience: '',
  },
  specifications: {
    illuminations: '',
    unit: 0,
    resolutions: {
      height: 0,
      width: 0,
    },
    health: 0,
    impressions: {
      min: 0,
      max: 0,
    },
    previousBrands: [''],
    tags: [''],
  },
  location: {
    latitude: 0,
    longitude: 0,
    address: '',
    city: '',
    state: '',
    zip: 0,
    zone: '',
    landmark: '',
    facing: '',
  },
};

const MainArea = () => {
  const navigate = useNavigate();
  const { id: inventoryId } = useParams();
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const form = useForm({ validate: yupResolver(schema(formStep)), initialValues });

  const { mutate: create, isLoading } = useCreateInventory();
  const { mutate: update, isLoading: isUpdateInventoryLoading } = useUpdateInventory();
  const { data: inventoryDetails } = useFetchInventoryById(inventoryId, !!inventoryId);

  const getForm = () =>
    formStep === 1 ? (
      <BasicInfo />
    ) : formStep === 2 ? (
      <Specification specificationsData={inventoryDetails?.specifications} />
    ) : formStep === 3 ? (
      <Location />
    ) : formStep === 4 ? (
      <>
        <Preview />
        <PreviewLocation />
      </>
    ) : null;

  const onSubmitInventoryForm = formData => {
    const data = formData;
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
      form.setFieldValue('basicInformation.spaceName', basicInformation?.spaceName);
      form.setFieldValue('basicInformation.description', basicInformation?.description);
      form.setFieldValue('basicInformation.footFall', basicInformation?.footFall);
      form.setFieldValue('basicInformation.price', basicInformation?.price);
      form.setFieldValue('basicInformation.category', basicInformation?.category);
      if (basicInformation?.category) {
        form.setFieldValue('basicInformation.subCategory', basicInformation?.subCategory);
      }
      form.setFieldValue('basicInformation.spaceType', basicInformation?.spaceType);
      form.setFieldValue('basicInformation.mediaType', basicInformation?.mediaType);
      form.setFieldValue('basicInformation.demographic', basicInformation?.demographic);
      form.setFieldValue('basicInformation.audience', basicInformation?.audience);
      form.setFieldValue('basicInformation.spacePhotos', basicInformation?.spacePhotos);
      form.setFieldValue('specifications.illuminations', specifications?.illuminations);
      form.setFieldValue('specifications.unit', specifications?.unit);
      form.setFieldValue('specifications.health', specifications?.health);
      form.setFieldValue('specifications.impressions.max', specifications?.impressions?.max);
      form.setFieldValue('specifications.impressions.min', specifications?.impressions?.min);
      form.setFieldValue('specifications.resolutions.height', specifications?.resolutions?.height);
      form.setFieldValue('specifications.resolutions.width', specifications?.resolutions?.width);
      form.setFieldValue('specifications.previousBrands', specifications?.previousBrands);
      form.setFieldValue('specifications.tags', specifications?.tags);
      form.setFieldValue('location.latitude', location?.latitude);
      form.setFieldValue('location.longitude', location?.longitude);
      form.setFieldValue('location.address', location?.address);
      form.setFieldValue('location.city', location?.city);
      form.setFieldValue('location.state', location?.state);
      form.setFieldValue('location.zip', location?.zip);
      form.setFieldValue('location.zone', location?.zone);
      form.setFieldValue('location.landmark', location?.landmark);
      form.setFieldValue('location.facing', location?.facing);
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
          />
          {getForm()}
        </form>
      </FormProvider>

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

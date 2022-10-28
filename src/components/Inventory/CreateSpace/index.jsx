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
      spaceType: yup.mixed().concat(
        action === 1
          ? yup
              .object()
              .shape({
                label: yup.string().trim(),
                value: yup.string().trim(),
              })
              .test('spaceType', 'Space Type is required', obj => obj.value !== '')
          : null,
      ),
      category: yup.mixed().concat(
        action === 1
          ? yup
              .object()
              .shape({
                label: yup.string().trim(),
                value: yup.string().trim(),
              })
              .test('category', 'Category is required', obj => obj.value !== '')
          : null,
      ),
      subCategory: yup.mixed().concat(
        action === 1
          ? yup.object().shape({
              label: yup.string().trim(),
              value: yup.string().trim(),
            })
          : null,
      ),
      mediaType: yup.mixed().concat(
        action === 1
          ? yup
              .object()
              .shape({
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
        .string()
        .trim()
        .concat(
          action === 1 ? yup.string().matches(/^\d+$/, 'Price must be a positive number') : null,
        )
        .concat(action === 1 ? requiredSchema('Price is required') : null),
      spacePhotos: yup.string().trim(),
      otherPhotos: yup.array().of(yup.string().trim()),
      footFall: yup
        .string()
        .trim()
        .concat(
          action === 1 ? yup.string().matches(/^\d+$/, 'Footfall must be a positive number') : null,
        )
        .concat(action === 1 ? requiredSchema('Footfall is required') : null),
      demographic: yup.mixed().concat(
        action === 1
          ? yup
              .object()
              .shape({
                label: yup.string().trim(),
                value: yup.string().trim(),
              })
              .test('demographic', 'Demographics is required', obj => obj.value !== '')
          : null,
      ),
      audience: yup.mixed().concat(
        action === 1
          ? yup
              .object()
              .shape({
                label: yup.string().trim(),
                value: yup.string().trim(),
              })
              .test('audience', 'Audience is required', obj => obj.value !== '')
          : null,
      ),
    }),
    specifications: yup.object().shape({
      illuminations: yup.mixed().concat(
        action === 2
          ? yup
              .object()
              .shape({
                label: yup.string().trim(),
                value: yup.string().trim(),
              })
              .test('illuminations', 'Illumination is required', obj => obj.value !== '')
          : null,
      ),
      spaceStatus: yup.mixed().concat(
        action === 2
          ? yup
              .object()
              .shape({
                label: yup.string().trim(),
                value: yup.string().trim(),
              })
              .test('spaceStatus', 'Space Status is required', obj => obj.value !== '')
          : null,
      ),
      unit: yup
        .string()
        .trim()
        .concat(
          action === 2 ? yup.string().matches(/^\d+$/, 'Unit must be a positive number') : null,
        )
        .concat(action === 2 ? requiredSchema('Unit is required') : null),
      resolutions: yup.object().shape({
        height: yup
          .string()
          .trim()
          .concat(
            action === 2 ? yup.string().matches(/^\d+$/, 'Height must be a positive number') : null,
          )
          .concat(action === 2 ? requiredSchema('Height is required') : null),
        width: yup
          .string()
          .trim()
          .concat(
            action === 2 ? yup.string().matches(/^\d+$/, 'Width must be a positive number') : null,
          )
          .concat(action === 2 ? requiredSchema('Width is required') : null),
      }),
      health: yup
        .string()
        .trim()
        .concat(
          action === 2 ? yup.string().matches(/^\d+$/, 'Health must be a positive number') : null,
        )
        .concat(action === 2 ? requiredSchema('Health is required') : null),
      impressions: yup.object().shape({
        min: yup
          .string()
          .trim()
          .concat(
            action === 2 ? yup.string().matches(/^\d+$/, 'Min must be a positive number') : null,
          )
          .concat(action === 2 ? requiredSchema('Min is required') : null),
        max: yup
          .string()
          .trim()
          .concat(
            action === 2 ? yup.string().matches(/^\d+$/, 'Max must be a positive number') : null,
          )
          .concat(action === 2 ? requiredSchema('Max is required') : null),
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
        .string()
        .trim()
        .concat(
          action === 3
            ? yup
                .string()
                .min(6, 'Zip must be at least 6 digits')
                .matches(/^\d+$/, 'Zip must be a positive number')
            : null,
        )
        .concat(action === 3 ? requiredSchema('Zip is required') : null),
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
    category: { label: '', value: '' },
    subCategory: { label: '', value: '' },
    spaceType: { label: '', value: '' },
    mediaType: { label: '', value: '' },
    supportedMedia: '',
    description: '',
    price: '',
    spacePhotos: '',
    otherPhotos: [''],
    footFall: '',
    demographic: { label: '', value: '' },
    audience: { label: '', value: '' },
  },
  specifications: {
    illuminations: { label: '', value: '' },
    spaceStatus: { label: '', value: '' },
    unit: '',
    resolutions: {
      height: '',
      width: '',
    },
    health: '',
    impressions: {
      min: '',
      max: '',
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
    zip: '',
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
        price: formData?.basicInformation?.price
          ? parseInt(formData.basicInformation.price, 10)
          : '',
        footFall: formData?.basicInformation?.footFall
          ? parseInt(formData.basicInformation.footFall, 10)
          : '',
        audience: formData?.basicInformation?.audience?.value,
        category: formData?.basicInformation?.category?.value,
        demographic: formData?.basicInformation?.demographic?.value,
        mediaType: formData?.basicInformation?.mediaType?.value,
        spaceType: formData?.basicInformation?.spaceType?.value,
        subCategory: formData?.basicInformation?.subCategory?.value,
      },
      specifications: {
        ...formData.specifications,
        unit: formData?.specifications?.unit ? parseInt(formData.specifications.unit, 10) : '',
        health: formData?.specifications?.health
          ? parseInt(formData.specifications.health, 10)
          : '',
        resolutions: {
          height: formData?.specifications?.resolutions?.height
            ? parseInt(formData.specifications?.resolutions.height, 10)
            : '',
          width: formData?.specifications?.resolutions?.width
            ? parseInt(formData.specifications?.resolutions.width, 10)
            : '',
        },
        impressions: {
          min: formData?.specifications?.impressions?.min
            ? parseInt(formData.specifications?.impressions.min, 10)
            : '',
          max: formData?.specifications?.impressions?.max
            ? parseInt(formData.specifications?.impressions.max, 10)
            : '',
        },
        illuminations: formData?.specifications?.illuminations?.value,
        spaceStatus: formData?.specifications?.spaceStatus?.value,
      },
      location: {
        ...formData.location,
        zip: formData?.location?.zip ? parseInt(formData.location.zip, 10) : '',
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
        data.isUnderMaintenance = false;
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
      form.setFieldValue(
        'basicInformation.spaceName',
        basicInformation?.spaceName ? basicInformation.spaceName : '',
      );
      form.setFieldValue(
        'basicInformation.description',
        basicInformation?.description ? basicInformation.description : '',
      );
      form.setFieldValue(
        'basicInformation.footFall',
        basicInformation?.footFall ? basicInformation.footFall : '',
      );
      form.setFieldValue(
        'basicInformation.price',
        basicInformation?.price ? basicInformation.price : '',
      );
      form.setFieldValue(
        'basicInformation.category.label',
        basicInformation?.category ? basicInformation.category.name : { label: '', value: '' },
      );
      form.setFieldValue(
        'basicInformation.category.value',
        basicInformation?.category ? basicInformation.category._id : { label: '', value: '' },
      );
      if (basicInformation?.category) {
        form.setFieldValue(
          'basicInformation.subCategory.label',
          basicInformation?.subCategory
            ? basicInformation.subCategory.name
            : { label: '', value: '' },
        );
        form.setFieldValue(
          'basicInformation.subCategory.value',
          basicInformation?.subCategory
            ? basicInformation.subCategory._id
            : { label: '', value: '' },
        );
      }
      form.setFieldValue(
        'basicInformation.spaceType.label',
        basicInformation?.spaceType ? basicInformation.spaceType.name : '',
      );
      form.setFieldValue(
        'basicInformation.spaceType.value',
        basicInformation?.spaceType ? basicInformation.spaceType._id : '',
      );
      form.setFieldValue(
        'basicInformation.mediaType.label',
        basicInformation?.mediaType ? basicInformation.mediaType.name : { label: '', value: '' },
      );
      form.setFieldValue(
        'basicInformation.mediaType.value',
        basicInformation?.mediaType ? basicInformation.mediaType._id : { label: '', value: '' },
      );
      form.setFieldValue(
        'basicInformation.supportedMedia',
        basicInformation?.supportedMedia ? basicInformation.supportedMedia : '',
      );
      form.setFieldValue(
        'basicInformation.demographic.label',
        basicInformation?.demographic
          ? basicInformation.demographic.name
          : { label: '', value: '' },
      );
      form.setFieldValue(
        'basicInformation.demographic.value',
        basicInformation?.demographic ? basicInformation.demographic._id : { label: '', value: '' },
      );
      form.setFieldValue(
        'basicInformation.audience.label',
        basicInformation?.audience ? basicInformation.audience.name : { label: '', value: '' },
      );
      form.setFieldValue(
        'basicInformation.audience.value',
        basicInformation?.audience ? basicInformation.audience._id : { label: '', value: '' },
      );
      form.setFieldValue(
        'basicInformation.spacePhotos',
        basicInformation?.spacePhotos ? basicInformation.spacePhotos : '',
      );
      form.setFieldValue(
        'basicInformation.otherPhotos',
        basicInformation?.otherPhotos ? basicInformation.otherPhotos : [''],
      );
      form.setFieldValue(
        'specifications.illuminations.label',
        specifications?.illuminations
          ? specifications.illuminations.name
          : { label: '', value: '' },
      );
      form.setFieldValue(
        'specifications.illuminations.value',
        specifications?.illuminations ? specifications.illuminations._id : { label: '', value: '' },
      );
      form.setFieldValue('specifications.unit', specifications?.unit ? specifications.unit : '');
      form.setFieldValue(
        'specifications.health',
        specifications?.health ? specifications.health : '',
      );
      form.setFieldValue(
        'specifications.impressions.max',
        specifications?.impressions?.max ? specifications.impressions.max : '',
      );
      form.setFieldValue(
        'specifications.impressions.min',
        specifications?.impressions?.min ? specifications.impressions.min : '',
      );
      form.setFieldValue(
        'specifications.resolutions.height',
        specifications?.resolutions?.height ? specifications.resolutions.height : '',
      );
      form.setFieldValue(
        'specifications.resolutions.width',
        specifications?.resolutions?.width ? specifications.resolutions.width : '',
      );
      form.setFieldValue(
        'specifications.spaceStatus.label',
        specifications?.spaceStatus ? specifications.spaceStatus.name : { label: '', value: '' },
      );
      form.setFieldValue(
        'specifications.spaceStatus.value',
        specifications?.spaceStatus ? specifications.spaceStatus._id : { label: '', value: '' },
      );
      if (specifications?.previousBrands) {
        const arrOfPreviousBrandsIds = specifications.previousBrands?.map(item => item._id);
        form.setFieldValue(
          'specifications.previousBrands',
          arrOfPreviousBrandsIds?.length ? arrOfPreviousBrandsIds : [''],
        );
      }
      if (specifications?.tags) {
        const arrOfTagsIds = specifications.tags?.map(item => item._id);
        form.setFieldValue('specifications.tags', arrOfTagsIds?.length ? arrOfTagsIds : ['']);
      }
      form.setFieldValue('location.latitude', location?.latitude ? location.latitude : 0);
      form.setFieldValue('location.longitude', location?.longitude ? location.longitude : 0);
      form.setFieldValue('location.address', location?.address ? location.address : '');
      form.setFieldValue('location.city', location?.city ? location.city : '');
      form.setFieldValue('location.state', location?.state ? location.state : '');
      form.setFieldValue('location.zip', location?.zip ? location.zip : '');
      form.setFieldValue('location.zone', location?.zone ? location.zone : '');
      form.setFieldValue('location.landmark', location?.landmark ? location.landmark : '');
      form.setFieldValue('location.facing', location?.facing ? location.facing : '');
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

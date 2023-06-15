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
    mediaOwner: { label: '', value: '' },
    category: { label: '', value: '' },
    subCategory: { label: '', value: '' },
    spaceType: { label: '', value: '' },
    mediaType: { label: '', value: '' },
    supportedMedia: '',
    description: '',
    spacePhoto: '',
    otherPhotos: [],
    footFall: null,
    demographic: { label: '', value: '' },
    audience: [],
  },
  specifications: {
    illuminations: { label: '', value: '' },
    resolutions: '',
    size: {
      height: 0,
      width: 0,
    },
    health: null,
    impressions: {
      min: 0,
      max: 0,
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
    mediaOwner: yup.object({
      label: yup.string().trim(),
      value: yup.string().trim(),
    }),
    peerMediaOwner: yup.string().trim(),
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
    unit: yup
      .number()
      .positive('Unit must be a positive number')
      .typeError('Unit must be a number')
      .required('Unit is required'),
    resolutions: yup.string().trim(),
    size: yup.mixed({
      height: yup
        .number()
        .positive('Height must be a positive number')
        .typeError('Height must be a number'),
      width: yup
        .number()
        .positive('Width must be a positive number')
        .typeError('Width must be a number'),
    }),
    health: yup
      .number()
      .min(0, 'Health Status must be greater than or equal to 0')
      .max(100, 'Health Status must be less than or equal to 100')
      .nullable(true),
    impressions: yup.object({
      min: yup.number(),
      max: yup.number(),
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
    faciaTowards: yup.string().trim(),
  }),
});

const schemas = [basicInformationSchema, specificationsValues, locationValues, yup.object()];

const CreateInventoryPage = () => {
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
  const {
    data: inventoryDetails,
    status,
    fetchStatus,
  } = useFetchInventoryById(inventoryId, !!inventoryId);

  const getForm = () =>
    formStep === 1 ? (
      <BasicInfo basicInformation={inventoryDetails?.inventory?.basicInformation} />
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
        mediaOwner: formData?.basicInformation?.mediaOwner?.value,
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
        previousBrands: formData?.specifications?.previousBrands?.map(item => item?.value),
        tags: formData?.specifications?.tags?.map(item => item?.value),
      },
      company: formData?.basicInformation?.mediaOwner?.label,
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
    if (inventoryDetails?.inventory) {
      const { basicInformation, specifications, location } = inventoryDetails.inventory;

      const arrOfAudience = basicInformation?.audience?.map(item => ({
        label: item?.name,
        value: item?._id,
      }));
      const arrOfPreviousBrands = specifications?.previousBrands?.map(item => ({
        label: item?.name,
        value: item?._id,
      }));
      const arrOfTags = specifications?.tags?.map(item => ({
        label: item?.name,
        value: item?._id,
      }));

      form.setValues({
        basicInformation: {
          spaceName: basicInformation?.spaceName || '',
          landlord: basicInformation?.landlord || '',
          mediaOwner: {
            label: basicInformation?.mediaOwner?.name || '',
            value: basicInformation?.mediaOwner?._id || '',
          },
          peerMediaOwner: basicInformation?.peerMediaOwner || undefined,
          description: basicInformation?.description || '',
          footFall: basicInformation?.footFall ? parseInt(basicInformation.footFall, 10) : null,
          price: basicInformation?.price ? parseInt(basicInformation?.price, 10) : null,
          category: {
            label: basicInformation?.category?.name || '',
            value: basicInformation?.category?._id || '',
          },
          subCategory: {
            label: basicInformation?.category ? basicInformation?.subCategory?.name : '',
            value: basicInformation?.category ? basicInformation?.subCategory?._id : '',
          },
          spaceType: {
            label: basicInformation?.spaceType?.name || '',
            value: basicInformation?.spaceType?._id || '',
          },
          mediaType: {
            label: basicInformation?.mediaType?.name || '',
            value: basicInformation?.mediaType?._id || '',
          },
          supportedMedia: basicInformation?.supportedMedia || '',
          demographic: {
            label: basicInformation?.demographic?.name || '',
            value: basicInformation?.demographic?._id || '',
          },
          audience: arrOfAudience || [],
          spacePhoto: basicInformation?.spacePhoto || '',
          otherPhotos: basicInformation?.otherPhotos || [],
        },
        specifications: {
          illuminations: {
            label: specifications?.illuminations?.name || '',
            value: specifications?.illuminations?._id || '',
          },
          unit: specifications?.unit ? parseInt(specifications.unit, 10) : null,
          health: specifications?.health ? parseInt(specifications.health, 10) : null,
          impressions: {
            max: specifications?.impressions?.max
              ? parseInt(specifications.impressions.max, 10)
              : 0,
            min: specifications?.impressions?.min
              ? parseInt(specifications.impressions.min, 10)
              : 0,
          },
          resolutions: specifications?.resolutions || '',
          size: {
            height: specifications?.size?.height ? parseInt(specifications.size.height, 10) : 0,
            width: specifications?.size?.width ? parseInt(specifications.size.width, 10) : 0,
          },
          previousBrands: arrOfPreviousBrands?.length ? arrOfPreviousBrands : [],
          tags: arrOfTags?.length ? arrOfTags : [],
        },
        location: {
          latitude: location?.latitude ? parseFloat(location.latitude, 10) : null,
          longitude: location?.longitude ? parseFloat(location.longitude) : null,
          address: location?.address || '',
          city: location?.city || '',
          state: location?.state || '',
          zip: location?.zip ? parseInt(location.zip, 10) : null,
          zone: location?.zone || '',
          landmark: location?.landmark || '',
          facing: location?.facing || '',
          tier: location?.tier || '',
          faciaTowards: location?.faciaTowards || undefined,
        },
      });
    }
  }, [inventoryDetails?.inventory]);

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 border-l border-gray-450 overflow-y-auto">
      <FormProvider form={form}>
        <form onSubmit={form.onSubmit(onSubmitInventoryForm)}>
          <Header
            setFormStep={setFormStep}
            formStep={formStep}
            isLoading={
              isLoading ||
              isUpdateInventoryLoading ||
              (fetchStatus === 'fetching' && status === 'loading')
            }
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

export default CreateInventoryPage;

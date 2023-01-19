import * as yup from 'yup';

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

export default schemas;

import { useState } from 'react';
import { yupResolver } from '@mantine/form';
import * as yup from 'yup';
import dayjs from 'dayjs';
import { showNotification } from '@mantine/notifications';
import validator from 'validator';
import { useNavigate } from 'react-router-dom';
import BasicInfo from '../../components/Bookings/Create/BasicInformation';
import SelectSpaces from '../../components/Bookings/Create/SelectSpaces';
import OrderInfo from '../../components/Bookings/Create/OrderInformation';
import SuccessModal from '../../components/shared/Modal';
import Header from '../../components/Bookings/Create/Header';
import { FormProvider, useForm } from '../../context/formContext';
import { useCreateBookings } from '../../hooks/booking.hooks';
import { gstRegexMatch, panRegexMatch, isValidURL } from '../../utils';

const DATE_FORMAT = 'YYYY-MM-DD';

const initialValues = {
  client: {
    companyName: '',
    name: '',
    email: '',
    contactNumber: '',
    panNumber: '',
    gstNumber: '',
  },
  paymentReference: '',
  paymentType: 'neft',
  campaignName: '',
  description: '',
  place: [],
  price: 0,
  industry: '',
};

const basicInformationSchema = yup.object({
  client: yup.object({
    companyName: yup.string().trim().required('Company name is required'),
    name: yup.string().trim().required('Client name is required'),
    email: yup.string().trim().email('Email must be valid'),
    contactNumber: yup
      .string()
      .trim()
      .test('valid', 'Contact Number must be valid', val => {
        if (val) {
          return validator.isMobilePhone(val, 'en-IN');
        }

        return true;
      }),
    panNumber: yup
      .string()
      .trim()
      .matches(panRegexMatch, 'Pan number must be valid and in uppercase'),
    gstNumber: yup
      .string()
      .trim()
      .matches(gstRegexMatch, 'GST number must be valid and in uppercase'),
  }),
  paymentReference: yup.string().trim(),
  paymentType: yup.string().trim(),
});

const campaignInformationSchema = yup.object({
  campaignName: yup.string().trim().required('Campaign name is required'),
  description: yup.string().trim(),
  industry: yup.string().trim().required('Industry is required'),
});

const schemas = [basicInformationSchema, campaignInformationSchema, yup.object()];

const CreateBooking = () => {
  const navigate = useNavigate();
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const form = useForm({ validate: yupResolver(schemas[formStep - 1]), initialValues });
  const { mutateAsync: createBooking, isLoading } = useCreateBookings();

  const handleSubmit = async formData => {
    setFormStep(prevState => prevState + 1);
    if (formStep === 3) {
      const data = { ...formData };
      setFormStep(3);
      if (!form.values?.place?.length) {
        showNotification({
          title: 'Please select atleast one place to continue',
          color: 'blue',
        });
        return;
      }

      let minDate = null;
      let maxDate = null;

      data.place = form.values?.place?.map(item => ({
        id: item._id,
        price: +item.price,
        media: isValidURL(item.media) ? item.media : undefined,
        startDate: dayjs(item.startDate).format(DATE_FORMAT),
        endDate: dayjs(item.endDate).format(DATE_FORMAT),
      }));
      if (data.place.some(item => !(item.startDate || item.endDate))) {
        showNotification({
          title: 'Please select the occupancy date to continue',
          color: 'blue',
        });
        return;
      }

      data.place.forEach(item => {
        const start = item.startDate;
        const end = item.endDate;

        if (!minDate) minDate = start;
        if (!maxDate) maxDate = end;

        if (start < minDate) minDate = start;
        if (end > maxDate) maxDate = end;
      });

      if (data?.client?.panNumber) {
        data.client.panNumber = data.client.panNumber?.toUpperCase();
      }
      if (data?.client?.gstNumber) {
        data.client.gstNumber = data.client.gstNumber?.toUpperCase();
      }

      const totalPrice = form.values?.place?.reduce((acc, item) => acc + +(item.price || 0), 0);
      const gstCalculation = totalPrice * 0.18;
      data.price = totalPrice + gstCalculation;

      Object.keys(data).forEach(k => {
        if (data[k] === '') {
          delete data[k];
        }
      });

      Object.keys(data.client).forEach(k => {
        if (data.client[k] === '') {
          delete data.client[k];
        }
      });

      await createBooking(
        {
          ...data,
          startDate: minDate,
          endDate: maxDate,
        },
        {
          onSuccess: () => {
            setOpenSuccessModal(true);
            setTimeout(() => {
              navigate('/bookings');
              form.reset();
            }, 2000);
          },
        },
      );
    }
  };

  const getForm = () =>
    formStep === 1 ? <BasicInfo /> : formStep === 2 ? <OrderInfo /> : <SelectSpaces />;

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 border-l border-gray-450 overflow-y-auto">
      <FormProvider form={form}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Header setFormStep={setFormStep} formStep={formStep} isLoading={isLoading} />
          {getForm()}
        </form>
      </FormProvider>
      <SuccessModal
        title="Order Successfully Created"
        prompt="Visit Order List"
        open={openSuccessModal}
        setOpenSuccessModal={setOpenSuccessModal}
        path="bookings"
      />
    </div>
  );
};

export default CreateBooking;

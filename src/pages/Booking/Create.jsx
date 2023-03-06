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
  // TODO: send total price
};

const basicInformationSchema = yup.object({
  client: yup.object({
    companyName: yup.string().trim().required('Company name is required'),
    name: yup.string().trim().required('Client name is required'),
    email: yup.string().trim().email('Email must be valid').required('Email is required'),
    contactNumber: yup
      .string()
      .trim()
      .test('valid', 'Contact Number must be valid', val => validator.isMobilePhone(val, 'en-IN'))
      .required('Contact Number is required'),
    panNumber: yup
      .string()
      .trim()
      .matches(panRegexMatch, 'Pan number must be valid and in uppercase')
      .required('Pan number is required'),
    gstNumber: yup
      .string()
      .trim()
      .matches(gstRegexMatch, 'GST number must be valid and in uppercase')
      .required('GST number is required'),
  }),
  paymentReference: yup.string().trim().required('Payment reference number is required'),
  paymentType: yup.string().trim(),
});

const campaignInformationSchema = yup.object({
  campaignName: yup.string().trim().required('Campaign name is required'),
  description: yup.string().trim(),
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
      if (form.values?.place?.length === 0) {
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
        startDate: item.startDate,
        endDate: item.endDate,
      }));
      if (data.place.some(item => !(item.startDate || item.endDate))) {
        showNotification({
          title: 'Please select the occupancy date to continue',
          color: 'blue',
        });
        return;
      }

      data.place.forEach(item => {
        const start = item.startDate.setHours(0, 0, 0, 0);
        const end = item.endDate.setHours(0, 0, 0, 0);

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

      await createBooking(
        {
          ...data,
          startDate: dayjs(minDate).format('YYYY-MM-DD'),
          endDate: dayjs(maxDate).format('YYYY-MM-DD'),
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
    <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto">
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

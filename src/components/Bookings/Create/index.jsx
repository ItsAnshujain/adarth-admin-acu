import { useState } from 'react';
import { yupResolver } from '@mantine/form';
import * as yup from 'yup';
import dayjs from 'dayjs';
import { showNotification } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import BasicInfo from './BasicInformation';
import SelectSpaces from './SelectSpaces';
import OrderInfo from './OrderInformation';
import SuccessModal from '../../shared/Modal';
import Header from './Header';
import { FormProvider, useForm } from '../../../context/formContext';
import { useCreateBookings } from '../../../hooks/booking.hooks';
import { gstRegexMatch, panRegexMatch, isValidURL } from '../../../utils';

const requiredSchema = text => yup.string().trim().required(text);

const schema = step =>
  yup.object().shape({
    client: yup.object().shape({
      companyName: yup
        .string()
        .trim()
        .concat(step === 1 ? requiredSchema('Company name is required') : null),
      name: yup
        .string()
        .trim()
        .concat(step === 1 ? requiredSchema('Client name is required') : null),
      email: yup
        .string()
        .trim()
        .concat(step === 1 ? yup.string().email('Email must be valid') : null)
        .concat(step === 1 ? requiredSchema('Email is required') : null),
      contactNumber: yup
        .string()
        .trim()
        .concat(
          step === 1
            ? yup
                .string()
                .matches(
                  /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
                  'Contact number must be valid',
                )
            : null,
        )
        .concat(step === 1 ? requiredSchema('Contact Number is required') : null),
      panNumber: yup
        .string()
        .trim()
        .concat(
          step === 1
            ? yup.string().matches(panRegexMatch, 'Pan number must be valid and in uppercase')
            : null,
        )
        .concat(step === 1 ? requiredSchema('Pan number is required') : null),
      gstNumber: yup
        .string()
        .trim()
        .concat(
          step === 1
            ? yup.string().matches(gstRegexMatch, 'GST number must be valid and in uppercase')
            : null,
        )
        .concat(step === 1 ? requiredSchema('GST number is required') : null),
    }),
    paymentReference: yup
      .string()
      .trim()
      .concat(step === 1 ? requiredSchema('Payment reference number is required') : null),
    paymentType: yup
      .string()
      .trim()
      .concat(step === 1 ? requiredSchema('Payment type is required') : null),
    campaignName: yup
      .string()
      .trim()
      .concat(step === 2 ? requiredSchema('Campaign name is required') : null),
    description: yup.string().trim(),
  });

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
};

const MainArea = () => {
  const navigate = useNavigate();
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const form = useForm({ validate: yupResolver(schema(formStep)), initialValues });

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
    <>
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
    </>
  );
};

export default MainArea;

import { useRef, useState } from 'react';
import { yupResolver } from '@mantine/form';
import * as yup from 'yup';
import dayjs from 'dayjs';
import BasicInfo from './BasicInformation';
import SelectSpaces from './SelectSpaces';
import OrderInfo from './OrderInformation';
import SuccessModal from '../../shared/Modal';
import Header from './Header';
import { FormProvider, useForm } from '../../../context/formContext';
import { useCreateBookings } from '../../../hooks/booking.hooks';

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
            ? yup.string().matches(/[A-Z]{5}[0-9]{4}[A-Z]{1}/, 'Pan number must be valid')
            : null,
        )
        .concat(step === 1 ? requiredSchema('Pan number is required') : null),
      gstNumber: yup
        .string()
        .trim()
        .concat(
          step === 1
            ? yup
                .string()
                .matches(
                  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                  'GST number must be valid',
                )
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
    description: yup
      .string()
      .trim()
      .concat(step === 2 ? requiredSchema('Campaign description is required') : null),
    spaces: yup
      .mixed()
      .concat(
        step === 3 ? yup.array().of(yup.object()).min(1, 'Minimum 1 space is required') : null,
      ),
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
  spaces: [],
};

const MainArea = () => {
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const submitRef = useRef(null);

  const form = useForm({ validate: yupResolver(schema(formStep)), initialValues });

  const { mutateAsync: createBooking } = useCreateBookings();

  const handleSubmit = async formData => {
    if (formStep <= 2) {
      setFormStep(prev => prev + 1);
      return;
    }

    let minDate = null;
    let maxDate = null;

    formData.spaces.forEach(item => {
      const start = item.startDate.setHours(0, 0, 0, 0);
      const end = item.endDate.setHours(0, 0, 0, 0);

      if (!minDate) minDate = start;
      if (!maxDate) maxDate = end;

      if (start < minDate) minDate = start;
      if (end > maxDate) maxDate = end;
    });

    await createBooking({
      ...formData,
      startDate: dayjs(minDate).format('YYYY-MM-DD'),
      endDate: dayjs(maxDate).format('YYYY-MM-DD'),
    });
    setOpenSuccessModal(true);
  };

  const getForm = () =>
    formStep === 1 ? <BasicInfo /> : formStep === 2 ? <OrderInfo /> : <SelectSpaces />;

  return (
    <>
      <Header setFormStep={setFormStep} formStep={formStep} submitRef={submitRef} />
      <div>
        <div>
          <FormProvider form={form}>
            <form onSubmit={form.onSubmit(handleSubmit)}>
              {getForm()}
              <button type="submit" ref={submitRef} className="hidden">
                submit
              </button>
            </form>
          </FormProvider>
        </div>
      </div>
      <SuccessModal
        title="Order Successfully Created"
        text="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        prompt="Visit Order List"
        open={openSuccessModal}
        setOpenSuccessModal={setOpenSuccessModal}
        path="bookings"
      />
    </>
  );
};

export default MainArea;

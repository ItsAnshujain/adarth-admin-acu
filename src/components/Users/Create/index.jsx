import { useEffect, useState } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@mantine/form';
import { useParams } from 'react-router-dom';
import Credentials from './Credentials';
import BasicInfo from './BasicInfo';
import Documents from './Documents';
import SuccessModal from '../../shared/Modal';
import Header from './Header';
import { FormProvider, useForm } from '../../../context/formContext';
import { useCreateUsers, useUpdateUsers, useFetchUsersById } from '../../../hooks/users.hooks';

const requiredSchema = requiredText => yup.string().trim().required(requiredText);

const schema = action =>
  yup.object().shape({
    email: yup.string().trim().required('Email is required').email('Invalid Email'),
    password: yup
      .string()
      .trim()
      .min(6, 'Password must be at least 6 characters')
      .matches(/\d/, 'Password must contain atleast 1 digit')
      .matches(/[a-zA-Z]/, 'Password must contain atleast 1 letter')
      .required('Password is required'),
    confirmPassword: yup
      .string()
      .trim()
      .required('Confirm Password is required')
      .oneOf([yup.ref('password'), null], 'Password and Confirm password must match'),
    role: yup.string().trim().required('Role is required'),
    name: yup
      .string()
      .trim()
      .concat(action === 2 ? requiredSchema('Name is required') : null),
    company: yup
      .string()
      .trim()
      .concat(action === 2 ? requiredSchema('Organization is required') : null),
    number: yup
      .string()
      .trim()
      .concat(action === 2 ? requiredSchema('Phone number is required') : null),
    state: yup
      .string()
      .trim()
      .concat(action === 2 ? requiredSchema('State is required') : null),
    address: yup
      .string()
      .trim()
      .concat(action === 2 ? requiredSchema('Address is required') : null),
    city: yup
      .string()
      .trim()
      .concat(action === 2 ? requiredSchema('City is required') : null),
    pincode: yup
      .string()
      .trim()
      .concat(
        action === 2
          ? yup
              .string()
              .trim()
              .min(6, 'Pin must be at least 6 digts')
              .max(6, 'Pin must be at max 6 digts')
              .matches(/\d/, 'Pin must contain only digits')
              .required('Pin is required')
          : null,
      ),
    pan: yup
      .string()
      .trim()
      .concat(
        action === 2
          ? yup
              .string()
              .trim()
              .min(10, 'Pan must be at least 10 characters')
              .matches(/\d/, 'Pan must contain 1 digit')
              .matches(/[a-zA-Z]/, 'Pan must contain 1 letter')
              .required('Pan is required')
          : null,
      ),
    aadhaar: yup
      .string()
      .trim()
      .concat(
        action === 2
          ? yup
              .string()
              .trim()
              .min(12, 'Aadhaar must be at least 12 digts')
              .max(12, 'Aadhaar must be at max 12 digts')
              .matches(/\d/, 'Pin must contain only digits')
              .required('Aadhaar is required')
          : null,
      ),
    about: yup.string().trim(),
    peer: yup.string().trim(),
    image: yup
      .string()
      .trim()
      .concat(action === 2 ? requiredSchema('Profile picture is required') : null),
    docs: yup.object({
      aadhaar: '',
      pan: '',
      landlordLicense: '',
    }),
  });

const initialValues = {
  email: '',
  password: '',
  confirmPassword: '',
  name: '',
  company: '',
  number: '',
  state: '',
  address: '',
  city: '',
  pincode: '',
  pan: '',
  aadhaar: '',
  about: '',
  peer: '',
  image: '',
  docs: {
    aadhaar: '',
    pan: '',
    landlordLicense: '',
  },
};

const MainArea = () => {
  const { id: userId } = useParams();
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const form = useForm({ validate: yupResolver(schema(formStep)), initialValues });
  const { mutate: create, isLoading } = useCreateUsers();
  const { mutate: update, isUpdateUserLoading } = useUpdateUsers();

  const getForm = () =>
    formStep === 1 ? <Credentials /> : formStep === 2 ? <BasicInfo /> : <Documents />;

  const { data: userDetails } = useFetchUsersById(userId, !!userId);

  const onSubmitUserForm = formData => {
    setFormStep(prevState => prevState + 1);
    if (formStep === 3) {
      setFormStep(3);

      // format from array to object
      let data = {};
      const docs = formData?.docs;
      data = {
        ...formData,
        pincode: formData?.pincode ? parseInt(formData.pincode, 10) : 0,
        aadhaar: formData?.aadhaar ? parseInt(formData.aadhaar, 10) : 0,
        docs: [
          { aadhaar: docs.aadhaar },
          { pan: docs.pan },
          { landlordLicense: docs.landlordLicense },
        ],
      };

      Object.keys(data).forEach(key => {
        if (data[key] === '') {
          delete data[key];
        }
      });

      if (userId) {
        update({ userId, data });
      } else {
        create(data);
      }
      setTimeout(() => setOpenSuccessModal(true), 2000);
    }
  };

  useEffect(() => {
    if (userDetails) {
      form.setFieldValue('image', userDetails?.image);
      form.setFieldValue('email', userDetails?.email);
      form.setFieldValue('role', userDetails?.role);
      form.setFieldValue('name', userDetails?.name);
      form.setFieldValue('company', userDetails?.company);
      form.setFieldValue('number', userDetails?.number);
      form.setFieldValue('state', userDetails?.state);
      form.setFieldValue('address', userDetails?.address);
      form.setFieldValue('city', userDetails?.city);
      form.setFieldValue('pincode', userDetails?.pincode);
      form.setFieldValue('aadhaar', userDetails?.aadhaar);
      form.setFieldValue('pan', userDetails?.pan);
      form.setFieldValue('about', userDetails?.about);

      const tempDocs = {};
      userDetails?.docs?.forEach(item => {
        const key = Object.keys(item)[0];
        tempDocs[key] = item[key];
      });
      form.setFieldValue('docs.pan', tempDocs?.pan);
      form.setFieldValue('docs.aadhaar', tempDocs?.aadhaar);
      form.setFieldValue('docs.landlordLicense', tempDocs?.landlordLicense);

      // form.setValues({
      //   email: userDetails.email,
      //   role: userDetails.role,
      // });
      // TODO: not able to use setValues.getting forEach error
    }
  }, [userDetails]);

  return (
    <>
      <FormProvider form={form}>
        <form onSubmit={form.onSubmit(onSubmitUserForm)}>
          <Header
            setFormStep={setFormStep}
            formStep={formStep}
            isLoading={isLoading || isUpdateUserLoading}
          />
          {getForm()}
        </form>
      </FormProvider>
      <SuccessModal
        title="Profile Created Successfully"
        text="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        prompt="Visit User List"
        open={openSuccessModal}
        setOpenSuccessModal={setOpenSuccessModal}
        path="users"
      />
    </>
  );
};

export default MainArea;

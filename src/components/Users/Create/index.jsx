import { useState } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@mantine/form';
import Credentials from './Credentials';
import SuccessModal from '../../shared/Modal';
import Header from './Header';
import { FormProvider, useForm } from '../../../context/formContext';
import { useCreateUsers } from '../../../hooks/users.hooks';

const schema = yup.object().shape({
  email: yup.string().trim().required('Email is required').email('Invalid Email'),
  role: yup
    .object()
    .shape({
      label: yup.string().trim(),
      value: yup.string().trim(),
    })
    .test('role', 'Role is required', obj => obj.value !== ''),
  name: yup.string().trim().required('Name is required'),
});

const initialValues = {
  name: '',
  email: '',
  role: { label: '', value: '' },
};

const MainArea = () => {
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const form = useForm({ validate: yupResolver(schema), initialValues });
  const { mutate: create, isLoading } = useCreateUsers();

  const onSubmitUserForm = formData => {
    const data = { ...formData, role: formData.role.value };
    create(data);
    form.reset();
    setTimeout(() => setOpenSuccessModal(true), 2000);
  };

  return (
    <>
      <FormProvider form={form}>
        <form onSubmit={form.onSubmit(onSubmitUserForm)}>
          <Header setFormStep={setFormStep} formStep={formStep} isLoading={isLoading} />
          <Credentials />
        </form>
      </FormProvider>
      <SuccessModal
        title="Profile Created Successfully"
        prompt="Visit User List"
        open={openSuccessModal}
        setOpenSuccessModal={setOpenSuccessModal}
        path="users"
      />
    </>
  );
};

export default MainArea;

import { useEffect, useState } from 'react';
import { Button, Tabs } from '@mantine/core';
import { yupResolver } from '@mantine/form';
import { useQueryClient } from '@tanstack/react-query';
import * as yup from 'yup';
import BasicInfo from '../Users/Create/BasicInfo';
import Documents from '../Users/Create/Documents';
import useUserStore from '../../store/user.store';
import { FormProvider, useForm } from '../../context/formContext';
import { useUpdateUsers } from '../../hooks/users.hooks';

const requiredSchema = requiredText => yup.string().trim().required(requiredText);

const schema = step =>
  yup.object().shape({
    name: yup
      .string()
      .trim()
      .concat(step === 'first' ? requiredSchema('Name is required') : null),
    email: yup
      .string()
      .trim()
      .concat(step === 'first' ? requiredSchema('Email is required') : null)
      .concat(step === 'first' ? yup.string().trim().email('Email must be valid') : null),
    company: yup
      .string()
      .trim()
      .concat(step === 'first' ? requiredSchema('Company is required') : null),
    about: yup.string().trim(),
    city: yup
      .string()
      .trim()
      .concat(step === 'first' ? requiredSchema('City is required') : null),
    address: yup
      .string()
      .trim()
      .concat(step === 'first' ? requiredSchema('Address is required') : null),
    number: yup
      .string()
      .trim()
      .concat(step === 'first' ? requiredSchema('Number is required') : null),
    state: yup
      .string()
      .trim()
      .concat(step === 'first' ? requiredSchema('State is required') : null),
    pincode: yup
      .string()
      .concat(step === 'first' ? yup.string().required('Pin code is required') : null)
      .concat(
        step === 'first' ? yup.string().matches(/^(\d{4}|\d{6})$/, 'Pin code must be valid') : null,
      ),
    pan: yup
      .string()
      .trim()
      .concat(step === 'first' ? requiredSchema('Pan is required') : null)
      .concat(
        step === 'first'
          ? yup.string().matches(/[A-Z]{5}[0-9]{4}[A-Z]{1}/, 'Pan number must be valid')
          : null,
      ),
    aadhaar: yup
      .string()
      .trim()
      .concat(step === 'first' ? requiredSchema('Aadhaar number is required') : null)
      .concat(
        step === 'first'
          ? yup
              .string()
              .matches(
                /(^[0-9]{4}[0-9]{4}[0-9]{4}$)|(^[0-9]{4}\s[0-9]{4}\s[0-9]{4}$)|(^[0-9]{4}-[0-9]{4}-[0-9]{4}$)/,
                'Aadhaar number must be valid',
              )
          : null,
      ),
    image: yup
      .string()
      .trim()
      .concat(step === 'first' ? requiredSchema('Profile Image is required') : null),
    docs: yup.array(),
  });

const initialValues = {
  name: '',
  email: '',
  company: '',
  about: '',
  city: '',
  address: '',
  number: '',
  state: '',
  pan: '',
  aadhaar: '',
  image: '',
  docs: [],
};

const EditProfile = () => {
  const [activeTab, setActiveTab] = useState('first');
  const [uploadingFile, setUploadingFile] = useState(false);

  const userId = useUserStore(state => state.id);

  const queryClient = useQueryClient();
  const data = queryClient.getQueryData(['users-by-id', userId]);

  const { mutateAsync, isLoading } = useUpdateUsers();

  const form = useForm({ validate: yupResolver(schema(activeTab)), initialValues });

  useEffect(() => {
    if (data) {
      form.setFieldValue('name', data?.name || '');
      form.setFieldValue('email', data?.email || '');
      form.setFieldValue('about', data?.about || '');
      form.setFieldValue('address', data?.address || '');
      form.setFieldValue('city', data?.city || '');
      form.setFieldValue('pan', data?.pan || '');
      form.setFieldValue('aadhaar', data?.aadhaar || '');
      form.setFieldValue('pincode', data?.pincode || '');
      form.setFieldValue('number', data?.number || '');
      form.setFieldValue('state', data?.state || '');
      form.setFieldValue('company', data?.company || '');
      form.setFieldValue('image', data?.image || '');
      form.setFieldValue('docs', data?.docs || []);
    }
    return () => {
      form.reset();
    };
  }, [data]);

  const handleSubmit = formData => {
    mutateAsync({ userId, data: formData });
  };

  return (
    <FormProvider form={form}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Tabs value={activeTab} onTabChange={setActiveTab}>
          <Tabs.List className="h-[60px] relative">
            <Tabs.Tab className="text-base hover:bg-transparent" value="first">
              Basic Information
            </Tabs.Tab>
            <Tabs.Tab className="text-base hover:bg-transparent" value="second">
              Document
            </Tabs.Tab>
            <Button
              loading={isLoading || uploadingFile}
              className="absolute right-7 top-3 bg-purple-450 text-white px-4 py-2 rounded-md"
              type="submit"
            >
              Save
            </Button>
          </Tabs.List>
          <Tabs.Panel value="first">
            <BasicInfo setUploadingFile={setUploadingFile} />
          </Tabs.Panel>
          <Tabs.Panel value="second">
            <Documents documents={data?.docs || []} />
          </Tabs.Panel>
        </Tabs>
      </form>
    </FormProvider>
  );
};

export default EditProfile;

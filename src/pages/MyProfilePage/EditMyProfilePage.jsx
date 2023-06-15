import { useEffect, useState } from 'react';
import { Button, Tabs } from '@mantine/core';
import { yupResolver } from '@mantine/form';
import { useQueryClient } from '@tanstack/react-query';
import * as yup from 'yup';
import { showNotification } from '@mantine/notifications';
import BasicInfo from '../../components/Users/Create/BasicInfo';
import Documents from '../../components/Users/Create/Documents';
import useUserStore from '../../store/user.store';
import { FormProvider, useForm } from '../../context/formContext';
import { useUpdateUsers } from '../../apis/hooks/users.hooks';
import { aadhaarRegexMatch, panRegexMatch } from '../../utils';

const initialValues = {
  name: '',
  email: '',
  company: '',
  about: '',
  city: '',
  address: '',
  number: '',
  state: '',
  pincode: '',
  pan: '',
  aadhaar: '',
  image: '',
  docs: [],
};

const basicInformationSchema = yup.object({
  name: yup.string().trim().required('Name is required'),
  email: yup.string().trim().required('Email is required').email('Email must be valid'),
  company: yup.string().trim().required('Company is required'),
  about: yup.string().trim().required('About is required'),
  city: yup.string().trim().required('City is required'),
  address: yup.string().trim().required('Address is required'),
  number: yup.string().trim().required('Number is required'),
  state: yup.string().trim().required('State is required'),
  pincode: yup
    .string()
    .trim()
    .matches(/^(\d{4}|\d{6})$/, 'Pin code must be valid')
    .required('Pin code is required'),
  pan: yup
    .string()
    .trim()
    .matches(panRegexMatch, 'Pan number must be valid and must be of 10 characters')
    .required('Pan is required'),
  aadhaar: yup
    .string()
    .trim()
    .matches(aadhaarRegexMatch, 'Aadhaar number must be valid and must be of 12 digits')
    .required('Aadhaar number is required'),
  image: yup.string().trim().required('Profile Image is required'),
});

const docSchema = yup.object({
  docs: yup.array(),
});

const schemas = {
  first: basicInformationSchema,
  second: docSchema,
};

const EditMyProfilePage = () => {
  const [activeTab, setActiveTab] = useState('first');
  const [uploadingFile, setUploadingFile] = useState(false);

  const userId = useUserStore(state => state.id);

  const queryClient = useQueryClient();
  const data = queryClient.getQueryData(['users-by-id', userId]);

  const { mutateAsync, isLoading } = useUpdateUsers();

  const form = useForm({ validate: yupResolver(schemas[activeTab]), initialValues });

  const handleSubmit = formData => {
    const dataObj = { ...formData };
    const hasFieldEmpty = Object.keys(form.values).find(key => form?.values[key] === '');
    if (hasFieldEmpty) {
      showNotification({
        title: 'Please fill all the required fields in Basic Information first',
        color: 'blue',
      });
      return;
    }
    if (dataObj?.pan) {
      dataObj.pan = dataObj.pan?.toUpperCase();
    }
    mutateAsync({ userId, data: dataObj });
  };

  useEffect(() => {
    if (data) {
      form.setValues({
        name: data?.name || '',
        email: data?.email || '',
        about: data?.about || '',
        address: data?.address || '',
        city: data?.city || '',
        pan: data?.pan || '',
        aadhaar: data?.aadhaar || '',
        pincode: data?.pincode || '',
        number: data?.number || '',
        state: data?.state || '',
        company: data?.company || '',
        image: data?.image || '',
        docs: data?.docs || [],
      });
    }
    return () => {
      form.reset();
    };
  }, [data]);

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 border-l border-gray-450 overflow-y-auto">
      <FormProvider form={form}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Tabs value={activeTab} onTabChange={setActiveTab}>
            <Tabs.List className="h-[60px] relative">
              <Tabs.Tab className="text-base hover:bg-transparent" value="first">
                Basic Information
              </Tabs.Tab>
              <Tabs.Tab className="text-base hover:bg-transparent" value="second">
                Documents
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
    </div>
  );
};

export default EditMyProfilePage;

import React, { useEffect } from 'react';
import { Button } from '@mantine/core';
import { ChevronDown } from 'react-feather';
import * as yup from 'yup';
import { yupResolver } from '@mantine/form';
import { FormProvider, useForm } from '../../context/formContext';
import TextInput from '../../components/shared/TextInput';
import PasswordInput from '../../components/shared/PasswordInput';
import NativeSelect from '../../components/shared/NativeSelect';
import { SMTP_SERVICES } from '../../utils/constants';
import NumberInput from '../../components/shared/NumberInput';
import { useFetchUsersById, useUpdateUsers } from '../../apis/queries/users.queries';
import useUserStore from '../../store/user.store';

const initialValues = {
  service: '',
  username: '',
  password: '',
  host: '',
  port: null,
};

const schema = yup.object({
  service: yup.string().trim().required('Service is required'),
  username: yup.string().trim().required('Username is required'),
  password: yup.string().trim().required('Password is required'),
  host: yup
    .string()
    .trim()
    .when('service', {
      is: 'others',
      then: yup.string().trim().required('SMTP host is required'),
    }),
  port: yup
    .number()
    .positive('Must be a positive number')
    .typeError('Must be a number')
    .nullable()
    .when('service', {
      is: 'others',
      then: yup
        .number()
        .positive('Must be a positive number')
        .typeError('Must be a number')
        .nullable()
        .required('SMTP port is required'),
    }),
});

const SmtpSetup = () => {
  const form = useForm({ validate: yupResolver(schema), initialValues });
  const userId = useUserStore(state => state.id);
  const { mutateAsync: updateUser, isLoading: isUserUpdateLoading } = useUpdateUsers();
  const { data: userData } = useFetchUsersById(userId);

  const onSubmit = async formData => {
    const data = { ...formData };

    if (data.service !== 'others') {
      delete data.host;
      delete data.port;
    }

    updateUser(
      { userId, data: { smtp: data } },
      {
        onSuccess: () => form.reset(),
      },
    );
  };

  useEffect(() => {
    if (userData?.smtp) {
      form.setValues({
        ...form.values,
        service: userData?.smtp?.service,
        username: userData?.smtp?.username,
        host: userData?.smtp?.host || '',
        port: userData?.smtp?.port || null,
      });
    }
  }, [userData?.smtp]);

  return (
    <article className="px-5 mt-4">
      <FormProvider form={form}>
        <form onSubmit={form.onSubmit(onSubmit)}>
          <div className="grid gap-3 grid-cols-3 mb-4">
            <NativeSelect
              label="Services"
              name="service"
              withAsterisk
              placeholder="Select a service"
              errors={form.errors}
              options={SMTP_SERVICES}
              rightSection={<ChevronDown size={16} className="mt-[1px] mr-1" />}
              rightSectionWidth={40}
              size="md"
              className="col-start-1 col-span-1"
              classNames={{ label: 'font-bold mb-2 text-base' }}
            />

            <TextInput
              label="Username"
              name="username"
              withAsterisk
              placeholder="Enter username"
              errors={form.errors}
              size="md"
              className="col-start-1 col-span-1"
              classNames={{ label: 'font-bold mb-2 text-base' }}
            />
            <PasswordInput
              label="Password"
              name="password"
              withAsterisk
              placeholder="Enter password"
              errors={form.errors}
              size="md"
              className="col-start-2 col-span-1"
              classNames={{ label: 'font-bold mb-2 text-base' }}
            />

            {form.values.service === 'others' ? (
              <>
                <TextInput
                  label="SMTP host"
                  name="host"
                  withAsterisk
                  placeholder="Enter host"
                  errors={form.errors}
                  size="md"
                  className="col-start-1 col-span-1"
                  classNames={{ label: 'font-bold mb-2 text-base' }}
                />
                <NumberInput
                  label="SMTP port"
                  name="port"
                  withAsterisk
                  placeholder="Enter port"
                  errors={form.errors}
                  size="md"
                  className="col-start-2 col-span-1"
                  classNames={{ label: 'font-bold mb-2 text-base' }}
                />
              </>
            ) : null}
          </div>

          <Button className="primary-button" type="submit" loading={isUserUpdateLoading}>
            Submit
          </Button>
        </form>
      </FormProvider>
    </article>
  );
};

export default SmtpSetup;

import React from 'react';
import { Button } from '@mantine/core';
import { ChevronDown } from 'react-feather';
import * as yup from 'yup';
import { yupResolver } from '@mantine/form';
import { FormProvider, useForm } from '../../context/formContext';
import TextInput from '../../components/shared/TextInput';
import PasswordInput from '../../components/shared/PasswordInput';
import NativeSelect from '../../components/shared/NativeSelect';
import { smtpSupportedServices } from '../../utils/constants';

const initialValues = {
  type: '',
  username: '',
  password: '',
  host: '',
  port: '',
};

const schema = yup.object({
  type: yup.string().trim().required('Type is required'),
  username: yup.string().trim().required('Username is required'),
  password: yup.string().trim().required('Password is required'),
  host: yup.string(),
  port: yup.string(),
});

const SmtpSetup = () => {
  const form = useForm({ validate: yupResolver(schema), initialValues });

  const onSubmit = async formData => {
    // TODO: integration left
    // eslint-disable-next-line no-console
    console.log(formData);
  };

  return (
    <article className="px-5 mt-4">
      <FormProvider form={form}>
        <form onSubmit={form.onSubmit(onSubmit)}>
          <div className="grid gap-3 grid-cols-3 mb-4">
            <NativeSelect
              label="Type"
              name="type"
              withAsterisk
              placeholder="Select type"
              errors={form.errors}
              options={smtpSupportedServices}
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

            {form.values.type === 'others' ? (
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
                <TextInput
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

          <Button className="primary-button" type="submit">
            Submit
          </Button>
        </form>
      </FormProvider>
    </article>
  );
};

export default SmtpSetup;

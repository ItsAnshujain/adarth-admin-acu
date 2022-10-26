/* eslint-disable no-useless-escape */
import { useEffect } from 'react';
import { Button, Switch } from '@mantine/core';
import * as yup from 'yup';
import { yupResolver } from '@mantine/form';
import { useQueryClient } from '@tanstack/react-query';
import { FormProvider, useForm } from '../../context/formContext';
import TextInput from '../shared/TextInput';
import { useUpdateNotification } from '../../hooks/settings.hooks';
import useUserStore from '../../store/user.store';

const switchStyles = {
  root: {
    '& input': {
      borderRadius: '5px',
      height: '24px',
      width: '44px',

      '&::before': { borderRadius: '2px', height: '20px', width: '20px' },
    },
  },
};

const inputStyles = {
  input: {
    padding: '20px',
    paddingTop: '25px',
    paddingBottom: '25px',
    borderRadius: '10px',
    height: '34px',
    borderColor: '#969EA1',
  },
  label: {
    color: '#969EA1',
  },
};

const schema = yup.object().shape({
  manualNotify: yup.boolean().required('Message notification is required'),
  emailNotify: yup.boolean().required('Email notification is required'),
  notificationEmail: yup
    .string()
    .trim()
    .test('rqd', 'Email is required', function (val) {
      if (this.from[0].value.emailNotify) {
        if (!val) {
          return false;
        }
      }
      return true;
    })
    .test('valid', 'Email must be valid', function (val) {
      if (this.from[0].value.emailNotify && val) {
        const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return pattern.test(val);
      }
      return true;
    }),
  whatsappNotify: yup.boolean().required('Whatsapp is required'),
  whatsappNumber: yup
    .string()
    .trim()
    .test('rqd', 'Whatsapp Number is required', function (val) {
      if (this.from[0].value.whatsappNotify) {
        if (!val) {
          return false;
        }
      }
      return true;
    })
    .test('valid', 'Whatsapp Number must be valid', function (val) {
      if (this.from[0].value.whatsappNotify && val) {
        const pattern = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
        return pattern.test(val);
      }
      return true;
    }),
});

const initialValues = {
  manualNotify: false,
  emailNotify: false,
  notificationEmail: '',
  whatsappNotify: false,
  whatsappNumber: '',
};

const stringToBoolean = data => {
  if (typeof data === 'string') {
    if (data === 'false') {
      return false;
    }
    return true;
  }
  return data;
};

const Notification = () => {
  const form = useForm({ validate: yupResolver(schema), initialValues });

  const { mutateAsync, isLoading } = useUpdateNotification();
  const userId = useUserStore(state => state.id);

  const queryClient = useQueryClient();
  const data = queryClient.getQueryData(['users-by-id', userId]);

  useEffect(() => {
    if (data) {
      form.setFieldValue('manualNotify', stringToBoolean(data.manualNotify));
      form.setFieldValue('emailNotify', stringToBoolean(data.emailNotify));
      form.setFieldValue('whatsappNotify', stringToBoolean(data.whatsappNotify));
      form.setFieldValue('whatsappNumber', data.whatsappNumber);
      form.setFieldValue('notificationEmail', data.notificationEmail);
    }
  }, [data]);

  const onSubmitHandler = formData => {
    const formDataCopy = { ...formData };

    if (!formDataCopy.emailNotify) {
      delete formDataCopy.notificationEmail;
    }
    if (!formDataCopy.whatsappNotify) {
      delete formDataCopy.whatsappNumber;
    }
    mutateAsync({ ...formDataCopy });
  };
  return (
    <FormProvider form={form}>
      <form onSubmit={form.onSubmit(onSubmitHandler)}>
        <div className="pl-5 pr-7">
          <div className="py-8">
            <div className="w-4/12 flex justify-between">
              <p className="font-bold text-xl">Message Notification</p>
              <Switch
                styles={switchStyles}
                checked={form.values.manualNotify}
                onChange={e => form.setFieldValue('manualNotify', e.target.checked)}
              />
            </div>
            <p className="font-medium text-sm mt-2 text-slate-400">
              Get all update notification in your email
            </p>
          </div>
          <div className="py-8 border border-l-0 border-r-0  border-t-slate-300 border-b-slate-300">
            <div className="w-4/12 flex justify-between">
              <p className="font-bold text-xl">Email Notification</p>
              <Switch
                styles={switchStyles}
                checked={form.values.emailNotify}
                onChange={e => {
                  form.setFieldValue('emailNotify', e.target.checked);
                  if (!e.target.checked) {
                    form.setFieldValue('notificationEmail', '');
                  }
                }}
              />
            </div>
            <p className="font-medium text-sm mt-2 text-slate-400">
              Get all update notification in your email
            </p>
            <TextInput
              styles={inputStyles}
              className="w-4/12 mt-2"
              placeholder="Your email"
              label="Email"
              name="notificationEmail"
              errors={form.errors}
            />
          </div>
          <div className="py-8">
            <div className="w-4/12 flex justify-between">
              <p className="font-bold text-xl">Whatsapp Notification</p>
              <Switch
                styles={switchStyles}
                checked={form.values.whatsappNotify}
                onChange={e => {
                  form.setFieldValue('whatsappNotify', e.target.checked);
                  if (!e.target.checked) {
                    form.setFieldValue('whatsappNumber', '');
                  }
                }}
              />
            </div>
            <p className="font-medium text-sm mt-2 text-slate-400">
              Get all update notification in your whatsapp
            </p>
            <TextInput
              styles={inputStyles}
              className="w-4/12 mt-2 text-slate-400"
              placeholder="Your phone number"
              label="Whatsapp Number"
              name="whatsappNumber"
              errors={form.errors}
            />
          </div>
          <Button
            loading={isLoading}
            type="submit"
            className="py-2 px-8 rounded bg-purple-450 text-white"
          >
            Save
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default Notification;

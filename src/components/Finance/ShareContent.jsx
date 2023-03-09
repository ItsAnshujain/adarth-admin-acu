import { Box, Button, Group, Radio } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Mail } from 'react-feather';
import classNames from 'classnames';
import * as yup from 'yup';
import { yupResolver } from '@mantine/form';
import { FormProvider, useForm } from '../../context/formContext';
import TextInput from '../shared/TextInput';
import { useShareRecord } from '../../hooks/finance.hooks';

const placeHolders = {
  email: 'Email Address',
  whatsapp: 'WhatsApp Number',
  message: 'Phone Number',
};

const sendVia = [
  {
    name: 'Email',
    _id: 'email',
    placeholder: 'Email Address',
    icon: <Mail className="text-black h-5" />,
  },
];

const initialEmailValues = {
  format: '',
  shareVia: 'email',
  name: '',
  to: '',
};

const emailSchema = yup.object({
  name: yup.string().trim().required('Name is required'),
  to: yup.string().trim().required('Email is required').email('Email must be valid'),
});

const initialValues = {
  email: initialEmailValues,
};

const schemas = {
  email: emailSchema,
};

const ShareContent = ({ id }) => {
  const [activeShare, setActiveShare] = useState('');
  const form = useForm({
    validate: yupResolver(schemas[activeShare]),
    initialValues: initialValues[activeShare],
  });

  const { mutateAsync: share, isLoading: isShareProposalLoading } = useShareRecord();

  const handleActiveShare = value => {
    setActiveShare(value);
  };

  const handleSubmit = async formData => {
    const data = { ...formData };

    data.shareVia = activeShare;
    data.format = 'pdf';

    await share(
      { id, data },
      {
        onSuccess: () => {
          form.setFieldValue('name', '');
          form.setFieldValue('to', '');
        },
      },
    );
  };

  useEffect(() => {
    form.clearErrors();
    form.setFieldValue('name', '');
    form.setFieldValue('to', '');
  }, [activeShare]);

  return (
    <Box className="flex flex-col px-7">
      <FormProvider form={form}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <div className="my-2 ">
            <p className="font-medium text-xl mb-2">Share via:</p>

            <Group className="grid grid-cols-2 ">
              <div>
                {sendVia.map(item => (
                  <Group
                    className={classNames(
                      activeShare === item._id && 'bg-gray-100',
                      'col-span-1 grid grid-cols-2 items-start',
                    )}
                    key={uuidv4()}
                  >
                    <Radio
                      onChange={event => handleActiveShare(event.target.value)}
                      label={item.name}
                      defaultValue={item._id}
                      checked={activeShare === item._id}
                      className="font-medium my-2"
                      size="md"
                    />
                  </Group>
                ))}
              </div>
              {activeShare !== '' && (
                <div>
                  <TextInput name="name" placeholder="Name" className="mb-2" errors={form.errors} />
                  {activeShare !== 'copy_link' ? (
                    <TextInput
                      name="to"
                      placeholder={placeHolders[activeShare]}
                      errors={form.errors}
                    />
                  ) : null}
                  <Button
                    className="secondary-button font-medium text-base mt-2 w-full"
                    type="submit"
                    loading={isShareProposalLoading}
                    disabled={isShareProposalLoading}
                  >
                    {activeShare === 'copy_link' ? 'Copy' : 'Send'}
                  </Button>
                </div>
              )}
            </Group>
          </div>
        </form>
      </FormProvider>
    </Box>
  );
};

export default ShareContent;

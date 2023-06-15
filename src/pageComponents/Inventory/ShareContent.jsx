import { Box, Button, Checkbox, Group, Image, Radio } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Mail, Link as LinkIcon, MessageSquare } from 'react-feather';
import classNames from 'classnames';
import * as yup from 'yup';
import { yupResolver } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import validator from 'validator';
import whatsapp from '../../assets/whatsapp.svg';
import { FormProvider, useForm } from '../../context/formContext';
import TextInput from '../../components/shared/TextInput';
import { useShareInventory } from '../../hooks/inventory.hooks';
import { serialize } from '../../utils';

const fileType = [
  { name: 'PPT', _id: 'ppt' },
  { name: 'PDF', _id: 'pdf' },
  { name: 'EXCEL', _id: 'excel' },
];

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
  {
    name: 'WhatsApp',
    _id: 'whatsapp',
    placeholder: 'WhatsApp Number',
    icon: <Image src={whatsapp} alt="whatsapp" />,
  },
  {
    name: 'Message',
    _id: 'message',
    placeholder: 'Phone Number',
    icon: <MessageSquare className="text-black h-5" />,
  },
  {
    name: 'Copy Link',
    _id: 'copy_link',
    icon: <LinkIcon className="h-4" color="#000" />,
  },
];

const initialEmailValues = {
  format: '',
  shareVia: 'email',
  name: '',
  to: '',
};

const initialWhatsAppValues = {
  format: '',
  shareVia: 'whatsapp',
  name: '',
  to: '',
};

const initialMessageValues = {
  format: '',
  shareVia: 'message',
  name: '',
  to: '',
};

const initialCopyLinkValues = {
  format: '',
  shareVia: 'copy_link',
  name: '',
};

const emailSchema = yup.object({
  name: yup.string().trim().required('Name is required'),
  to: yup.string().trim().required('Email is required').email('Email must be valid'),
});

const whatsAppSchema = yup.object({
  name: yup.string().trim().required('Name is required'),
  to: yup
    .string()
    .trim()
    .test('valid', 'Must be a valid number', val => validator.isMobilePhone(val, 'en-IN'))
    .required('WhatsApp number is required'),
});

const messageSchema = yup.object({
  name: yup.string().trim().required('Name is required'),
  to: yup
    .string()
    .trim()
    .test('valid', 'Must be a valid number', val => validator.isMobilePhone(val, 'en-IN'))
    .required('Phone number is required'),
});

const copyLinkSchema = yup.object({
  name: yup.string().trim().required('Name is required'),
});

const initialValues = {
  email: initialEmailValues,
  whatsapp: initialWhatsAppValues,
  message: initialMessageValues,
  copy_link: initialCopyLinkValues,
};

const schemas = {
  email: emailSchema,
  whatsapp: whatsAppSchema,
  message: messageSchema,
  copy_link: copyLinkSchema,
};

const ShareContent = ({ searchParamQueries }) => {
  const [activeFileType, setActiveFileType] = useState([]);
  const [activeShare, setActiveShare] = useState('');
  const form = useForm({
    validate: yupResolver(schemas[activeShare]),
    initialValues: initialValues[activeShare],
  });

  const shareInventory = useShareInventory();

  const handleActiveFileType = value => {
    let tempArr = [...activeFileType]; // TODO: use immmer
    if (tempArr.some(item => item === value)) {
      tempArr = tempArr.filter(item => item !== value);
    } else {
      tempArr.push(value);
    }
    setActiveFileType(tempArr);
  };

  const handleActiveShare = value => {
    setActiveShare(value);
  };

  const handleSubmit = async formData => {
    const data = { ...formData };
    if (!activeFileType.length) {
      showNotification({
        title: 'Please select a file type to continue',
      });
      return;
    }

    data.format = activeFileType.join(',');
    data.shareVia = activeShare;
    const params = {};
    searchParamQueries.forEach((value, key) => {
      params[key] = value;
    });

    const response = await shareInventory.mutateAsync(
      { queries: serialize(params), data },
      {
        onSuccess: () => {
          setActiveFileType([]);
          if (data.shareVia !== 'copy_link') {
            showNotification({
              title: 'Inventories have been shared successfully',
              color: 'green',
            });
          }
          form.setFieldValue('name', '');
          form.setFieldValue('to', '');
        },
      },
    );
    if (activeShare === 'copy_link' && response?.link?.messageText) {
      navigator.clipboard.writeText(response?.link?.messageText);
      showNotification({
        title: 'Link Copied',
        color: 'blue',
      });
    }
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
          <div>
            <p className="font-medium text-xl mb-2">Select file type:</p>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {fileType.map(item => (
                <Checkbox
                  key={uuidv4()}
                  onChange={event => handleActiveFileType(event.target.value)}
                  label={item.name}
                  defaultValue={item._id}
                  className="font-medium"
                  checked={activeFileType.includes(item._id)}
                />
              ))}
            </div>
          </div>
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
                    loading={shareInventory.isLoading}
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

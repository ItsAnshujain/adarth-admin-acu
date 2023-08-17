import { Box, Button, Checkbox, Group, Image, Radio, Tooltip } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Mail, Link as LinkIcon, MessageSquare } from 'react-feather';
import classNames from 'classnames';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { showNotification } from '@mantine/notifications';
import validator from 'validator';
import dayjs from 'dayjs';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import whatsapp from '../../../assets/whatsapp.svg';
import { useShareInventory } from '../../../apis/queries/inventory.queries';
import { downloadPdf, serialize } from '../../../utils';
import { FILE_TYPE_LIST, OBJECT_FIT_LIST } from '../../../utils/constants';
import ControlledTextInput from '../../shared/FormInputs/Controlled/ControlledTextInput';

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
  {
    name: 'Download',
    _id: 'download',
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
  to: yup.string().trim().required('Required'),
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

const downloadLinkSchema = yup.object({
  name: yup.string().trim(),
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
  download: downloadLinkSchema,
};

const ShareContent = ({ searchParamQueries, onClose }) => {
  const [activeFileType, setActiveFileType] = useState([]);
  const [activeShare, setActiveShare] = useState('');

  const form = useForm({
    resolver: yupResolver(schemas[activeShare]),
    defaultValues: initialValues[activeShare],
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

  const handleActiveShare = value => setActiveShare(value);

  const onSubmit = form.handleSubmit(async formData => {
    const data = { ...formData };
    if (!activeFileType.length) {
      showNotification({
        title: 'Please select a file type to continue',
      });
      return;
    }

    data.format = activeFileType.join(',');
    data.shareVia = activeShare === 'download' ? 'copy_link' : activeShare;

    const params = {};
    searchParamQueries.forEach((value, key) => {
      params[key] = value;
    });

    if (activeShare === 'email' && data.to.includes(',')) {
      let emails = data.to.split(',');
      emails = emails.map(email =>
        email.trim() && validator.isEmail(email.trim()) ? email.trim() : false,
      );
      if (emails.includes(false)) {
        showNotification({
          title: 'Please enter valid email addresses',
          message: 'One of your email address is invalid',
        });
        return;
      }
      data.to = emails.join(',');
    } else if (activeShare === 'email' && !validator.isEmail(data.to)) {
      showNotification({
        title: 'Invalid Email',
      });

      return;
    }

    const response = await shareInventory.mutateAsync(
      { queries: serialize({ ...params, utcOffset: dayjs().utcOffset() }), data },
      {
        onSuccess: () => {
          setActiveFileType([]);
          if (data.shareVia !== 'copy_link') {
            showNotification({
              title: 'Inventories have been shared successfully',
              color: 'green',
            });
          }

          form.reset();
          setActiveShare('');
          onClose();
        },
      },
    );
    if (activeShare === 'copy_link' && response?.proposalShare?.messageText) {
      navigator.clipboard.writeText(response?.proposalShare?.messageText);
      showNotification({
        title: 'Link Copied',
        color: 'blue',
      });
    }

    if (activeShare === 'download') {
      if (response?.proposalShare?.[data.format]) {
        downloadPdf(response.proposalShare[data.format]);
      }
    }
  });

  useEffect(() => {
    form.clearErrors();
    form.setValue('name', '');
    form.setValue('to', '');
  }, [activeShare]);

  return (
    <Box className="flex flex-col px-7">
      <FormProvider {...form}>
        <form onSubmit={onSubmit}>
          <div>
            <p className="font-medium text-xl mb-2">Select file type:</p>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {FILE_TYPE_LIST.map(item => (
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

          <div>
            <p className="font-medium text-xl mb-2">
              Select aspect ratio for space images <span className="text-base">(Optional)</span>:
            </p>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <Controller
                control={form.control}
                name="aspectRatio"
                render={({ field }) => (
                  <Radio.Group size="md" {...field}>
                    {OBJECT_FIT_LIST.map(item => (
                      <Tooltip
                        multiline
                        width={220}
                        withArrow
                        transition="fade"
                        transitionDuration={200}
                        label={item.description}
                        key={uuidv4()}
                      >
                        <div>
                          <Radio
                            label={item.name}
                            id={item._id}
                            value={item._id}
                            className="font-medium my-2"
                          />
                        </div>
                      </Tooltip>
                    ))}
                  </Radio.Group>
                )}
              />
            </div>
          </div>

          <div>
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
                  {activeShare !== 'download' ? (
                    <ControlledTextInput
                      name="name"
                      placeholder="Name"
                      maxLength={200}
                      className="mb-2"
                    />
                  ) : null}
                  {activeShare !== 'copy_link' && activeShare !== 'download' ? (
                    <ControlledTextInput
                      name="to"
                      placeholder={placeHolders[activeShare]}
                      maxLength={200}
                    />
                  ) : null}
                  {activeShare === 'email' ? (
                    <p className="mt-2 text-sm">
                      Note: For multiple emails, please separate with a comma
                    </p>
                  ) : null}
                  <Button
                    className="secondary-button font-medium text-base mt-2 w-full"
                    type="submit"
                    loading={shareInventory.isLoading}
                    disabled={activeFileType.length !== 1 && activeShare === 'download'}
                  >
                    {activeShare === 'copy_link'
                      ? 'Copy'
                      : activeShare === 'download'
                      ? 'Download'
                      : 'Send'}
                  </Button>
                  {activeFileType.length !== 1 && activeShare === 'download' ? (
                    <p className="text-red-450 text-center">
                      Kindly select one option at a time to download
                    </p>
                  ) : null}
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

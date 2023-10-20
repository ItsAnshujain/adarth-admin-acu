import { Box, Button, Checkbox, Group, Image, Radio } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Mail, Link as LinkIcon, MessageSquare, ChevronDown } from 'react-feather';
import classNames from 'classnames';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { showNotification } from '@mantine/notifications';
import validator from 'validator';
import dayjs from 'dayjs';
import { FormProvider, useForm } from 'react-hook-form';
import whatsapp from '../../../../assets/whatsapp.svg';
import { useShareProposal } from '../../../../apis/queries/proposal.queries';
import { downloadPdf, serialize } from '../../../../utils';
import { OBJECT_FIT_LIST_V2, FILE_TYPE_LIST } from '../../../../utils/constants';
import ControlledTextInput from '../../../shared/FormInputs/Controlled/ControlledTextInput';
import ControlledSelect from '../../../shared/FormInputs/Controlled/ControlledSelect';
import DownloadIcon from '../../../../assets/download-cloud.svg';

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

const ShareContent = ({ id, onClose }) => {
  const [activeFileType, setActiveFileType] = useState([]);
  const [activeShare, setActiveShare] = useState('');
  const [loaderType, setLoaderType] = useState(-1);

  const form = useForm({
    resolver: yupResolver(schemas[activeShare]),
    defaultValues: initialValues[activeShare],
  });

  const shareProposal = useShareProposal();

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

  const watchAspectRatio = form.watch('aspectRatio');

  const onSubmit = form.handleSubmit(async formData => {
    const data = { ...formData };
    if (!activeFileType.length) {
      showNotification({
        title: 'Please select a file type to continue',
      });
      return;
    }

    data.format = activeFileType.join(',');
    data.shareVia = activeShare;

    if (watchAspectRatio) {
      const aspectRatio = watchAspectRatio.split(';')[0];
      const templateType = watchAspectRatio.split(';')[1];
      data.aspectRatio = aspectRatio;
      data.templateType = templateType;
    }

    const res = await shareProposal.mutateAsync(
      { id, queries: serialize({ utcOffset: dayjs().utcOffset() }), data },
      {
        onSuccess: () => {
          setActiveFileType([]);
          if (data.shareVia !== 'copy_link') {
            showNotification({
              title: 'Proposal has been shared successfully',
              color: 'green',
            });
          }

          form.reset();
          setActiveShare('');
          onClose();
        },
      },
    );
    if (activeShare === 'copy_link' && res?.link?.messageText) {
      navigator.clipboard.writeText(res?.link?.messageText);
      showNotification({
        title: 'Link Copied',
        color: 'blue',
      });
    }
  });

  const handleDownload = async () => {
    if (!activeFileType.length) {
      showNotification({
        title: 'Please select a file type to continue',
        color: 'yellow',
      });
      return;
    }

    if (activeFileType.length > 1) {
      showNotification({
        title: 'Please select only one file type to continue',
        color: 'yellow',
      });
      return;
    }

    setLoaderType('download');

    const data = {
      name: '',
      to: '',
      format: activeFileType.join(','),
      shareVia: 'copy_link',
      aspectRatio: 'fill',
      templateType: 'generic',
    };

    if (watchAspectRatio) {
      const aspectRatio = watchAspectRatio.split(';')[0];
      const templateType = watchAspectRatio.split(';')[1];
      data.aspectRatio = aspectRatio;
      data.templateType = templateType;
    }

    const res = await shareProposal.mutateAsync(
      { id, queries: serialize({ utcOffset: dayjs().utcOffset() }), data },
      {
        onSuccess: () => {
          setActiveFileType([]);
          onClose();
          setLoaderType(-1);
        },
        onError: () => {
          setLoaderType(-1);
        },
      },
    );
    if (res?.link?.[data.format]) {
      downloadPdf(res.link[data.format]);
      showNotification({
        title: 'Download successful',
        color: 'green',
      });
    }
  };

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
            <p className="font-medium text-xl mb-3">Select file type:</p>
            <div className="grid grid-cols-3 gap-2 mb-5">
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
            <p className="font-medium text-xl mb-2">Select a template</p>
            <ControlledSelect
              name="aspectRatio"
              data={OBJECT_FIT_LIST_V2}
              placeholder="Select..."
              rightSection={<ChevronDown size={16} />}
              className="mb-2"
              defaultValue="fill;generic"
            />
          </div>

          <Button
            className="primary-button font-medium text-base mt-2 w-full"
            onClick={handleDownload}
            loading={loaderType === 'download'}
            disabled={shareProposal.isLoading}
            leftIcon={
              <Image src={DownloadIcon} alt="download" height={24} width={24} fit="contain" />
            }
          >
            Download
          </Button>

          <div className="mt-5">
            <p className="font-medium text-xl mb-2">Share via:</p>
            <Group className="grid grid-cols-2">
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
                  <ControlledTextInput
                    name="name"
                    placeholder="Name"
                    maxLength={200}
                    className="mb-2"
                  />
                  {activeShare !== 'copy_link' ? (
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
                    loading={loaderType !== 'download' && shareProposal.isLoading}
                    disabled={shareProposal.isLoading}
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

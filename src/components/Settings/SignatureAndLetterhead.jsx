import { ActionIcon, Badge, Box, Button, Image, Text } from '@mantine/core';
import { useModals } from '@mantine/modals';
import React, { useEffect, useState } from 'react';
import { Dropzone } from '@mantine/dropzone';
import { yupResolver } from '@mantine/form';
import * as yup from 'yup';
import { useQueryClient } from '@tanstack/react-query';
import modalConfig from '../../utils/modalConfig';
import { useDeleteUploadedFile, useUploadFile } from '../../hooks/upload.hooks';
import image from '../../assets/image.png';
import { supportedTypes } from '../../utils';
import { FormProvider, useForm } from '../../context/formContext';
import trash from '../../assets/trash.svg';
import { useUpdateUsers } from '../../hooks/users.hooks';
import useUserStore from '../../store/user.store';

const initialValues = {
  signature: '',
  letterHead: '',
};

const schema = yup.object({
  signature: yup.string().trim().required('Signature is required'),
  letterHead: yup.string().trim().required('Stamp is required'),
});

const SignatureAndLetterhead = () => {
  const queryClient = useQueryClient();
  const modals = useModals();
  const form = useForm({ validate: yupResolver(schema), initialValues });
  const { mutateAsync: upload, isLoading: isUploadLoading } = useUploadFile();
  const { mutateAsync: deleteFile, isLoading: isDeleteLoading } = useDeleteUploadedFile();
  const { mutateAsync: updateUser, isLoading: isUserUpdateLoading } = useUpdateUsers();
  const userId = useUserStore(state => state.id);
  const userData = queryClient.getQueryData(['users-by-id', userId]);
  const [activeImage, setActiveImage] = useState();

  const onHandleDrop = async (params, key) => {
    setActiveImage(key);
    const formData = new FormData();
    formData.append('files', params?.[0]);
    const res = await upload(formData);
    form.setFieldValue(key, res?.[0].Location);
  };

  const toggleImagePreviewModal = imgSrc =>
    modals.openContextModal('basic', {
      title: 'Preview',
      innerProps: {
        modalBody: (
          <Box className=" flex justify-center" onClick={id => modals.closeModal(id)}>
            {imgSrc ? (
              <Image src={imgSrc} height={580} width={580} alt="preview" fit="contain" />
            ) : (
              <Image src={null} height={580} width={580} withPlaceholder />
            )}
          </Box>
        ),
      },
      ...modalConfig,
    });

  const handleDeleteImage = async (e, key) => {
    e.stopPropagation();
    setActiveImage(key);

    if (form.values[key]) {
      await deleteFile(form.values[key].split('/').at(-1), {
        onSuccess: () => form.setFieldValue(key, ''),
      });
    }
  };

  const handleSubmit = formData => {
    const data = { ...formData };
    Object.keys(data).forEach(key => {
      if (data[key] === '') {
        delete data[key];
      }
    });

    updateUser({ userId, data });
  };

  useEffect(() => {
    if (userData) {
      form.setValues({
        letterHead: userData?.letterHead || '',
        signature: userData?.signature || '',
      });
    }
    return () => {
      form.reset();
    };
  }, [userData]);

  return (
    <article>
      <FormProvider form={form}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <section className="border-b py-4 px-5">
            <p className="font-semibold text-lg mr-2">Signature</p>
            <div className="mb-3">
              <span className="font-bold text-gray-500 mr-2">Supported types</span>
              {supportedTypes.map(item => (
                <Badge key={item} className="mr-2">
                  {item}
                </Badge>
              ))}
            </div>
            <div className="flex items-start">
              {!form.values?.signature ? (
                <div className="h-[180px] w-[350px] mr-4 mb-2">
                  <Dropzone
                    onDrop={imagePath => onHandleDrop(imagePath, 'signature')}
                    accept={['image/png', 'image/jpeg']}
                    className="h-full w-full flex justify-center items-center bg-slate-100"
                    loading={activeImage === 'signature' && isUploadLoading}
                    name="signature"
                    multiple={false}
                    {...form.getInputProps('signature')}
                  >
                    <div className="flex items-center justify-center">
                      <Image src={image} alt="placeholder" height={50} width={50} />
                    </div>
                    <p>
                      Drag and Drop your file here, or{' '}
                      <span className="text-purple-450 border-none">browse</span>
                    </p>
                  </Dropzone>
                  {form.errors?.signature ? (
                    <p className="mt-1 text-xs text-red-450">{form.errors?.signature}</p>
                  ) : null}
                </div>
              ) : null}
              <Box
                className="bg-white border rounded-md cursor-zoom-in"
                onClick={() => toggleImagePreviewModal(form.values?.signature)}
              >
                {form.values?.signature ? (
                  <div className="relative">
                    <Image
                      src={form.values?.signature}
                      alt="signature-preview"
                      height={180}
                      width={350}
                      className="bg-slate-100"
                      fit="contain"
                      placeholder={
                        <Text align="center">Unexpected error occured. Image cannot be loaded</Text>
                      }
                    />
                    <ActionIcon
                      className="absolute right-2 top-1 bg-white"
                      onClick={e => handleDeleteImage(e, 'signature')}
                      loading={activeImage === 'signature' && isDeleteLoading}
                      disabled={isDeleteLoading}
                    >
                      <Image src={trash} alt="trash-icon" />
                    </ActionIcon>
                  </div>
                ) : null}
              </Box>
            </div>
          </section>

          <section className="border-b py-4 px-5">
            <p className="font-semibold text-lg">Stamp</p>
            <div className="mb-3">
              <span className="font-bold text-gray-500 mr-2">Supported types</span>
              {supportedTypes.map(item => (
                <Badge key={item} className="mr-2">
                  {item}
                </Badge>
              ))}
            </div>
            <div className="flex items-start">
              {!form.values?.letterHead ? (
                <div className="h-[180px] w-[350px] mr-4 mb-2">
                  <Dropzone
                    onDrop={imagePath => onHandleDrop(imagePath, 'letterHead')}
                    accept={['image/png', 'image/jpeg']}
                    className="h-full w-full flex justify-center items-center bg-slate-100"
                    loading={activeImage === 'letterHead' && isUploadLoading}
                    name="letterHead"
                    multiple={false}
                    {...form.getInputProps('letterHead')}
                  >
                    <div className="flex items-center justify-center">
                      <Image src={image} alt="placeholder" height={50} width={50} />
                    </div>
                    <p>
                      Drag and Drop your file here, or{' '}
                      <span className="text-purple-450 border-none">browse</span>
                    </p>
                  </Dropzone>
                  {form.errors?.letterHead ? (
                    <p className="mt-1 text-xs text-red-450">{form.errors?.letterHead}</p>
                  ) : null}
                </div>
              ) : null}
              <Box
                className="bg-white border rounded-md cursor-zoom-in"
                onClick={() => toggleImagePreviewModal(form.values?.letterHead)}
              >
                {form.values?.letterHead ? (
                  <div className="relative">
                    <Image
                      src={form.values?.letterHead}
                      alt="letterHead-preview"
                      height={180}
                      width={350}
                      className="bg-slate-100"
                      fit="contain"
                      placeholder={
                        <Text align="center">Unexpected error occured. Image cannot be loaded</Text>
                      }
                    />
                    <ActionIcon
                      className="absolute right-2 top-1 bg-white"
                      onClick={e => handleDeleteImage(e, 'letterHead')}
                      loading={activeImage === 'letterHead' && isDeleteLoading}
                      disabled={isDeleteLoading}
                    >
                      <Image src={trash} alt="trash-icon" />
                    </ActionIcon>
                  </div>
                ) : null}
              </Box>
            </div>
            <Button
              className="primary-button mt-4"
              type="submit"
              loading={isUploadLoading || isUserUpdateLoading}
              disabled={isUploadLoading || isUserUpdateLoading}
            >
              Upload
            </Button>
          </section>
        </form>
      </FormProvider>
    </article>
  );
};

export default SignatureAndLetterhead;

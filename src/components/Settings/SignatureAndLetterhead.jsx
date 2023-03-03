import { ActionIcon, Badge, Box, Button, Image, Text } from '@mantine/core';
import { useModals } from '@mantine/modals';
import React from 'react';
import { Dropzone } from '@mantine/dropzone';
import { yupResolver } from '@mantine/form';
import * as yup from 'yup';
import modalConfig from '../../utils/modalConfig';
import { useDeleteUploadedFile, useUploadFile } from '../../hooks/upload.hooks';
import image from '../../assets/image.png';
import { supportedTypes } from '../../utils';
import { FormProvider, useForm } from '../../context/formContext';
import trash from '../../assets/trash.svg';

const initialValues = {
  signature: '',
  letterHead: '',
};

const schema = yup.object({
  signature: yup.string().trim().required('Signature is required'),
  letterHead: yup.string().trim().required('Stamp is required'),
});

const SignatureAndLetterhead = () => {
  const modals = useModals();
  const form = useForm({ validate: yupResolver(schema), initialValues });
  const { mutateAsync: upload, isLoading } = useUploadFile();
  const { mutateAsync: deleteFile, isLoading: isDeleteLoading } = useDeleteUploadedFile();

  const onHandleDrop = async (params, key) => {
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
    if (form.values[key]) {
      await deleteFile(form.values[key].split('/').at(-1), {
        onSuccess: () => form.setFieldValue(key, ''),
      });
    }
  };

  const handleSubmit = formData => {
    // TODO:api integration left
    // eslint-disable-next-line no-console
    console.log(formData);
  };

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
              <div className="h-[180px] w-[350px] mr-4 mb-6">
                <Dropzone
                  onDrop={data => onHandleDrop(data, 'signature')}
                  accept={['image/png', 'image/jpeg']}
                  className="h-full w-full flex justify-center items-center bg-slate-100"
                  loading={isLoading}
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
                      loading={isDeleteLoading}
                      disabled={isDeleteLoading}
                    >
                      <Image src={trash} alt="trash-icon" />
                    </ActionIcon>
                  </div>
                ) : null}
              </Box>
            </div>
            <Button
              className="primary-button"
              type="submit"
              loading={isLoading}
              disabled={isLoading}
            >
              Upload
            </Button>
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
              <div className="h-[180px] w-[350px] mr-4 mb-6">
                <Dropzone
                  onDrop={data => onHandleDrop(data, 'letterHead')}
                  accept={['image/png', 'image/jpeg']}
                  className="h-full w-full flex justify-center items-center bg-slate-100"
                  loading={isLoading}
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
                      loading={isDeleteLoading}
                      disabled={isDeleteLoading}
                    >
                      <Image src={trash} alt="trash-icon" />
                    </ActionIcon>
                  </div>
                ) : null}
              </Box>
            </div>
            <Button
              className="primary-button"
              type="submit"
              loading={isLoading}
              disabled={isLoading}
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

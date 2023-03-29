import { ActionIcon, Badge, Box, Group, Image as MantineImage, Radio, Text } from '@mantine/core';
import { ChevronDown } from 'react-feather';
import { useState } from 'react';
import { Dropzone } from '@mantine/dropzone';
import { useModals } from '@mantine/modals';
import classNames from 'classnames';
import { showNotification } from '@mantine/notifications';
import TextareaInput from '../../shared/TextareaInput';
import { useFormContext } from '../../../context/formContext';
import TextInput from '../../shared/TextInput';
import { validateImageResolution, serialize, supportedTypes } from '../../../utils';
import { useFetchMasters } from '../../../hooks/masters.hooks';
import NativeSelect from '../../shared/NativeSelect';
import image from '../../../assets/image.png';
import trash from '../../../assets/trash.svg';
import { useDeleteUploadedFile, useUploadFile } from '../../../hooks/upload.hooks';
import modalConfig from '../../../utils/modalConfig';

const nativeSelectStyles = {
  rightSection: { pointerEvents: 'none' },
  label: {
    marginBottom: '4px',
    fontWeight: 700,
    fontSize: '15px',
    letterSpacing: '0.5px',
  },
};

const styles = {
  label: {
    marginBottom: '4px',
    fontWeight: 700,
    fontSize: '15px',
    letterSpacing: '0.5px',
  },
  monthPickerControlActive: { backgroundColor: '#4B0DAF !important' },
  yearPickerControlActive: { backgroundColor: '#4B0DAF !important' },
};

const BasicInfo = ({ proposalId, userData }) => {
  const modals = useModals();
  const { getInputProps, values, errors, setFieldValue } = useFormContext();
  const [activeImage, setActiveImage] = useState();
  const { mutateAsync: upload, isLoading: isUploadLoading } = useUploadFile();
  const { mutateAsync: deleteFile, isLoading: isDeleteLoading } = useDeleteUploadedFile();

  const { data: proposalStatusData, isLoading: isProposalStatusLoading } = useFetchMasters(
    serialize({ type: 'proposal_status', parentId: null, limit: 100, page: 1 }),
  );

  const onHandleDrop = async (params, key) => {
    const isValidResolution = await validateImageResolution(
      params?.[0],
      key === 'letterHead' ? 150 : key === 'letterFooter' ? 1300 : 0,
      80,
    );
    if (!isValidResolution) {
      showNotification({
        title: 'Please upload below the recommended image size',
        color: 'orange',
      });
      return;
    }

    setActiveImage(key);
    const formData = new FormData();
    formData.append('files', params?.[0]);
    const res = await upload(formData);
    setFieldValue(key, res?.[0].Location);
  };

  const toggleImagePreviewModal = imgSrc =>
    modals.openContextModal('basic', {
      title: 'Preview',
      innerProps: {
        modalBody: (
          <Box className=" flex justify-center" onClick={id => modals.closeModal(id)}>
            {imgSrc ? (
              <MantineImage src={imgSrc} height={580} width={580} alt="preview" fit="contain" />
            ) : (
              <MantineImage src={null} height={580} width={580} withPlaceholder />
            )}
          </Box>
        ),
      },
      ...modalConfig,
    });

  const handleDeleteImage = async (e, key) => {
    e.stopPropagation();
    setActiveImage(key);

    if (values[key]) {
      await deleteFile(values[key].split('/').at(-1), {
        onSuccess: () => setFieldValue(key, ''),
      });
    }
  };

  return (
    <div className="flex gap-4 pt-4 flex-col px-5">
      <Text size="md" weight="bold">
        Basic Information
      </Text>
      <div className="grid grid-cols-2 gap-4">
        <div className="row-span-2">
          <TextInput
            label="Proposal Name"
            name="name"
            withAsterisk
            styles={styles}
            errors={errors}
            className="mb-7"
            placeholder="Write..."
          />
          {proposalId ? (
            <NativeSelect
              label="Status"
              name="status"
              data={
                proposalStatusData?.docs?.map(item => ({
                  label: item?.name,
                  value: item?._id,
                })) || []
              }
              styles={nativeSelectStyles}
              rightSection={<ChevronDown size={16} className="mt-[1px] mr-1" />}
              rightSectionWidth={40}
              disabled={isProposalStatusLoading}
              className="mb-7"
            />
          ) : null}
        </div>
        <div className="row-span-2">
          <TextareaInput
            label="Description"
            name="description"
            styles={styles}
            errors={errors}
            maxLength={200}
            placeholder="Maximum 200 characters"
          />
        </div>
      </div>
      <Radio.Group
        name="uploadType"
        label="Upload exsiting Letter Head/Footer or add new one for this proposal"
        withAsterisk
        styles={styles}
        {...getInputProps('uploadType')}
      >
        <Group>
          <Radio
            value="existing"
            label="Use from Settings"
            classNames={{
              label: classNames(
                !(userData?.letterHead && userData?.letterFooter) ? '' : 'text-gray-700',
                'text-base cursor-pointer',
              ),
              radio: 'cursor-pointer',
            }}
            disabled={!(userData?.letterHead && userData?.letterFooter)}
          />
          <Radio
            value="new"
            label="Upload"
            classNames={{
              label: 'text-base text-gray-700 cursor-pointer',
              radio: 'cursor-pointer',
            }}
          />
        </Group>
      </Radio.Group>
      {values?.uploadType === 'existing' ? (
        <section className="flex gap-x-5">
          {userData?.letterHead ? (
            <div className="flex flex-col">
              <p className="font-semibold text-lg">Letter Header</p>
              <MantineImage
                src={userData.letterHead || null}
                alt="letter-head-preview"
                height={180}
                width={350}
                className="bg-slate-100"
                fit="contain"
                placeholder={
                  <Text align="center">Unexpected error occured. Image cannot be loaded</Text>
                }
              />
            </div>
          ) : null}
          {userData?.letterFooter ? (
            <div className="flex flex-col">
              <p className="font-semibold text-lg">Letter Footer</p>
              <MantineImage
                src={userData.letterFooter || null}
                alt="letter-head-preview"
                height={180}
                width={350}
                className="bg-slate-100"
                fit="contain"
                placeholder={
                  <Text align="center">Unexpected error occured. Image cannot be loaded</Text>
                }
              />
            </div>
          ) : null}
        </section>
      ) : (
        <section className="flex flex-wrap gap-x-5">
          <div>
            <p className="font-semibold text-lg">Letter Header</p>
            <div className="mb-3">
              <span className="font-bold text-gray-500 mr-2">Supported types</span>
              {supportedTypes.map(item => (
                <Badge key={item} className="mr-2">
                  {item}
                </Badge>
              ))}
              <p className="text-red-450">Recommended Size: Max 150px x 80px</p>
            </div>
            <div className="flex items-start">
              {!values?.letterHead ? (
                <div className="h-[180px] w-[350px] mr-4 mb-2">
                  <Dropzone
                    onDrop={imagePath => onHandleDrop(imagePath, 'letterHead')}
                    accept={['image/png', 'image/jpeg']}
                    className="h-full w-full flex justify-center items-center bg-slate-100"
                    loading={activeImage === 'letterHead' && isUploadLoading}
                    name="letterHead"
                    multiple={false}
                    {...getInputProps('letterHead')}
                  >
                    <div className="flex items-center justify-center">
                      <MantineImage src={image} alt="placeholder" height={50} width={50} />
                    </div>
                    <p>
                      Drag and Drop your file here, or{' '}
                      <span className="text-purple-450 border-none">browse</span>
                    </p>
                  </Dropzone>
                  {errors?.letterHead ? (
                    <p className="mt-1 text-xs text-red-450">{errors?.letterHead}</p>
                  ) : null}
                </div>
              ) : null}
              <Box
                className="bg-white border rounded-md cursor-zoom-in"
                onClick={() => toggleImagePreviewModal(values?.letterHead)}
              >
                {values?.letterHead ? (
                  <div className="relative">
                    <MantineImage
                      src={values?.letterHead}
                      alt="letter-head-preview"
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
                      <MantineImage src={trash} alt="trash-icon" />
                    </ActionIcon>
                  </div>
                ) : null}
              </Box>
            </div>
          </div>

          <div>
            <p className="font-semibold text-lg">Letter Footer</p>
            <div className="mb-3">
              <span className="font-bold text-gray-500 mr-2">Supported types</span>
              {supportedTypes.map(item => (
                <Badge key={item} className="mr-2">
                  {item}
                </Badge>
              ))}
              <p className="text-red-450">Recommended Size: Max 1300px x 80px</p>
            </div>
            <div className="flex items-start">
              {!values?.letterFooter ? (
                <div className="h-[180px] w-[350px] mr-4 mb-2">
                  <Dropzone
                    onDrop={imagePath => onHandleDrop(imagePath, 'letterFooter')}
                    accept={['image/png', 'image/jpeg']}
                    className="h-full w-full flex justify-center items-center bg-slate-100"
                    loading={activeImage === 'letterFooter' && isUploadLoading}
                    name="letterFooter"
                    multiple={false}
                    {...getInputProps('letterFooter')}
                  >
                    <div className="flex items-center justify-center">
                      <MantineImage src={image} alt="placeholder" height={50} width={50} />
                    </div>
                    <p>
                      Drag and Drop your file here, or{' '}
                      <span className="text-purple-450 border-none">browse</span>
                    </p>
                  </Dropzone>
                  {errors?.letterFooter ? (
                    <p className="mt-1 text-xs text-red-450">{errors?.letterFooter}</p>
                  ) : null}
                </div>
              ) : null}
              <Box
                className="bg-white border rounded-md cursor-zoom-in"
                onClick={() => toggleImagePreviewModal(values?.letterFooter)}
              >
                {values?.letterFooter ? (
                  <div className="relative">
                    <MantineImage
                      src={values?.letterFooter}
                      alt="letter-footer-preview"
                      height={180}
                      width={350}
                      className="bg-slate-100"
                      fit="contain"
                      withPlaceholder
                      placeholder={
                        <Text align="center">Unexpected error occured. Image cannot be loaded</Text>
                      }
                    />
                    <ActionIcon
                      className="absolute right-2 top-1 bg-white"
                      onClick={e => handleDeleteImage(e, 'letterFooter')}
                      loading={activeImage === 'letterFooter' && isDeleteLoading}
                      disabled={isDeleteLoading}
                    >
                      <MantineImage src={trash} alt="trash-icon" />
                    </ActionIcon>
                  </div>
                ) : null}
              </Box>
            </div>
          </div>
        </section>
      )}
      <section>
        <Text size="md" weight="bold">
          Terms and Conditions:
        </Text>
        <ul className="list-disc pl-5">
          <li>Printing charges are additional.</li>
          <li>Mounting charges are additional.</li>
          <li>Booking amount to be paid at the time of adsite blocking.</li>
          <li>Payment conditions to be adhered at the time of booking.</li>
          <li>GST is applicable as per government rules.</li>
        </ul>
      </section>
    </div>
  );
};

export default BasicInfo;

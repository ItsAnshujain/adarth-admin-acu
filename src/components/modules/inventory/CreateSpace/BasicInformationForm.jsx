import { Dropzone } from '@mantine/dropzone';
import { ActionIcon, Button, FileButton, Image, Text } from '@mantine/core';
import { v4 as uuidv4 } from 'uuid';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import image from '../../../../assets/image.png';
import { useFetchMasters } from '../../../../apis/queries/masters.queries';
import { serialize } from '../../../../utils';
import { useFormContext } from '../../../../context/formContext';
import TextInput from '../../../shared/TextInput';
import TextareaInput from '../../../shared/TextareaInput';
import { useDeleteUploadedFile, useUploadFile } from '../../../../apis/queries/upload.queries';
import Select from '../../../shared/Select';
import NumberInput from '../../../shared/NumberInput';
import AsyncMultiSelect from '../../../shared/AsyncMultiSelect';
import trash from '../../../../assets/trash.svg';
import useTokenIdStore from '../../../../store/user.store';

const styles = {
  label: {
    marginBottom: '4px',
    fontWeight: 700,
    fontSize: '15px',
    letterSpacing: '0.5px',
  },
};

const multiSelectStyles = {
  label: {
    marginBottom: '4px',
    fontWeight: 700,
    fontSize: '15px',
    letterSpacing: '0.5px',
  },
  value: {
    backgroundColor: 'black',
    color: 'white',
    '& button svg': {
      backgroundColor: 'white',
      borderRadius: '50%',
    },
  },
  icon: {
    color: 'white',
  },
};

const query = {
  parentId: null,
  limit: 100,
  page: 1,
  sortBy: 'name',
  sortOrder: 'asc',
};

const BasicInformationForm = () => {
  const queryClient = useQueryClient();
  const userId = useTokenIdStore(state => state.id);
  const userCachedData = queryClient.getQueryData(['users-by-id', userId]);
  const ref = useRef();
  const { errors, getInputProps, values, setFieldValue } = useFormContext();
  const {
    data: organizationData,
    isSuccess: isOrganizationDataLoaded,
    isLoading: isOrganizationDataLoading,
  } = useFetchMasters(serialize({ type: 'organization', ...query }));

  const {
    data: spaceTypeData,
    isSuccess: isSpaceTypeDataLoaded,
    isLoading: isSpaceTypeDataLoading,
  } = useFetchMasters(serialize({ type: 'space_type', ...query }));
  const {
    data: categoryData,
    isSuccess: isCategoryLoaded,
    isLoading: isCategoryLoading,
  } = useFetchMasters(serialize({ type: 'category', ...query }));
  const {
    data: subCategories,
    isSuccess: subCategoryLoaded,
    isLoading: isSubCategoryLoading,
  } = useFetchMasters(
    serialize({ ...query, parentId: values?.basicInformation?.category?.value }),
    !!values?.basicInformation?.category,
  );
  const {
    data: mediaType,
    isSuccess: mediaTypeLoaded,
    isLoading: isMediaTypeLoading,
  } = useFetchMasters(serialize({ type: 'media_type', ...query }));
  const {
    data: audienceData,
    isSuccess: isAudienceDataLoaded,
    isLoading: isAudienceDataLoading,
  } = useFetchMasters(serialize({ type: 'audience', ...query }));
  const {
    data: demographicData,
    isSuccess: isDemographicDataLoaded,
    isLoading: isDemographicDataLoading,
  } = useFetchMasters(serialize({ type: 'demographic', ...query }));

  const { mutateAsync: upload, isLoading } = useUploadFile();
  const { mutateAsync: deleteFile, isLoading: isDeleteLoading } = useDeleteUploadedFile();

  const onHandleDrop = async params => {
    const formData = new FormData();
    formData.append('files', params?.[0]);
    const res = await upload(formData);
    setFieldValue('basicInformation.spacePhoto', res?.[0].Location);
  };

  const onHandleMultipleImages = async params => {
    const formData = new FormData();
    params?.forEach(item => formData.append('files', item));
    const res = await upload(formData);
    const arrayOfImages = res.map(item => item?.Location);
    const tempSpacePhotos = values?.basicInformation?.otherPhotos;
    setFieldValue('basicInformation.otherPhotos', [...tempSpacePhotos, ...arrayOfImages]);
  };

  const handleDeleteImage = async () => {
    if (values?.basicInformation?.spacePhoto) {
      await deleteFile(values?.basicInformation?.spacePhoto.split('/').at(-1), {
        onSuccess: () => setFieldValue('basicInformation.spacePhoto', ''),
      });
    }
  };

  const handleDeleteMultipleImages = async docIndex => {
    const tempSpacePhotos = values?.basicInformation?.otherPhotos;
    const res = tempSpacePhotos.filter(item => item !== tempSpacePhotos[docIndex]);
    await deleteFile(tempSpacePhotos[docIndex]?.split('/').at(-1), {
      onSuccess: () => setFieldValue('basicInformation.otherPhotos', [...res]),
    });
    ref.current.value = '';
  };

  useEffect(() => {
    if (userCachedData && userCachedData?.role !== 'admin') {
      setFieldValue('basicInformation.mediaOwner.label', userCachedData?.company);
      setFieldValue('basicInformation.mediaOwner.value', userCachedData?.companyId);
    }
  }, [organizationData]);

  useEffect(() => {
    if (!subCategories?.docs?.length) {
      setFieldValue('basicInformation.subCategory.label', '');
      setFieldValue('basicInformation.subCategory.value', '');
    }
  }, [subCategories?.docs?.length]);

  return (
    <div className="flex gap-8 pt-4">
      <div className="flex-1 pl-5">
        <p className="mb-7 text-xl font-bold">Basic Information</p>
        <TextInput
          label="Space name"
          name="basicInformation.spaceName"
          withAsterisk
          styles={styles}
          errors={errors}
          placeholder="Write..."
          className="mb-7"
        />
        <TextInput
          label="Landlord"
          name="basicInformation.landlord"
          withAsterisk
          styles={styles}
          errors={errors}
          placeholder="Write..."
          className="mb-7"
        />
        <Select
          label="Inventory Owner (Organization)"
          name="basicInformation.mediaOwner"
          styles={styles}
          errors={errors}
          disabled={
            isOrganizationDataLoading || (userCachedData && userCachedData?.role !== 'admin')
          }
          placeholder="Select..."
          options={
            isOrganizationDataLoaded
              ? organizationData.docs.map(type => ({
                  label: type.name,
                  value: type._id,
                }))
              : []
          }
          className="mb-7"
        />
        <TextInput
          label="Peer Media Owner"
          name="basicInformation.peerMediaOwner"
          styles={styles}
          errors={errors}
          placeholder="Write..."
          className="mb-7"
        />
        <Select
          label="Space Type"
          name="basicInformation.spaceType"
          withAsterisk
          styles={styles}
          errors={errors}
          disabled={isSpaceTypeDataLoading}
          placeholder="Select..."
          options={
            isSpaceTypeDataLoaded
              ? spaceTypeData.docs.map(type => ({
                  label: type.name,
                  value: type._id,
                }))
              : []
          }
          className="mb-7"
        />
        <Select
          label="Category"
          name="basicInformation.category"
          withAsterisk
          styles={styles}
          errors={errors}
          disabled={isCategoryLoading}
          placeholder="Select..."
          options={
            isCategoryLoaded
              ? categoryData.docs.map(category => ({
                  label: category.name,
                  value: category._id,
                }))
              : []
          }
          className="mb-7"
        />
        <Select
          label="Sub Category"
          name="basicInformation.subCategory"
          styles={styles}
          errors={errors}
          disabled={isSubCategoryLoading || !subCategories?.docs?.length}
          placeholder={!subCategories?.docs?.length ? 'No Sub Category available' : 'Select...'}
          options={
            subCategoryLoaded
              ? subCategories.docs.map(subCategory => ({
                  label: subCategory.name,
                  value: subCategory._id,
                }))
              : []
          }
          className="mb-7"
        />
        <Select
          label="Media Type"
          name="basicInformation.mediaType"
          withAsterisk
          styles={styles}
          errors={errors}
          disabled={isMediaTypeLoading}
          placeholder="Select..."
          options={
            mediaTypeLoaded
              ? mediaType.docs.map(type => ({
                  label: type.name,
                  value: type._id,
                }))
              : []
          }
          className="mb-7"
        />

        <TextInput
          label="Supported Media"
          name="basicInformation.supportedMedia"
          styles={styles}
          errors={errors}
          placeholder="Write..."
          className="mb-7"
        />
        <NumberInput
          label="Price"
          name="basicInformation.price"
          withAsterisk
          styles={styles}
          errors={errors}
          placeholder="Write..."
          className="mb-7"
        />
        <NumberInput
          label="Footfall"
          name="basicInformation.footFall"
          styles={styles}
          errors={errors}
          placeholder="Write..."
          className="mb-7"
        />
        <AsyncMultiSelect
          label="Audience"
          name="basicInformation.audience"
          styles={multiSelectStyles}
          errors={errors}
          disabled={isAudienceDataLoading}
          placeholder="Select..."
          options={
            isAudienceDataLoaded
              ? audienceData.docs.map(type => ({
                  label: type.name,
                  value: type._id,
                }))
              : []
          }
          className="mb-7"
        />
        <Select
          label="Demographics"
          name="basicInformation.demographic"
          withAsterisk
          styles={styles}
          errors={errors}
          disabled={isDemographicDataLoading}
          placeholder="Select..."
          options={
            isDemographicDataLoaded
              ? demographicData.docs.map(type => ({
                  label: type.name,
                  value: type._id,
                }))
              : []
          }
          className="mb-7"
        />
        <TextareaInput
          label="Description"
          name="basicInformation.description"
          styles={styles}
          errors={errors}
          maxLength={400}
          placeholder="Maximum 400 characters"
          className="mb-7"
        />
      </div>
      <div className="flex flex-col flex-1 pr-7">
        <div className="mb-2">
          <p className="text-xl font-bold">Photo</p>
          <p className="text-gray-500 my-2">Please select and upload images for the inventory</p>

          {values?.basicInformation?.spacePhoto ? (
            <div className="relative">
              <Image
                src={values?.basicInformation?.spacePhoto}
                alt="more-preview"
                height={400}
                className="bg-slate-300"
                placeholder={
                  <Text align="center">Unexpected error occured. Image cannot be loaded</Text>
                }
              />

              <ActionIcon
                className="absolute right-2 top-1 bg-white"
                onClick={handleDeleteImage}
                loading={isDeleteLoading}
                disabled={isDeleteLoading}
              >
                <Image src={trash} alt="trash-icon" />
              </ActionIcon>
            </div>
          ) : (
            <div className="h-[400px] mb-4">
              <Dropzone
                onDrop={onHandleDrop}
                accept={['image/png', 'image/jpeg']}
                className="h-full w-full flex justify-center items-center bg-slate-100"
                loading={isLoading}
                name="spacePhoto"
                multiple={false}
                {...getInputProps('spacePhoto')}
              >
                <div className="flex items-center justify-center">
                  <Image src={image} alt="placeholder" height={50} width={50} />
                </div>
                <p>
                  Drag and drop the files directly into the upload area or{' '}
                  <span className="text-purple-450 border-none">browse</span>
                </p>
                <p className="text-gray-400 text-center">Supported png format only</p>
              </Dropzone>
            </div>
          )}
        </div>
        <div>
          <p className="text-xl font-bold">Other Images</p>
          <p className="text-gray-500 mb-2">
            To add more photos, please click on the “Add More Photos“ button and select the files
            you wish to upload from your device
          </p>
          <div className="text-right my-4">
            <FileButton
              className="border border-gray-550 p-2 rounded-md text-black"
              onChange={onHandleMultipleImages}
              accept="image/png,image/jpeg"
              multiple
              loading={isLoading}
              ref={ref}
            >
              {props => (
                <Button loaderProps={{ color: 'black' }} {...props}>
                  Add More Photo
                </Button>
              )}
            </FileButton>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {values?.basicInformation?.otherPhotos?.[0] !== '' &&
              values?.basicInformation?.otherPhotos?.map((item, index) => (
                <div className="w-full relative" key={uuidv4()}>
                  <Image src={item} alt="more-preview" height={200} className="bg-slate-300" />
                  <ActionIcon
                    className="absolute right-2 top-1 bg-white"
                    onClick={() => handleDeleteMultipleImages(index)}
                    disabled={isDeleteLoading}
                  >
                    <Image src={trash} alt="trash-icon" />
                  </ActionIcon>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInformationForm;

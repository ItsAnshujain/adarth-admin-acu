import { Dropzone } from '@mantine/dropzone';
import { Button, FileButton, Image, Text } from '@mantine/core';
import image from '../../../assets/image.png';
import { useFetchMasters } from '../../../hooks/masters.hooks';
import { serialize } from '../../../utils';
import { useFormContext } from '../../../context/formContext';
import TextInput from '../../shared/TextInput';
import TextareaInput from '../../shared/TextareaInput';
import NativeSelect from '../../shared/NativeSelect';
import NumberInput from '../../shared/NumberInput';
import { useUploadFile } from '../../../hooks/upload.hooks';

const styles = {
  label: {
    marginBottom: '4px',
    fontWeight: 700,
    fontSize: '15px',
    letterSpacing: '0.5px',
  },
};

const landlordList = [
  { value: 'react', label: 'Shahrukh' },
  { value: 'ng', label: 'Salman' },
  { value: 'svelte', label: 'Aamir' },
  { value: 'vue', label: 'Akshay' },
];

const mediaOwnerList = [
  { value: 'react', label: 'Ram' },
  { value: 'ng', label: 'Shayam' },
  { value: 'svelte', label: 'Damn' },
  { value: 'vue', label: 'Heera' },
];

const supportedMediaTypes = [
  { value: 'react', label: 'Ram' },
  { value: 'ng', label: 'Shayam' },
  { value: 'svelte', label: 'Damn' },
  { value: 'vue', label: 'Heera' },
];

const BasicInfo = () => {
  const { errors, getInputProps, values, setFieldValue } = useFormContext();
  const {
    data: categoryData,
    isSuccess: isCategoryLoaded,
    isLoading: isCategoryLoading,
  } = useFetchMasters(serialize({ type: 'category', parentId: null, limit: 100 }));
  const {
    data: subCategories,
    isSuccess: subCategoryLoaded,
    isLoading: isSubCategoryLoading,
  } = useFetchMasters(
    serialize({ parentId: values?.basicInformation.category }),
    !!values?.basicInformation.category,
  );
  const {
    data: mediaType,
    isSuccess: mediaTypeLoaded,
    isLoading: isMediaTypeLoading,
  } = useFetchMasters(serialize({ type: 'media_type', limit: 100 }));

  const { mutateAsync: upload, isLoading } = useUploadFile();

  const onHandleDrop = async params => {
    const formData = new FormData();
    formData.append('files', params?.[0]);
    const res = await upload(formData);
    // setFieldValue('basicInformation.spacePhotos', [res?.[0].Location]);
    setFieldValue('basicInformation.spacePhotos', res?.[0].Location);
  };

  const onHandleMultipleImages = async params => {
    const formData = new FormData();
    params?.forEach(item => formData.append('files', item));
    const res = await upload(formData);
    const arrayOfImages = res.map(item => item?.Location);
    setFieldValue('basicInformation.otherPhotos', arrayOfImages);
  };

  return (
    <div className="flex gap-8 pt-4">
      <div className="flex-1 pl-5">
        <p className="mb-7 text-xl font-bold">Basic Information</p>
        <TextInput
          label="Space name"
          name="basicInformation.spaceName"
          styles={styles}
          errors={errors}
          placeholder="Write..."
          className="mb-7"
        />
        <NativeSelect
          label="Landlord"
          name="basicInformation.landlord"
          styles={styles}
          errors={errors}
          placeholder="Select..."
          options={landlordList}
          className="mb-7"
          disabled
        />
        <NativeSelect
          label="Inventory Owner"
          name="basicInformation.mediaOwner"
          styles={styles}
          errors={errors}
          placeholder="Select..."
          options={mediaOwnerList}
          className="mb-7"
          disabled
        />
        <NativeSelect
          label="Category"
          name="basicInformation.category"
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
        <NativeSelect
          label="Sub Category"
          name="basicInformation.subCategory"
          styles={styles}
          errors={errors}
          disabled={isSubCategoryLoading}
          placeholder="Select..."
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
        <NativeSelect
          label="Media Type"
          name="basicInformation.mediaType"
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
        <NativeSelect
          label="Supported Media"
          name="basicInformation.supportedMedia"
          styles={styles}
          errors={errors}
          placeholder="Select..."
          options={supportedMediaTypes}
          className="mb-7"
          disabled
        />
        <NumberInput
          label="Price"
          name="basicInformation.price"
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
        <TextInput
          label="Audience"
          name="basicInformation.audience"
          styles={styles}
          errors={errors}
          placeholder="Write..."
          className="mb-7"
          disabled
        />
        <TextInput
          label="Demographics"
          name="basicInformation.demographic"
          styles={styles}
          errors={errors}
          placeholder="Write..."
          className="mb-7"
          disabled
        />
        <TextareaInput
          label="Description"
          name="basicInformation.description"
          styles={styles}
          errors={errors}
          maxLength={200}
          placeholder="Maximum 200 characters"
          className="mb-7"
        />
      </div>
      <div className="flex flex-col flex-1 pr-7">
        <div className="mb-2">
          <p className="text-xl font-bold">Photos</p>
          <p className="text-gray-500 my-2 text-sm">
            Lorem ipsum atque quibusdam quos eius corrupti modi maiores.
          </p>
          <div className="h-[400px] mb-4">
            <Dropzone
              onDrop={onHandleDrop}
              accept={['image/png', 'image/jpeg']}
              className="h-full w-full flex justify-center items-center bg-slate-100"
              loading={isLoading}
              name="spacePhotos"
              multiple={false}
              {...getInputProps('spacePhotos')}
            >
              <div className="flex items-center justify-center">
                <Image src={image} alt="placeholder" height={50} width={50} />
              </div>
              <p>
                Drag and Drop your files here,or{' '}
                <span className="text-purple-450 border-none">browse</span>
              </p>
              <p className="text-gray-400 text-center">Supported png format only</p>
            </Dropzone>
          </div>
          {values?.basicInformation?.spacePhotos ? (
            <Image
              src={values?.basicInformation?.spacePhotos}
              alt="more-preview"
              height={400}
              className="bg-slate-300"
              placeholder={
                <Text align="center">Unexpected error occured. Image cannot be loaded</Text>
              }
            />
          ) : null}
        </div>
        <div className="">
          <p className="text-xl font-bold">Other Images</p>
          <p className="text-gray-400 mb-2">
            Lorem ipsum atque quibusdam quos eius corrupti modi maiores.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {values?.basicInformation?.otherPhotos[0] !== '' &&
              values?.basicInformation?.otherPhotos?.map(item => (
                <div className="w-full">
                  <Image
                    src={item}
                    alt="more-preview"
                    key={item}
                    height={200}
                    className="bg-slate-300"
                  />
                </div>
              ))}
          </div>
          <div className="text-right mt-4">
            <FileButton
              className="border border-gray-550 p-2 rounded-md text-black"
              onChange={onHandleMultipleImages}
              accept="image/png,image/jpeg"
              multiple
              loading={isLoading}
            >
              {props => <Button {...props}> Add More Photo</Button>}
            </FileButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;

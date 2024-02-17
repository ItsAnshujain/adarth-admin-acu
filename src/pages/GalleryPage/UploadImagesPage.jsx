import { ActionIcon, Button } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons';
import { Link } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import ImageDropPicker from './ImageDropPicker';
import { useUploadImages } from '../../apis/queries/gallery.queries';

const UploadImagesPage = () => {
  const form = useForm();

  const uploadImagesHandler = useUploadImages();

  const uploadImages = async () => {};
  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 border-l border-gray-450 overflow-y-auto">
      <FormProvider {...form}>
        <form onSubmit={uploadImages}>
          <div className="flex justify-between w-full items-center h-fit py-3 border-gray-450 border-b">
            <div className="flex gap-4 items-center px-5">
              <ActionIcon to="/gallery" component={Link} className="text-black">
                <IconArrowLeft />
              </ActionIcon>
              <div className="text-xl font-bold">Upload images</div>
            </div>
          </div>
          <div className="px-5 pt-8 flex flex-col justify-center w-1/2 m-auto gap-4">
            <div className="text-xl font-bold">Upload up to 30 images (max 30 MB/image)</div>
            <ImageDropPicker />
            <div className="flex gap-3 w-full">
              <Button
                variant="filled"
                className="bg-black w-full font-normal"
                component={Link}
                to="/gallery"
              >
                Cancel
              </Button>
              <Button variant="filled" className="bg-purple-450 w-full font-normal" type="submit">
                Upload
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default UploadImagesPage;

import { ActionIcon, Button, Checkbox, Image, Menu } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { useClickOutside, useDisclosure } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import MenuIcon from '../../Menu';
import ConfirmContent from '../../shared/ConfirmContent';
import modalConfig from '../../../utils/modalConfig';
import { useDeleteImages } from '../../../apis/queries/gallery.queries';

const ImageCard = ({ image, checked, setSelectedImages, selectedImages }) => {
  const modals = useModals();
  const [menuOpened, menuActions] = useDisclosure();
  const deleteImagesQuery = useDeleteImages();
  const ref = useClickOutside(() => menuActions.close());

  const deleteImage = () => {
    modals.closeModal('deleteImageModal');
    deleteImagesQuery.mutate(image._id, {
      onSuccess: () => {
        showNotification({
          message: 'Image deleted successfully',
          color: 'green',
        });
        setSelectedImages(selectedImages.filter(({ _id }) => _id !== image._id));
      },
    });
  };

  const toggleDelete = () => {
    menuActions.close();
    modals.openModal({
      modalId: 'deleteImageModal',
      title: 'Delete Image',
      children: (
        <ConfirmContent
          onConfirm={deleteImage}
          onCancel={() => modals.closeModal('deleteImageModal')}
          loading={deleteImagesQuery.isLoading}
          classNames="px-6"
        />
      ),
      ...modalConfig,
      size: 'md',
    });
  };

  const handleSelectImage = () => {
    if (selectedImages.some(item => item._id === image?._id)) {
      setSelectedImages(selectedImages.filter(({ _id }) => _id !== image?._id));
    } else {
      setSelectedImages([...selectedImages, image]);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(image?.url);
    showNotification({
      message: 'Link copied!',
    });
  };

  return (
    <div className="rounded-lg border border-gray-200">
      <Image src={image?.url} classNames={{ image: 'rounded-t-lg' }} height={200} />
      <div className="p-4 flex justify-between items-center w-full">
        <Checkbox
          checked={checked}
          label={image.name}
          onClick={handleSelectImage}
          className="w-5/6 truncate"
        />
        <div className="relative" ref={ref}>
          <Menu opened={menuOpened} disabled={deleteImagesQuery.isLoading}>
            <Menu.Target>
              <ActionIcon onClick={menuActions.open}>
                <MenuIcon />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown className="rounded-none -left-20">
              <div className="flex flex-col gap-1">
                <Button
                  variant="default"
                  className="border-none text-left font-normal"
                  classNames={{ inner: 'float-left' }}
                  onClick={copyLink}
                >
                  Copy link
                </Button>
                <Button
                  variant="default"
                  className="border-none text-left font-normal"
                  classNames={{ inner: 'float-left' }}
                  onClick={toggleDelete}
                >
                  Delete
                </Button>
              </div>
            </Menu.Dropdown>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;

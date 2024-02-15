import { ActionIcon, Button, Checkbox, Image, Menu } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { useClickOutside, useDisclosure } from '@mantine/hooks';
import MenuIcon from '../../Menu';
import ConfirmContent from '../../shared/ConfirmContent';
import modalConfig from '../../../utils/modalConfig';

const ImageCard = ({ image, checked, setSelectedImages, selectedImages }) => {
  const modals = useModals();
  const [menuOpened, menuActions] = useDisclosure();
  const ref = useClickOutside(() => menuActions.close());

  const toggleDelete = () => {
    menuActions.close();
    modals.openModal({
      modalId: 'deleteVersionModal',
      title: 'Delete Image',
      children: (
        <ConfirmContent
          onConfirm={() => {}}
          onCancel={() => modals.closeModal('deleteVersionModal')}
          loading={false} // query isLoading
          classNames="px-6"
        />
      ),
      ...modalConfig,
      size: 'md',
    });
  };

  const handleSelectImage = () => {
    if (selectedImages.some(item => item === image.id)) {
      setSelectedImages(selectedImages.filter(id => id !== image.id));
    } else {
      setSelectedImages([...selectedImages, image.id]);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200">
      <Image src={image.link} classNames={{ image: 'rounded-t-lg' }} />
      <div className="p-4 flex justify-between items-center">
        <Checkbox checked={checked} label="image.png" onClick={handleSelectImage} />
        <div className="relative" ref={ref}>
          <Menu opened={menuOpened}>
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

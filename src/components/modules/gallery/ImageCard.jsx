import { ActionIcon, Button, Checkbox, Image, Menu } from '@mantine/core';
import { useModals } from '@mantine/modals';
import MenuIcon from '../../Menu';
import ConfirmContent from '../../shared/ConfirmContent';
import modalConfig from '../../../utils/modalConfig';

const ImageCard = ({ image }) => {
  const modals = useModals();
  const toggleDelete = () => {
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
  return (
    <div className="rounded-lg border border-gray-200">
      <Image src={image.link} classNames={{ image: 'rounded-t-lg' }} />
      <div className="p-4 flex justify-between items-center">
        <Checkbox label="image.png" />
        <div className="relative">
          <Menu closeOnItemClick>
            <Menu.Target>
              <ActionIcon>
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

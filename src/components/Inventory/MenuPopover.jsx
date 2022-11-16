import { useModals } from '@mantine/modals';
import { Button, Menu } from '@mantine/core';
import { Edit2, Eye, Trash } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import modalConfig from '../../utils/modalConfig';
import DeleteConfirmContent from '../DeleteConfirmContent';
import MenuIcon from '../Menu';
import { useDeleteInventoryById } from '../../hooks/inventory.hooks';

const MenuPopover = ({ itemId }) => {
  const modals = useModals();
  const navigate = useNavigate();
  const { mutate: deleteInventory, isLoading } = useDeleteInventoryById();
  const onSubmit = () => {
    deleteInventory({ inventoryId: itemId });
    setTimeout(() => modals.closeAll(), 2000);
  };

  const checkConfirmation = isConfirmed => {
    if (isConfirmed) {
      onSubmit();
    }
  };

  const toggleDeleteModal = () =>
    modals.openContextModal('basic', {
      title: '',
      innerProps: {
        modalBody: (
          <DeleteConfirmContent
            onClickCancel={id => modals.closeModal(id)}
            setIsConfirmed={checkConfirmation}
          />
        ),
      },
      ...modalConfig,
    });

  return (
    <Menu shadow="md" width={180}>
      <Menu.Target>
        <Button>
          <MenuIcon />
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          onClick={() => navigate(`/inventory/view-details/${itemId}`)}
          className="cursor-pointer flex items-center gap-1"
          icon={<Eye className="h-4" />}
          disabled={isLoading}
        >
          <span className="ml-1">View Details</span>
        </Menu.Item>
        <Menu.Item
          onClick={() => navigate(`/inventory/edit-details/${itemId}`)}
          className="cursor-pointer flex items-center gap-1"
          icon={<Edit2 className="h-4" />}
          disabled={isLoading}
        >
          <span className="ml-1">Edit</span>
        </Menu.Item>
        <Menu.Item
          className="cursor-pointer flex items-center gap-1"
          icon={<Trash className="h-4" />}
          onClick={toggleDeleteModal}
          disabled={isLoading}
        >
          <span className="ml-1">Delete</span>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default MenuPopover;

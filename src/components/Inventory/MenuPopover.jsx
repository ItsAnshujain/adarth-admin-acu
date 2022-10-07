import { useModals } from '@mantine/modals';
import { Menu } from '@mantine/core';
import { Edit2, Eye, Trash } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import modalConfig from '../../utils/modalConfig';
import DeleteConfirmContent from '../DeleteConfirmContent';
import MenuIcon from '../Menu';

const MenuPopover = ({ itemId }) => {
  const modals = useModals();
  const navigate = useNavigate();

  const onSubmit = () => {
    // eslint-disable-next-line no-console
    console.log('hello');
  };

  const checkConfirmation = isConfirmed => {
    if (isConfirmed) {
      onSubmit();
    }
  };

  const toggletDeleteModal = () =>
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
        <button type="button">
          <MenuIcon />
        </button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          onClick={() => navigate(`/inventory/view-details/${itemId}`)}
          className="cursor-pointer flex items-center gap-1"
          icon={<Eye className="h-4" />}
        >
          <span className="ml-1">View Details</span>
        </Menu.Item>
        <Menu.Item
          onClick={() => navigate(`/inventory/edit-details/${itemId}`)}
          className="cursor-pointer flex items-center gap-1"
          icon={<Edit2 className="h-4" />}
        >
          <span className="ml-1">Edit</span>
        </Menu.Item>
        <Menu.Item
          className="cursor-pointer flex items-center gap-1"
          icon={<Trash className="h-4" />}
          onClick={toggletDeleteModal}
        >
          <span className="ml-1">Delete</span>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default MenuPopover;

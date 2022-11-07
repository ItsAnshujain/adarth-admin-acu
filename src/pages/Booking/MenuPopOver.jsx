import { Menu } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { useNavigate } from 'react-router-dom';
import { Eye, Trash } from 'react-feather';
import modalConfig from '../../utils/modalConfig';
import DeleteConfirmContent from '../../components/DeleteConfirmContent';
import MenuIcon from '../../components/Menu';
import { useDeleteBooking } from '../../hooks/booking.hooks';

const MenuPopover = ({ itemId }) => {
  const modals = useModals();
  const navigate = useNavigate();
  const { mutateAsync: deleteBooking, isLoading } = useDeleteBooking();

  const onSubmit = () => {
    deleteBooking(itemId);
    setTimeout(() => modals.closeModal(), 2000);
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
    <Menu shadow="md" width={150}>
      <Menu.Target>
        <button type="button">
          <MenuIcon />
        </button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          onClick={() => navigate(`/bookings/view-details/${itemId}`)}
          className="cursor-pointer flex items-center gap-1"
          icon={<Eye className="h-4" />}
        >
          <span className="ml-1">View</span>
        </Menu.Item>
        <Menu.Item
          icon={<Trash className="h-4" />}
          onClick={() => toggleDeleteModal()}
          disabled={isLoading}
          className="cursor-pointer flex items-center gap-1"
        >
          <span className="ml-1">Delete</span>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default MenuPopover;

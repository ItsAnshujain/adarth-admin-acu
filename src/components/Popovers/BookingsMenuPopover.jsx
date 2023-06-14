import { Button, Menu } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { Link } from 'react-router-dom';
import { Eye, Trash } from 'react-feather';
import modalConfig from '../../utils/modalConfig';
import MenuIcon from '../Menu';
import RoleBased from '../RoleBased';
import { ROLES } from '../../utils';
import DeleteBookingContent from '../DeleteBookingContent';

const BookingsMenuPopover = ({ itemId, enableView = true, enableDelete = true }) => {
  const modals = useModals();

  const toggleDeleteModal = () =>
    modals.openContextModal('basic', {
      title: '',
      innerProps: {
        modalBody: (
          <DeleteBookingContent onClickCancel={id => modals.closeModal(id)} bookingId={itemId} />
        ),
      },
      ...modalConfig,
    });

  return (
    <Menu shadow="md" width={150}>
      <Menu.Target>
        <Button>
          <MenuIcon />
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        {enableView ? (
          <Link to={`/bookings/view-details/${itemId}`}>
            <Menu.Item
              className="cursor-pointer flex items-center gap-1"
              icon={<Eye className="h-4" />}
            >
              <span className="ml-1">View</span>
            </Menu.Item>
          </Link>
        ) : null}
        {enableDelete ? (
          <RoleBased acceptedRoles={[ROLES.ADMIN, ROLES.SUPERVISOR, ROLES.MANAGEMENT]}>
            <Menu.Item
              icon={<Trash className="h-4" />}
              onClick={toggleDeleteModal}
              className="cursor-pointer flex items-center gap-1"
            >
              <span className="ml-1">Delete</span>
            </Menu.Item>
          </RoleBased>
        ) : null}
      </Menu.Dropdown>
    </Menu>
  );
};

export default BookingsMenuPopover;

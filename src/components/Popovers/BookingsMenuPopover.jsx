import { Button, Menu } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { useNavigate } from 'react-router-dom';
import { Eye, Trash } from 'react-feather';
import modalConfig from '../../utils/modalConfig';
import MenuIcon from '../Menu';
import RoleBased from '../RoleBased';
import { ROLES } from '../../utils';
import DeleteBookingContent from '../DeleteBookingContent';

const BookingsMenuPopover = ({ itemId, enableView = true, enableDelete = true }) => {
  const modals = useModals();
  const navigate = useNavigate();

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
          <Menu.Item
            onClick={() => navigate(`/bookings/view-details/${itemId}`)}
            className="cursor-pointer flex items-center gap-1"
            icon={<Eye className="h-4" />}
          >
            <span className="ml-1">View</span>
          </Menu.Item>
        ) : null}
        {enableDelete ? (
          <RoleBased
            acceptedRoles={[ROLES.ADMIN, ROLES.MEDIA_OWNER, ROLES.SUPERVISOR, ROLES.MANAGER]}
          >
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

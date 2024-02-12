import { Button, Menu } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { Link } from 'react-router-dom';
import { Edit2, Eye, Trash } from 'react-feather';
import shallow from 'zustand/shallow';
import modalConfig from '../../utils/modalConfig';
import MenuIcon from '../Menu';
import RoleBased from '../RoleBased';
import { ROLES } from '../../utils';
import DeleteBookingContent from '../DeleteBookingContent';
import useBookingStore from '../../store/booking.store';

const BookingsMenuPopover = ({
  itemId,
  enableView = true,
  enableEdit = true,
  enableDelete = true,
}) => {
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

  const { setBookingData } = useBookingStore(
    state => ({
      setBookingData: state.setBookingData,
    }),
    shallow,
  );

  return (
    <Menu shadow="md" width={120}>
      <Menu.Target>
        <Button>
          <MenuIcon />
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        {enableView ? (
          <Link to={`/bookings/view-details/${itemId}`}>
            <Menu.Item icon={<Eye className="h-4" />}>View</Menu.Item>
          </Link>
        ) : null}
        {enableEdit ? (
          <Link to={`/bookings/edit-details/${itemId}`} onClick={() => setBookingData([])}>
            <Menu.Item icon={<Edit2 className="h-4" />}>Edit</Menu.Item>
          </Link>
        ) : null}
        {enableDelete ? (
          <RoleBased acceptedRoles={[ROLES.ADMIN, ROLES.SUPERVISOR, ROLES.MANAGEMENT]}>
            <Menu.Item icon={<Trash className="h-4" />} onClick={toggleDeleteModal}>
              Delete
            </Menu.Item>
          </RoleBased>
        ) : null}
      </Menu.Dropdown>
    </Menu>
  );
};

export default BookingsMenuPopover;

import { useModals } from '@mantine/modals';
import { Button, Menu } from '@mantine/core';
import { Edit2, Eye, Trash } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import modalConfig from '../../utils/modalConfig';
import DeleteSpaceContent from '../DeleteSpaceContent';
import MenuIcon from '../Menu';
import { handleStopPropagation } from '../../utils';

const SpacesMenuPopover = ({
  itemId,
  enableView = true,
  enableEdit = true,
  enableDelete = true,
  openInNewWindow = false,
}) => {
  const modals = useModals();
  const navigate = useNavigate();

  const toggleDeleteModal = () =>
    modals.openContextModal('basic', {
      title: '',
      innerProps: {
        modalBody: (
          <DeleteSpaceContent onClickCancel={id => modals.closeModal(id)} inventoryId={itemId} />
        ),
      },
      ...modalConfig,
    });

  const handleInventoryDetails = () => window.open(`/inventory/view-details/${itemId}`, '_blank');

  return (
    <Menu shadow="md" width={180} withinPortal>
      <Menu.Target>
        <Button className="py-0" onClick={e => e.stopPropagation()}>
          <MenuIcon />
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        {enableView ? (
          <Menu.Item
            onClick={e =>
              handleStopPropagation(
                e,
                openInNewWindow
                  ? handleInventoryDetails()
                  : navigate(`/inventory/view-details/${itemId}`),
              )
            }
            className="cursor-pointer flex items-center gap-1"
            icon={<Eye className="h-4" />}
          >
            <span className="ml-1">View Details</span>
          </Menu.Item>
        ) : null}
        {enableEdit ? (
          <Menu.Item
            onClick={e => handleStopPropagation(e, navigate(`/inventory/edit-details/${itemId}`))}
            className="cursor-pointer flex items-center gap-1"
            icon={<Edit2 className="h-4" />}
          >
            <span className="ml-1">Edit</span>
          </Menu.Item>
        ) : null}
        {enableDelete ? (
          <Menu.Item
            className="cursor-pointer flex items-center gap-1"
            icon={<Trash className="h-4" />}
            onClick={e => handleStopPropagation(e, toggleDeleteModal)}
          >
            <span className="ml-1">Delete</span>
          </Menu.Item>
        ) : null}
      </Menu.Dropdown>
    </Menu>
  );
};

export default SpacesMenuPopover;

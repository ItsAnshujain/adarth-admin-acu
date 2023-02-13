import { Button, Menu } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { Link } from 'react-router-dom';
import { Eye, Edit2, Trash } from 'react-feather';
import modalConfig from '../../utils/modalConfig';
import DeleteProposalContent from '../DeleteProposalContent';
import MenuIcon from '../Menu';
import { handleStopPropagation } from '../../utils';

const ProposalsMenuPopover = ({
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
          <DeleteProposalContent onClickCancel={id => modals.closeModal(id)} proposalId={itemId} />
        ),
      },
      ...modalConfig,
    });

  return (
    <Menu shadow="md" width={150} withinPortal>
      <Menu.Target>
        <Button className="py-0" onClick={e => e.preventDefault()}>
          <MenuIcon />
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        {enableView ? (
          <Link to={`/proposals/view-details/${itemId}`}>
            <Menu.Item
              className="cursor-pointer flex items-center gap-1"
              icon={<Eye className="h-4" />}
            >
              <span className="ml-1">View</span>
            </Menu.Item>
          </Link>
        ) : null}
        {enableEdit ? (
          <Link to={`/proposals/edit-details/${itemId}`}>
            <Menu.Item
              icon={<Edit2 className="h-4" />}
              className="cursor-pointer flex items-center gap-1"
            >
              <span className="ml-1">Edit</span>
            </Menu.Item>
          </Link>
        ) : null}
        {enableDelete ? (
          <Menu.Item
            icon={<Trash className="h-4" />}
            onClick={e => handleStopPropagation(e, toggleDeleteModal)}
            className="cursor-pointer flex items-center gap-1"
          >
            <span className="ml-1">Delete</span>
          </Menu.Item>
        ) : null}
      </Menu.Dropdown>
    </Menu>
  );
};

export default ProposalsMenuPopover;

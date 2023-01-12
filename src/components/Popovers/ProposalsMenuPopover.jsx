import { Button, Menu } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit2, Trash } from 'react-feather';
import modalConfig from '../../utils/modalConfig';
import DeleteConfirmContent from '../DeleteConfirmContent';
import MenuIcon from '../Menu';
import { useDeleteProposal } from '../../hooks/proposal.hooks';
import { handleStopPropagation } from '../../utils';

const ProposalsMenuPopover = ({
  itemId,
  enableView = true,
  enableEdit = true,
  enableDelete = true,
}) => {
  const modals = useModals();
  const navigate = useNavigate();
  const { mutate: deleteItem, isLoading } = useDeleteProposal();

  const onSubmit = () => {
    deleteItem({ proposalId: itemId });
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
        <Button className="py-0" onClick={e => e.stopPropagation()}>
          <MenuIcon />
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        {enableView ? (
          <Menu.Item
            onClick={e => handleStopPropagation(e, navigate(`/proposals/view-details/${itemId}`))}
            className="cursor-pointer flex items-center gap-1"
            icon={<Eye className="h-4" />}
          >
            <span className="ml-1">View</span>
          </Menu.Item>
        ) : null}
        {enableEdit ? (
          <Menu.Item
            onClick={e => handleStopPropagation(e, navigate(`/proposals/edit-details/${itemId}`))}
            icon={<Edit2 className="h-4" />}
            className="cursor-pointer flex items-center gap-1"
          >
            <span className="ml-1">Edit</span>
          </Menu.Item>
        ) : null}
        {enableDelete ? (
          <Menu.Item
            icon={<Trash className="h-4" />}
            onClick={e => handleStopPropagation(e, toggleDeleteModal())}
            disabled={isLoading}
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

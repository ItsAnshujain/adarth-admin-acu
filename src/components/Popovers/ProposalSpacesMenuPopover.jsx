import { Button, Menu } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { useNavigate, useParams } from 'react-router-dom';
import { Eye, Edit2, Trash } from 'react-feather';
import MenuIcon from '../Menu';
import modalConfig from '../../utils/modalConfig';
import DeleteProposalSpacesContent from '../DeleteProposalSpacesContent';

const ProposalSpacesMenuPopover = ({ inventoryId, spacesData }) => {
  const modals = useModals();
  const navigate = useNavigate();
  const { id: proposalId } = useParams();

  const toggleDeleteModal = () =>
    modals.openContextModal('basic', {
      title: '',
      innerProps: {
        modalBody: (
          <DeleteProposalSpacesContent
            onClickCancel={id => modals.closeModal(id)}
            spacesData={spacesData}
            inventoryId={inventoryId}
            proposalId={proposalId}
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
        <Menu.Item
          onClick={() => navigate(`/inventory/view-details/${inventoryId}`)}
          className="cursor-pointer flex items-center gap-1"
          icon={<Eye className="h-4" />}
        >
          <span className="ml-1">View</span>
        </Menu.Item>
        <Menu.Item
          onClick={() => navigate(`/inventory/edit-details/${inventoryId}`)}
          icon={<Edit2 className="h-4" />}
          className="cursor-pointer flex items-center gap-1"
        >
          <span className="ml-1">Edit</span>
        </Menu.Item>
        <Menu.Item
          icon={<Trash className="h-4" />}
          onClick={toggleDeleteModal}
          className="cursor-pointer flex items-center gap-1"
        >
          <span className="ml-1">Delete</span>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default ProposalSpacesMenuPopover;

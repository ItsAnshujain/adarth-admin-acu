import { Menu } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { Edit2, Eye, Trash } from 'react-feather';
import MenuIcon from '../../Menu';

const COLUMNS = [
  {
    Header: '#',
    accessor: 'id',
  },
  {
    Header: 'PROPOSAL NAME',
    accessor: 'proposal_name',
  },
  {
    Header: 'STATUS',
    accessor: 'status',
  },
  {
    Header: 'CLIENT',
    accessor: 'client',
  },
  {
    Header: 'TOTAL PLACES',
    accessor: 'total_places',
  },
  {
    Header: 'PRICING',
    accessor: 'pricing',
  },
  {
    Header: 'CREATED ON',
    accessor: 'created_on',
  },
  {
    Header: '',
    accessor: 'details',
    disableSortBy: true,
    Cell: tableProps => {
      const navigate = useNavigate();
      const {
        row: {
          original: { id },
        },
      } = tableProps;

      return (
        <Menu shadow="md" width={150}>
          <Menu.Target>
            <button type="button">
              <MenuIcon />
            </button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item>
              <dbutton
                type="button"
                onClick={() => navigate(`/proposals/view-details/${id}`)}
                className="cursor-pointer flex items-center gap-1"
              >
                <Eye className="h-4" />
                <span className="ml-1">View Details</span>
              </dbutton>
            </Menu.Item>
            <Menu.Item>
              <button
                type="button"
                onClick={() => navigate(`/proposals/edit-details/${id}`)}
                className="cursor-pointer flex items-center gap-1"
              >
                <Edit2 className="h-4" />
                <span className="ml-1">Edit</span>
              </button>
            </Menu.Item>
            <Menu.Item>
              <div className="cursor-pointer flex items-center gap-1">
                <Trash className="h-4" />
                <span className="ml-1">Delete</span>
              </div>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      );
    },
  },
];

export default COLUMNS;

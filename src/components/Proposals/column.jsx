/* eslint-disable */
import { useNavigate } from 'react-router-dom';
import MenuIcon from '../Menu';
import { Eye, Edit2, Trash } from 'react-feather';
import { Menu } from '@mantine/core';

const COLUMNS = [
  {
    Header: '#',
    accessor: 'id',
  },
  {
    Header: 'PROPOSAL NAME',
    accessor: 'proposal_name',
    Cell: tableProps => {
      const navigate = useNavigate();
      const {
        row: {
          original: { id, proposal_name },
        },
      } = tableProps;

      return (
        <div className="cursor-pointer" onClick={() => navigate(`view-details/${id}`)}>
          {proposal_name}
        </div>
      );
    },
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
            <button>
              <MenuIcon />
            </button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item>
              <div
                onClick={() => navigate(`/proposals/view-details/${id}`)}
                className="cursor-pointer flex items-center gap-1"
              >
                <Eye className="h-4" />
                <span className="ml-1">View Details</span>
              </div>
            </Menu.Item>
            <Menu.Item>
              <div
                onClick={() => navigate(`/proposals/edit-details/${id}`)}
                className="cursor-pointer flex items-center gap-1"
              >
                <Edit2 className="h-4" />
                <span className="ml-1">Edit</span>
              </div>
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

import { useNavigate } from 'react-router-dom';
import { Eye, Edit2, Trash } from 'react-feather';
import { Menu } from '@mantine/core';
import toIndianCurrency from '../../utils/currencyFormat';
import MenuIcon from '../Menu';
import Badge from '../shared/Badge';

const COLUMNS = [
  {
    Header: '#',
    accessor: 'id',
  },
  {
    Header: 'SPACE NAME & PHOTO',
    accessor: 'space_name_and_photo',
    Cell: tableProps => {
      const navigate = useNavigate();

      const {
        row: {
          original: { status, photo, space_name, id },
        },
      } = tableProps;

      const color =
        status === 'Available' ? 'green' : status === 'Unavailable' ? 'orange' : 'primary';
      return (
        <div
          aria-hidden
          onClick={() => navigate(`view-details/${id}`)}
          className="grid grid-cols-2 gap-2 items-center cursor-pointer"
        >
          <div className="flex flex-1 gap-2 items-center w-44">
            <div className="bg-white h-8 w-8 border rounded-md">
              <img className="h-8 w-8 mx-auto" src={photo} alt="banner" />
            </div>
            <p>{space_name}</p>
          </div>
          <div className="w-fit">
            <Badge radius="xl" text={status} color={color} variant="filled" size="sm" />
          </div>
        </div>
      );
    },
  },
  {
    Header: 'MEDIA OWNER NAME',
    accessor: 'landlord_name',
    Cell: tableProps => {
      const {
        row: {
          original: { landlord_name },
        },
      } = tableProps;

      <div className="w-fit">{landlord_name}</div>;
    },
  },
  {
    Header: 'SPACE TYPE',
    accessor: 'space_type',
  },
  {
    Header: 'TOTAL REVENUE',
    accessor: 'total_revenue',
    Cell: () => <div className="w-fit mr-2">{toIndianCurrency(48964)}</div>,
  },
  {
    Header: 'TOTAL BOOKING',
    accessor: 'total_booking',
    Cell: () => <div className="w-fit">{527}</div>,
  },
  {
    Header: 'TOTAL OPERATIONAL COST',
    accessor: 'total_operational_cost',
    Cell: () => <div className="w-fit mr-2">{toIndianCurrency(48967984)}</div>,
  },
  {
    Header: 'DIMENSION',
    accessor: 'dimension',
  },
  {
    Header: 'IMPRESSION',
    accessor: 'impression',
  },
  {
    Header: 'HEALTH',
    accessor: 'health',
  },
  {
    Header: 'LOCATION',
    accessor: 'location',
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
            <button type="button">
              <MenuIcon />
            </button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item>
              <button
                type="button"
                onClick={() => navigate(`/inventory/view-details/${id}`)}
                className="cursor-pointer flex items-center gap-1"
              >
                <Eye className="h-4" />
                <span className="ml-1">View Details</span>
              </button>
            </Menu.Item>
            <Menu.Item>
              <button
                type="button"
                onClick={() => navigate(`/inventory/edit-details/${id}`)}
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

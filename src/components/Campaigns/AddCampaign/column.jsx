/* eslint-disable */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../../shared/Badge';
import MenuIcon from '../../Menu';
import { useClickOutside } from '@mantine/hooks';
import { Eye, Edit2, Trash } from 'react-feather';

const COLUMNS = [
  {
    Header: '#',
    accessor: 'id',
  },
  {
    Header: 'SPACE NAME & PHOTO',
    accessor: 'space_name_and_photo',
    Cell: tableProps => {
      const {
        row: {
          original: { status, photo, space_name },
        },
      } = tableProps;

      const color =
        status === 'Available' ? 'green' : status === 'Unavailable' ? 'orange' : 'primary';
      return (
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="bg-white border rounded-md">
            <img className="h-8 mx-auto" src={photo} alt="banner" />
          </div>
          <p className="flex-1">{space_name}</p>
          <div className="flex-1">
            <Badge radius="xl" text={status} color={color} variant="filled" size="sm" />
          </div>
        </div>
      );
    },
  },
  {
    Header: 'LANDLORD NAME',
    accessor: 'landlord_name',
    Cell: tableProps => {
      const {
        row: {
          original: { landlord_name },
        },
      } = tableProps;
      return <div className="w-fit">{landlord_name}</div>;
    },
  },
  {
    Header: 'SPACE TYPE',
    accessor: 'space_type',
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
    Header: 'MEDIA TYPE',
    accessor: 'media_type',
  },
  {
    Header: 'PRICING',
    accessor: 'pricing',
  },
  {
    Header: '',
    accessor: 'details',
    Cell: tableProps => {
      const [showMenu, setShowMenu] = useState(false);
      const ref = useClickOutside(() => setShowMenu(false));
      const navigate = useNavigate();
      const {
        row: {
          original: { id },
        },
      } = tableProps;
      return (
        <div ref={ref} onClick={() => setShowMenu(!showMenu)}>
          <div className="relative">
            <MenuIcon />
            {showMenu && (
              <div className="absolute w-36 shadow-lg text-sm gap-2 flex flex-col border z-10  items-start right-4 top-0 bg-white py-4 px-2">
                <div
                  onClick={() => navigate(`/inventory/view-details/${id}`)}
                  className="bg-white flex items-center"
                >
                  <Eye className="h-4 mr-2" />
                  <span>View Details</span>
                </div>
                <div className="bg-white flex items-center">
                  <Edit2 className="h-4 mr-2" />
                  <span>Edit</span>
                </div>
                <div className="bg-white flex items-center">
                  <Trash className="h-4 mr-2" />
                  <span>Delete</span>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    },
  },
];

export default COLUMNS;

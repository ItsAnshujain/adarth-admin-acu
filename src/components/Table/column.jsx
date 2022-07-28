/* eslint-disable */
import { useState } from 'react';
import Badge from '../shared/Badge';
import MenuIcon from '../Menu';
import { useNavigate } from 'react-router-dom';

const COLUMNS = [
  {
    Header: '#',
    accessor: 'id',
  },
  {
    Header: 'SPACE NAME & PHOTO',
    accessor: 'space_name_and_photo',
    Cell: tableProps => {
      const { status, photo, space_name } = tableProps.row.original;
      const color =
        status === 'Available' ? 'green' : status === 'Unavailable' ? 'orange' : 'primary';
      return (
        <div className="flex items-center gap-2">
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
    Cell: tableProps => <div className="w-fit">{tableProps.row.original['landlord_name']}</div>,
  },
  {
    Header: 'PEER',
    accessor: 'peer',
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
    Header: 'PRICING',
    accessor: 'pricing',
  },
  {
    Header: '',
    accessor: 'details',
    Cell: tableProps => {
      const [showMenu, setShowMenu] = useState(false);
      const navigate = useNavigate();
      const { id } = tableProps.row.original;
      return (
        <div onClick={() => setShowMenu(!showMenu)}>
          <div className="relative">
            <MenuIcon />
            {showMenu && (
              <div className="absolute w-36 shadow-lg text-sm gap-2 flex flex-col border z-10  items-start right-4 top-0 bg-white py-4 px-2">
                <div onClick={() => navigate(`view/${id}`)} className="bg-white">
                  View Details
                </div>
                <div className="bg-white">Edit</div>
                <div className="bg-white">Delete</div>
              </div>
            )}
          </div>
        </div>
      );
    },
  },
];

export default COLUMNS;

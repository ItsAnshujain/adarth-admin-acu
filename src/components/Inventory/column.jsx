/* eslint-disable */
import { useState, useRef, useEffect } from 'react';
import Badge from '../shared/Badge';
import MenuIcon from '../Menu';
import { useNavigate } from 'react-router-dom';
import { Mail } from 'react-feather';
import useOutsideClick from '../../hooks/useOutsideClick';

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
      const { status, photo, space_name, id } = tableProps.row.original;
      const color =
        status === 'Available' ? 'green' : status === 'Unavailable' ? 'orange' : 'primary';
      return (
        <div
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
      const menuRef = useOutsideClick(setShowMenu);
      const navigate = useNavigate();
      const { id } = tableProps.row.original;

      return (
        <div ref={menuRef}>
          <div onClick={() => setShowMenu(!showMenu)} className="relative ">
            <MenuIcon />
            {showMenu && (
              <div className="absolute w-36 shadow-lg text-sm gap-2 flex flex-col border z-50  items-start right-4 top-0 bg-white py-4 px-2">
                <div
                  onClick={() => navigate(`view-details/${id}`)}
                  className="bg-white cursor-pointer flex items-center gap-1"
                >
                  <Mail className="h-4" />
                  <span className="ml-1">View Details</span>
                </div>
                <div
                  onClick={() => navigate(`edit-details/${id}`)}
                  className="bg-white cursor-pointer flex items-center gap-1"
                >
                  <Mail className="h-4" />
                  <span className="ml-1">Edit</span>
                </div>
                <div className="bg-white cursor-pointer flex items-center gap-1">
                  <Mail className="h-4" />
                  <span className="ml-1">Delete</span>
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

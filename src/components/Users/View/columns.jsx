/* eslint-disable */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Eye, Trash } from 'react-feather';
import MenuIcon from '../../Menu';
import { useClickOutside } from '@mantine/hooks';

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
    Cell: tableProps => {
      const [showMenu, setShowMenu] = useState(false);
      const ref = useClickOutside(() => setShowMenu(false));
      const navigate = useNavigate();
      const { id } = tableProps.row.original;

      return (
        <div ref={ref} onClick={() => setShowMenu(!showMenu)}>
          <div className="relative mx-2">
            <MenuIcon />
            {showMenu && (
              <div className="absolute w-36 shadow-lg text-sm gap-2 flex flex-col border z-10  items-start right-4 top-0 bg-white py-4 px-2">
                <div
                  onClick={() => navigate(`/proposals/view-details/${id}`)}
                  className="bg-white cursor-pointer"
                >
                  <Eye className="mr-1 text-gray-400 inline h-5" />
                  <span>View Details</span>
                </div>
                <div
                  onClick={() => navigate(`edit-details/${id}`)}
                  className="bg-white cursor-pointer"
                >
                  <Edit2 className="mr-1 text-gray-400 inline h-5" />
                  <span>Edit</span>
                </div>
                <div className="bg-white cursor-pointer">
                  <Trash className="mr-1 text-gray-400 inline h-5" />
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

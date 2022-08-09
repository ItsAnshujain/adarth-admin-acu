/* eslint-disable */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '../Menu';

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
    Cell: tableProps => {
      const [showMenu, setShowMenu] = useState(false);
      const navigate = useNavigate();
      const {
        row: {
          original: { id },
        },
      } = tableProps;
      return (
        <div type="button" onClick={() => setShowMenu(!showMenu)}>
          <div className="relative">
            <MenuIcon />
            {showMenu && (
              <div className="absolute w-36 shadow-lg text-sm gap-2 flex flex-col border z-10  items-start right-4 top-0 bg-white py-4 px-2">
                <button
                  type="button"
                  onClick={() => navigate(`/proposals/view-details/${id}`)}
                  className="bg-white"
                >
                  View
                </button>
                <div
                  onClick={() => navigate(`/proposals/edit-details/${id}`)}
                  className="bg-white cursor-pointer"
                >
                  Edit
                </div>
                <div className="bg-white cursor-pointer">Delete</div>
              </div>
            )}
          </div>
        </div>
      );
    },
  },
];

export default COLUMNS;

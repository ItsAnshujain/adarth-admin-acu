/* eslint-disable */
import { useState } from 'react';
import { NativeSelect } from '@mantine/core';
import MenuIcon from '../Menu';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'react-feather';
import { useClickOutside } from '@mantine/hooks';
import { Trash, Edit2, Eye, Bookmark } from 'react-feather';

const COLUMNS = [
  {
    Header: '#',
    accessor: 'id',
  },
  {
    Header: 'CAMPAIGN NAME',
    accessor: 'space_name',
    Cell: tableProps => {
      const navigate = useNavigate();
      const { status, photo, space_name, id } = tableProps.row.original;
      const color =
        status === 'Available' ? 'green' : status === 'Unavailable' ? 'orange' : 'primary';
      return (
        <div
          onClick={() => navigate(`view-details/${id}`)}
          className="flex gap-2 items-center cursor-pointer"
        >
          <div className="flex flex-1 gap-2 items-center ">
            <div className="bg-white h-8 w-8 border rounded-md">
              <img className="h-8 w-8 mx-auto" src={photo} alt="banner" />
            </div>
            <p>{space_name}</p>
          </div>
        </div>
      );
    },
  },
  {
    Header: 'TYPE',
    accessor: 'type',
  },
  {
    Header: 'HEALTH',
    accessor: 'health',
  },
  {
    Header: 'STATUS',
    accessor: 'status',
    Cell: tableProps => {
      const {
        row: {
          original: { pricing },
        },
      } = tableProps;

      const [value, setValue] = useState(pricing);

      return (
        <NativeSelect
          value={value}
          onChange={e => setValue(e.target.value)}
          data={['Published', 'Unpublished']}
          styles={{
            rightSection: { pointerEvents: 'none' },
          }}
          rightSection={<ChevronDown size={16} className="mt-[1px] mr-1" />}
          rightSectionWidth={40}
        />
      );
    },
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
      const ref = useClickOutside(() => setShowMenu(false));
      const navigate = useNavigate();
      const { id } = tableProps.row.original;
      return (
        <div ref={ref} onClick={() => setShowMenu(!showMenu)}>
          <div className="relative">
            <MenuIcon />
            {showMenu && (
              <div className="absolute w-36 shadow-lg text-sm gap-2 flex flex-col border z-10  items-start right-4 top-0 bg-white py-4 px-2">
                <div
                  onClick={() => navigate(`view-details/${id}`)}
                  className="bg-white cursor-pointer flex items-center"
                >
                  <Eye className="h-4 mr-2" />
                  <span>View</span>
                </div>
                <div
                  onClick={() => navigate(`edit-details/${id}`)}
                  className="bg-white cursor-pointer flex items-center "
                >
                  <Edit2 className="h-4 mr-2" />
                  <span>Edit</span>
                </div>
                <div className="bg-white cursor-pointer flex items-center ">
                  <Trash className="h-4 mr-2" />
                  <span>Delete</span>
                </div>
                <div className="bg-white cursor-pointer flex items-center ">
                  <Bookmark className="h-4 mr-2" />
                  <span>Set as Featured</span>
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

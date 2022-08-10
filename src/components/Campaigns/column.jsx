/* eslint-disable */
import { useState } from 'react';
import { NativeSelect } from '@mantine/core';
import Badge from '../shared/Badge';
import MenuIcon from '../Menu';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'react-feather';

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
          className="flex items-center cursor-pointer"
        >
          <div className="bg-white border rounded-md">
            <img className="h-8 mx-auto" src={photo} alt="banner" />
          </div>
          <p className="flex-1 mx-2">{space_name}</p>
          <div className="grow">
            <Badge radius="xl" text={status} color={color} variant="filled" size="sm" />
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
            wrapper: {
              width: '62%',
            },
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
      const navigate = useNavigate();
      const { id } = tableProps.row.original;
      return (
        <div onClick={() => setShowMenu(!showMenu)}>
          <div className="relative">
            <MenuIcon />
            {showMenu && (
              <div className="absolute w-36 shadow-lg text-sm gap-2 flex flex-col border z-10  items-start right-4 top-0 bg-white py-4 px-2">
                <div
                  onClick={() => navigate(`view-details/${id}`)}
                  className="bg-white cursor-pointer"
                >
                  View
                </div>
                <div
                  onClick={() => navigate(`edit-details/${id}`)}
                  className="bg-white cursor-pointer"
                >
                  Edit
                </div>
                <div className="bg-white cursor-pointer">Delete</div>
                <div className="bg-white cursor-pointer">Set as Featured</div>
              </div>
            )}
          </div>
        </div>
      );
    },
  },
];

export default COLUMNS;

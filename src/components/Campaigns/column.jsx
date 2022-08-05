/* eslint-disable */
import { useState } from 'react';
import { NativeSelect } from '@mantine/core';
import Badge from '../shared/Badge';
import MenuIcon from '../Menu';
import { useNavigate } from 'react-router-dom';
import down from '../../assets/down.svg';

const styles = () => ({
  rightSection: { pointerEvents: 'none' },
  wrapper: {
    width: '62%',
  },
});

const COLUMNS = [
  {
    Header: '#',
    accessor: 'id',
  },
  {
    Header: 'CAMPAIGN NAME',
    accessor: 'space_name',
    Cell: tableProps => {
      const { status, photo, space_name } = tableProps.row.original;
      const color =
        status === 'Available' ? 'green' : status === 'Unavailable' ? 'orange' : 'primary';
      return (
        <div className="flex items-center">
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
          styles={styles}
          rightSection={<img src={down} alt="down" height="12px" />}
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
                <div onClick={() => navigate(`/inventory/view-details/${id}`)} className="bg-white">
                  View
                </div>
                <div className="bg-white">Edit</div>
                <div className="bg-white">Delete</div>
                <div className="bg-white">Set as Featured</div>
              </div>
            )}
          </div>
        </div>
      );
    },
  },
];

export default COLUMNS;

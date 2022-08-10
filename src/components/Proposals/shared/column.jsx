/* eslint-disable */
import { useState } from 'react';
import { NativeSelect } from '@mantine/core';
import { ChevronDown } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '../../Menu';

const styles = {
  rightSection: { pointerEvents: 'none' },
};

const COLUMNS = [
  {
    Header: '#',
    accessor: 'id',
  },
  {
    Header: 'SPACE NAME & PHOTO',
    accessor: 'space_name_and_photo',
    Cell: tableProps => {
      const { photo, space_name } = tableProps.row.original;

      return (
        <div className="flex items-center gap-2">
          <div className="bg-white border rounded-md">
            <img className="h-8 mx-auto" src={photo} alt="banner" />
          </div>
          <p className="flex-1">{space_name}</p>
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
          data={['1000', '2000', '5000', '10000']}
          styles={styles}
          rightSection={<ChevronDown size={16} className="mt-[1px] mr-1" />}
          rightSectionWidth={40}
        />
      );
    },
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
                  View Details
                </div>

                <div className="bg-white">Remove</div>
              </div>
            )}
          </div>
        </div>
      );
    },
  },
];

export default COLUMNS;

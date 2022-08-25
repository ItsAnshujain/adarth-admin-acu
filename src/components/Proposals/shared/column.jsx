/* eslint-disable */
import { useState } from 'react';
import { NativeSelect, Menu } from '@mantine/core';
import { ChevronDown } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '../../Menu';
import { Eye, Trash } from 'react-feather';

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
      const navigate = useNavigate();
      const { id } = tableProps.row.original;

      return (
        <Menu shadow="md" width={150}>
          <Menu.Target>
            <button>
              <MenuIcon />
            </button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item>
              <div
                onClick={() => navigate(`/inventory/view-details/${id}`)}
                className="cursor-pointer flex items-center gap-1"
              >
                <Eye className="h-4" />
                <span className="ml-1">View Details</span>
              </div>
            </Menu.Item>

            <Menu.Item>
              <div className="cursor-pointer flex items-center gap-1">
                <Trash className="h-4" />
                <span className="ml-1">Remove</span>
              </div>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      );
    },
  },
];

export default COLUMNS;

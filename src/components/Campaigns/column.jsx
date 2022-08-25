/* eslint-disable */
import { useState } from 'react';
import { NativeSelect, Menu } from '@mantine/core';
import MenuIcon from '../Menu';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'react-feather';
import { Trash, Edit2, Eye, Bookmark } from 'react-feather';
import classNames from 'classnames';

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
    Cell: tableProps => {
      const {
        row: {
          original: { type },
        },
      } = tableProps;
      console.log(type);
      return (
        <div
          className={classNames(`w-fit ${type === 'Featured' ? 'text-purple-450' : 'text-black'}`)}
        >
          {type}
        </div>
      );
    },
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
    disableSortBy: true,
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
                onClick={() => navigate(`view-details/${id}`)}
                className="cursor-pointer flex items-center gap-1"
              >
                <Eye className="h-4" />
                <span className="ml-1">View Details</span>
              </div>
            </Menu.Item>
            <Menu.Item>
              <div
                onClick={() => navigate(`edit-details/${id}`)}
                className="cursor-pointer flex items-center gap-1"
              >
                <Edit2 className="h-4" />
                <span className="ml-1">Edit</span>
              </div>
            </Menu.Item>
            <Menu.Item>
              <div className="cursor-pointer flex items-center gap-1">
                <Trash className="h-4" />
                <span className="ml-1">Delete</span>
              </div>
            </Menu.Item>
            <Menu.Item>
              <div className="bg-white cursor-pointer flex items-center ">
                <Bookmark className="h-4 mr-2" />
                <span>Set as Featured</span>
              </div>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      );
    },
  },
];

export default COLUMNS;

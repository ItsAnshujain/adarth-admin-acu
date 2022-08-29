/* eslint-disable */
import MenuIcon from '../Menu';
import { Edit2, Trash } from 'react-feather';
import { Menu } from '@mantine/core';
import Modal from './InputModal';
import { useState } from 'react';

const COLUMNS = [
  {
    Header: '#',
    accessor: 'id',
  },
  {
    Header: 'COMPANY NAME',
    accessor: 'company_name',
  },
  {
    Header: '',
    accessor: 'details',
    disableSortBy: true,
    Cell: tableProps => {
      const { id } = tableProps.row.original;
      const [opened, setOpened] = useState(false);

      return (
        <>
          <Menu shadow="md" width={150}>
            <Menu.Target>
              <button>
                <MenuIcon />
              </button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item>
                <div
                  onClick={() => setOpened(true)}
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
            </Menu.Dropdown>
          </Menu>
          <Modal opened={opened} setOpened={setOpened} />
        </>
      );
    },
  },
];

export default COLUMNS;

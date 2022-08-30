import { useState } from 'react';
import { Edit2, Trash } from 'react-feather';
import { Menu } from '@mantine/core';
import Modal from './InputModal';
import MenuIcon from '../Menu';

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
    Cell: () => {
      const [opened, setOpened] = useState(false);

      return (
        <>
          <Menu shadow="md" width={150}>
            <Menu.Target>
              <button type="button">
                <MenuIcon />
              </button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item>
                <button
                  type="button"
                  onClick={() => setOpened(true)}
                  className="cursor-pointer flex items-center gap-1"
                >
                  <Edit2 className="h-4" />
                  <span className="ml-1">Edit</span>
                </button>
              </Menu.Item>
              <Menu.Item>
                <button type="button" className="cursor-pointer flex items-center gap-1">
                  <Trash className="h-4" />
                  <span className="ml-1">Delete</span>
                </button>
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

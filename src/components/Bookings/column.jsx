import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Eye, Edit2, Trash } from 'react-feather';
import { NativeSelect, Menu, Progress } from '@mantine/core';
import MenuIcon from '../Menu';

const COLUMNS = [
  {
    Header: '#',
    accessor: 'id',
  },
  {
    Header: 'CLIENT',
    accessor: 'client',
  },
  {
    Header: 'ORDER DATE',
    accessor: 'order_date',
  },

  {
    Header: 'CAMPAIGN NAME',
    accessor: 'campaign_name',
    Cell: tableProps => {
      const navigate = useNavigate();
      const {
        row: {
          original: { photo, campaign_name, id },
        },
      } = tableProps;

      return (
        <div
          aria-hidden
          type="button"
          onClick={() => navigate(`view-details/${id}`)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="bg-white border rounded-md">
            <img className="h-6 w-6 mx-auto" src={photo} alt="banner" />
          </div>
          <p className="flex-1">{campaign_name}</p>
        </div>
      );
    },
  },
  {
    Header: 'BOOKING TYPE',
    accessor: 'booking_type',
  },
  {
    Header: 'CAMPAIGN STATUS',
    accessor: 'campaign_status',
    Cell: tableProps => {
      const {
        row: {
          original: { campaign_status },
        },
      } = tableProps;

      const [value, setValue] = useState(campaign_status);

      return (
        <NativeSelect
          className="mr-2"
          value={value}
          onChange={e => setValue(e.target.value)}
          data={['Completed', 'Upcoming', 'Ongoing']}
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
    Header: 'PAYMENT STATUS',
    accessor: 'payment_status',
    Cell: tableProps => {
      const {
        row: {
          original: { payment_status },
        },
      } = tableProps;

      const [value, setValue] = useState(payment_status);

      return (
        <NativeSelect
          value={value}
          onChange={e => setValue(e.target.value)}
          data={['Paid', 'Due']}
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
    Header: 'PRINTING STATUS',
    accessor: 'printing_status',
    Cell: tableProps => {
      const {
        row: {
          original: { printing_status },
        },
      } = tableProps;

      const [value, setValue] = useState(printing_status);

      return (
        <NativeSelect
          className="mr-2"
          value={value}
          onChange={e => setValue(e.target.value)}
          data={['Completed', 'Pending']}
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
    Header: 'MOUNTING STATUS',
    accessor: 'mounting_status',
    Cell: tableProps => {
      const {
        row: {
          original: { mounting_status },
        },
      } = tableProps;

      const [value, setValue] = useState(mounting_status);

      return (
        <NativeSelect
          className="mr-2"
          value={value}
          onChange={e => setValue(e.target.value)}
          data={['Completed', 'Pending']}
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
    Header: 'CAMPAIGN INCHARGE',
    accessor: 'campaign_incharge',
  },
  {
    Header: 'HEALTH STATUS',
    accessor: 'health_status',
    Cell: tableProps => {
      const {
        row: {
          original: { total_spaces },
        },
      } = tableProps;
      return (
        <div className="w-24">
          <Progress
            sections={[
              { value: total_spaces, color: 'green' },
              { value: 100 - total_spaces, color: 'red' },
            ]}
          />
        </div>
      );
    },
  },

  {
    Header: 'PAYMENT TYPE',
    accessor: 'payment_type',
  },
  {
    Header: 'SCHEDULE',
    accessor: 'schedule',
    Cell: tableProps => {
      const {
        row: {
          original: { from_date, to_date },
        },
      } = tableProps;
      return (
        <div className="flex items-center text-xs w-max">
          <span className="py-1 px-1 bg-slate-200 mr-2 rounded-md">{from_date}</span>
          &gt;
          <span className="py-1 px-1 bg-slate-200 mx-2 rounded-md">{to_date}</span>
        </div>
      );
    },
  },
  {
    Header: 'UPLOADED MEDIA',
    accessor: 'uploaded_media',
    Cell: tableProps => {
      const {
        row: {
          original: { photo },
        },
      } = tableProps;

      return (
        <div className="bg-white border rounded-md">
          <img className="h-10 mx-auto" src={photo} alt="banner" />
        </div>
      );
    },
  },
  {
    Header: 'DOWNLOAD UPLOADED MEDIA',
    accessor: '',
    Cell: () => <div className="text-purple-450 cursor-pointer">Download</div>,
  },
  {
    Header: 'TOTAL SPACES',
    accessor: 'total_spaces',
  },
  {
    Header: 'PRICING',
    accessor: 'pricing',
  },
  {
    Header: 'PURCHASE ORDER',
    accessor: '',
    Cell: () => <div className="text-purple-450 cursor-pointer">Download</div>,
  },
  {
    Header: 'RELEASE ORDER',
    accessor: '',
    Cell: () => <div className="text-purple-450 cursor-pointer">Download</div>,
  },
  {
    Header: 'INVOICE',
    accessor: '',
    Cell: () => <div className="text-purple-450 cursor-pointer">Download</div>,
  },
  {
    Header: 'ACTION',
    accessor: 'details',
    disableSortBy: true,
    Cell: tableProps => {
      const navigate = useNavigate();
      const {
        row: {
          original: { id },
        },
      } = tableProps;

      return (
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
                onClick={() => navigate(`view-details/${id}`)}
                className="cursor-pointer flex items-center gap-1 w-full"
              >
                <Eye className="h-4" />
                <span className="ml-1">View Details</span>
              </button>
            </Menu.Item>
            <Menu.Item>
              <button
                type="button"
                onClick={() => navigate(`edit-details/${id}`)}
                className="cursor-pointer flex items-center gap-1 w-full"
              >
                <Edit2 className="h-4" />
                <span className="ml-1">Edit</span>
              </button>
            </Menu.Item>
            <Menu.Item>
              <div className="cursor-pointer flex items-center gap-1">
                <Trash className="h-4" />
                <span className="ml-1">Delete</span>
              </div>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      );
    },
  },
];

export default COLUMNS;

/* eslint-disable */
import { useNavigate } from 'react-router-dom';
import { Eye, Edit2, Trash, Share2, Mail, Link } from 'react-feather';
import { Menu } from '@mantine/core';
import MenuIcon from '../../Menu';
import toIndianCurrency from '../../../utils/currencyFormat';
import whatsapp from '../../../assets/whatsapp.svg';

const COLUMNS = [
  {
    Header: '#',
    accessor: 'id',
  },
  {
    Header: 'ORDER ID',
    accessor: 'order_id',
    Cell: () => <div>1</div>,
  },
  {
    Header: 'INVOICE ID',
    accessor: 'invoice_id',
    Cell: () => <div>1</div>,
  },

  {
    Header: 'BUYER ORDER NO',
    accessor: 'buyer_order_no',
    Cell: () => <div>1</div>,
  },
  {
    Header: 'TO',
    accessor: 'to',
    Cell: () => <div>Cyber Sikkim</div>,
  },
  {
    Header: 'BUYER',
    accessor: 'buyer',
    Cell: () => <div>Adarth</div>,
  },
  {
    Header: 'INVOICE DATE',
    accessor: 'invoice_date',
    Cell: () => <div>2 Sep,2022</div>,
  },
  {
    Header: 'SUPPLIER REF',
    accessor: 'supplier_ref',
    Cell: () => <div>Mohandad Gandhi</div>,
  },
  {
    Header: 'STATUS',
    accessor: 'status',
    Cell: () => <div className="text-green-400">Approved</div>,
  },
  {
    Header: 'DATE',
    accessor: 'date',
    Cell: () => <div>2 Sep,2022</div>,
  },
  {
    Header: 'TOTAL AMOUNT',
    accessor: 'total_amount',
    Cell: () => <div>{toIndianCurrency(648764)}</div>,
  },
  {
    Header: 'PAYMENT METHOD',
    accessor: 'payment_method',
    Cell: () => <div>Bank</div>,
  },

  {
    Header: 'Action',
    accessor: '',
    disableSortBy: true,
    Cell: tableProps => {
      const navigate = useNavigate();
      const {
        row: {
          original: { id },
        },
      } = tableProps;

      return (
        <div className="flex gap-2 items-center">
          <div>
            <Menu shadow="md" width={150}>
              <Menu.Target>
                <Share2 size="20" />
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item>
                  <button
                    type="button"
                    onClick={() => navigate(`view-details/${id}`)}
                    className="cursor-pointer flex items-center gap-1 w-full"
                  >
                    <img src={whatsapp} alt="whatsapp-icon" className="h-4" />
                    <span className="ml-1">View Details</span>
                  </button>
                </Menu.Item>
                <Menu.Item>
                  <button
                    type="button"
                    onClick={() => navigate(`edit-details/${id}`)}
                    className="cursor-pointer flex items-center gap-1 w-full"
                  >
                    <Mail className="h-4" />
                    <span className="ml-1">Send Email</span>
                  </button>
                </Menu.Item>
                <Menu.Item>
                  <div className="cursor-pointer flex items-center gap-1 border w-full rounded-md">
                    <Link className="h-4" />
                    <span className="ml-1">Copy Link</span>
                  </div>
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
          <div>
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
          </div>
        </div>
      );
    },
  },
];

export default COLUMNS;

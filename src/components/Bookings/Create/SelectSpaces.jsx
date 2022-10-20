import { useEffect, useMemo, useState } from 'react';
import { Button, NumberInput, Progress } from '@mantine/core';
import { ChevronDown } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import Filter from '../../Filter';
import Search from '../../Search';
import toIndianCurrency from '../../../utils/currencyFormat';
import Table from '../../Table/Table';
import useCreateBookingSelectSpaceState from '../../../store/createBookingSelectSpace.store';
import { useFetchInventory } from '../../../hooks/inventory.hooks';
import { serialize } from '../../../utils/index';
import Badge from '../../shared/Badge';
import MenuIcon from '../../Menu';
import upload from '../../../assets/upload.svg';
import { useFormContext } from '../../../context/formContext';

const SelectSpace = () => {
  const { setFieldValue } = useFormContext();

  const [search, setSearch] = useState('');
  const selectedSpace = useCreateBookingSelectSpaceState(state => state.selectedSpace);
  const [showFilter, setShowFilter] = useState(false);
  const [orderPrice, setOrderPrice] = useState(0);

  const [inventoryQuery] = useState({ page: 1, limit: 1 });
  const { data: inventoryData } = useFetchInventory(serialize(inventoryQuery));

  const [updatedInventoryData, setUpdatedInventoryData] = useState([]);

  useEffect(() => {
    if (inventoryData) {
      const finalData = [];
      for (const item of inventoryData.docs) {
        const obj = {};
        obj.photo = item.basicInformation.spacePhotos;
        obj._id = item._id;
        obj.space_name = item.basicInformation.spaceName;
        obj.space_type = item.basicInformation.spaceType;
        obj.dimension = item.specifications.resolutions;
        obj.dimension = item.specifications.resolutions;
        obj.impression = item.specifications.impressions.min;
        obj.health = item.specifications.health;
        obj.location = item.location.city;
        obj.media_type = item.basicInformation.mediaType;
        obj.pricing = item.basicInformation.price;
        obj.landlord_name = '';
        obj.status = 'Available';
        finalData.push(obj);
      }
      setUpdatedInventoryData(finalData);
    }
  }, [inventoryData]);

  useEffect(() => {
    const totalPrice = selectedSpace.reduce((acc, item) => acc + item.values.pricing, 0);
    setOrderPrice(totalPrice);
    const formData = selectedSpace.map(item => ({
      id: item.original._id,
      price: item.original.pricing,
    }));
    setFieldValue('spaces', [...formData]);
  }, [selectedSpace]);

  const updatePrice = (price, id) => {
    const copySpaces = [...updatedInventoryData];
    for (const item of copySpaces) {
      if (item._id === id) {
        item.pricing = price;
      }
    }
    setUpdatedInventoryData([...copySpaces]);
  };

  const COLUMNS = useMemo(
    () => [
      {
        Header: '#',
        accessor: '_id',
        Cell: ({ row: { index } }) => index + 1,
      },
      {
        Header: 'SPACE NAME & PHOTO',
        accessor: 'space_name_and_photo',
        Cell: tableProps => {
          const navigate = useNavigate();

          const {
            row: {
              original: { status, photo, space_name, _id: id },
            },
          } = tableProps;

          const color =
            status === 'Available' ? 'green' : status === 'Unavailable' ? 'orange' : 'primary';

          return useMemo(
            () => (
              <div
                aria-hidden
                onClick={() => navigate(`view-details/${id}`)}
                className="grid grid-cols-2 gap-2 items-center cursor-pointer"
              >
                <div className="flex flex-1 gap-2 items-center w-44">
                  <div className="bg-white h-8 w-8 border rounded-md">
                    <img className="h-8 w-8 mx-auto" src={photo} alt="banner" />
                  </div>
                  <p>{space_name}</p>
                </div>
                <div className="w-fit">
                  <Badge radius="xl" text={status} color={color} variant="filled" size="sm" />
                </div>
              </div>
            ),
            [],
          );
        },
      },
      {
        Header: 'LANDLORD NAME',
        accessor: 'landlord_name',
        Cell: tableProps => {
          const {
            row: {
              original: { landlord_name },
            },
          } = tableProps;
          return useMemo(() => <div className="w-fit">{landlord_name}</div>, []);
        },
      },
      {
        Header: 'UPLOAD MEDIA',
        accessor: '',
        Cell: tableProps => {
          const {
            row: {
              original: { _id: id },
            },
          } = tableProps;

          return useMemo(
            () =>
              selectedSpace.length > 0 ? (
                selectedSpace.map(selected => {
                  if (selected.original._id === id) {
                    return (
                      <button
                        type="button"
                        className="py-1 px-2 h-[70%] flex items-center gap-2 bg-purple-350 text-white rounded-md cursor-pointer"
                      >
                        <span>Upload</span>
                        <img src={upload} alt="Upload" />
                      </button>
                    );
                  }
                  return null;
                })
              ) : (
                <button
                  type="button"
                  className="py-1 px-2 h-[70%] flex items-center gap-2 bg-purple-200 text-white rounded-md cursor-not-allowed "
                >
                  <span>Upload</span>
                  <img src={upload} alt="Upload" />
                </button>
              ),
            [],
          );
        },
      },
      {
        Header: 'SPACE TYPE',
        accessor: 'space_type',
      },
      {
        Header: 'DIMENSION',
        accessor: 'dimension',
        Cell: tableProps => {
          const {
            cell: { value },
          } = tableProps;
          return useMemo(() => <p>{`${value.height}ft x ${value.width}ft`}</p>, []);
        },
      },
      {
        Header: 'IMPRESSION',
        accessor: 'impression',
      },
      {
        Header: 'HEALTH',
        accessor: 'health',
        Cell: ({ row: { original } }) =>
          useMemo(
            () => (
              <div className="w-24">
                <Progress
                  sections={[
                    { value: original.health, color: 'green' },
                    { value: 100 - original.health, color: 'red' },
                  ]}
                />
              </div>
            ),
            [],
          ),
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
              original: { pricing, _id },
            },
          } = tableProps;

          return useMemo(
            () => (
              <NumberInput
                hideControls
                defaultValue={pricing}
                onChange={e => updatePrice(e, _id)}
              />
            ),
            [],
          );
        },
      },
      {
        Header: 'ACTION',
        accessor: 'details',
        Cell: tableProps => {
          const [showMenu, setShowMenu] = useState(false);
          const {
            row: {
              // eslint-disable-next-line no-unused-vars
              original: { id },
            },
          } = tableProps;
          return useMemo(
            () => (
              <div aria-hidden onClick={() => setShowMenu(!showMenu)}>
                <div className="relative">
                  <MenuIcon />
                  {/* {showMenu && (
                <div className="absolute w-36 shadow-lg text-sm gap-2 flex flex-col border z-10  items-start right-4 top-0 bg-white py-4 px-2">
                  <div onClick={() => navigate(`/inventory/view-details/${id}`)} className="bg-white">
                    View Details
                  </div>
                  <div className="bg-white">Edit</div>
                  <div className="bg-white">Delete</div>
                </div>
              )} */}
                </div>
              </div>
            ),
            [],
          );
        },
      },
    ],
    [updatedInventoryData],
  );

  return (
    <>
      <div className="flex gap-2 pt-4 flex-col pl-5 pr-7">
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold">Select Place for Order</p>
          <div>
            <Button onClick={() => setShowFilter(!showFilter)} variant="default" type="button">
              <ChevronDown size={16} className="mt-[1px] mr-1" /> Filter
            </Button>
            {showFilter && <Filter isOpened={showFilter} setShowFilter={setShowFilter} />}
          </div>
        </div>
        <div className="flex gap-4">
          <div>
            <p className="text-slate-400">Selected Places</p>
            <p className="font-bold">{selectedSpace.length}</p>
          </div>
          <div>
            <p className="text-slate-400">Total Price</p>
            <p className="font-bold">{toIndianCurrency(orderPrice)}</p>
          </div>
        </div>
        <div className="flex justify-between mb-4 items-center">
          <p className="text-purple-450 text-sm">
            Total Places{' '}
            <span className="bg-purple-450 text-white py-1 px-2 rounded-full ml-2">
              {updatedInventoryData.length}
            </span>
          </p>

          <Search search={search} setSearch={setSearch} />
        </div>
      </div>
      <Table dummy={updatedInventoryData} COLUMNS={COLUMNS} allowRowsSelect isBookingTable />
    </>
  );
};

export default SelectSpace;

import { useEffect, useMemo, useState } from 'react';
import { Button, Image, Progress } from '@mantine/core';
import { ChevronDown, Edit2, Eye, Trash } from 'react-feather';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useClickOutside, useDebouncedState } from '@mantine/hooks';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { DatePicker } from '@mantine/dates';
import Filter from '../../Filter';
import Search from '../../Search';
import toIndianCurrency from '../../../utils/currencyFormat';
import Table from '../../Table/Table';
import { useDeleteInventoryById, useFetchInventory } from '../../../hooks/inventory.hooks';
import Badge from '../../shared/Badge';
import MenuIcon from '../../Menu';
import upload from '../../../assets/upload.svg';
import { useFormContext } from '../../../context/formContext';

const getHealthTag = score => {
  if (score <= 30) return 'Bad';

  if (score <= 50) return 'Good';

  return 'Best';
};

const SelectSpace = () => {
  const { setFieldValue, values } = useFormContext();

  const [search, setSearch] = useDebouncedState('', 500);
  const [showFilter, setShowFilter] = useState(false);
  const [orderPrice, setOrderPrice] = useState(0);
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams({
    page: 1,
    limit: 10,
    sortBy: 'name',
    sortOrder: 'desc',
  });
  const { data: inventoryData, isLoading, isFetching } = useFetchInventory(searchParams.toString());
  const { mutate } = useDeleteInventoryById();
  const queryClient = useQueryClient();

  const onDelete = id => {
    mutate(
      {
        inventoryId: id,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(['inventory']);
        },
      },
    );
  };

  const [updatedInventoryData, setUpdatedInventoryData] = useState([]);

  const setSelectedSpace = selectedSpace => {
    const totalPrice = selectedSpace.reduce((acc, item) => acc + +(item.values.pricing || 0), 0);
    setOrderPrice(totalPrice);

    const avgHealth =
      selectedSpace.reduce((acc, item) => acc + item.values.health, 0) / selectedSpace.length;

    const formData = selectedSpace.map(
      ({
        original: {
          _id,
          space_name,
          photo,
          pricing,
          location,
          media_type,
          dimension,
          illuminations,
          unit,
          resolutions,
          supportedMedia,
          startDate,
          endDate,
        },
      }) => ({
        id: _id,
        space_name,
        photo,
        price: +pricing || 0,
        location,
        media_type,
        dimension,
        illuminations,
        unit,
        resolutions,
        supportedMedia,
        startDate,
        endDate,
      }),
    );

    setFieldValue('place', formData);
    setFieldValue('healthTag', getHealthTag(avgHealth));
  };

  const updateDate = (key, val, id) => {
    setUpdatedInventoryData(prev =>
      prev.map(item => (item._id === id ? { ...item, [key]: val } : item)),
    );
  };

  const toggleFilter = () => setShowFilter(!showFilter);

  const COLUMNS = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id',
        disableSortBy: true,
        Cell: ({ row: { index } }) => index + 1,
      },
      {
        Header: 'SPACE NAME & PHOTO',
        accessor: 'space_name_and_photo',
        Cell: tableProps => {
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
                onClick={() => navigate(`/campaigns/view-details/${id}`)}
                className="grid grid-cols-2 gap-2 items-center cursor-pointer"
              >
                <div className="flex flex-1 gap-2 items-center w-44">
                  <Image
                    height={30}
                    width={30}
                    withPlaceholder
                    className="rounded-md"
                    src={photo}
                  />
                  <p
                    title={space_name}
                    className="w-[150px] text-ellipsis overflow-hidden whitespace-nowrap"
                  >
                    {space_name}
                  </p>
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
              values?.place?.length > 0 ? (
                values.place.map(selected => {
                  if (selected?.original?._id === id) {
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
          return useMemo(() => <p>{`${value?.height || 0}ft x ${value?.width || 0}ft`}</p>, []);
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
        Cell: ({
          row: {
            original: { location },
          },
        }) => location.city,
      },
      {
        Header: 'MEDIA TYPE',
        accessor: 'media_type',
      },
      {
        Header: 'PRICING',
        accessor: 'pricing',
        Cell: ({
          row: {
            original: { pricing },
          },
        }) => pricing,
      },
      {
        Header: 'START DATE',
        accessor: 'startDate',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { startDate, _id },
          },
        }) =>
          useMemo(
            () => (
              <DatePicker
                defaultValue={startDate}
                placeholder="DD/MM/YYYY"
                minDate={new Date()}
                onChange={val => updateDate('startDate', val, _id)}
              />
            ),
            [],
          ),
      },
      {
        Header: 'END DATE',
        accessor: 'endDate',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { endDate, _id },
          },
        }) =>
          useMemo(
            () => (
              <DatePicker
                defaultValue={endDate}
                placeholder="DD/MM/YYYY"
                minDate={new Date()}
                onChange={val => updateDate('endDate', val, _id)}
              />
            ),
            [],
          ),
      },
      {
        Header: 'ACTION',
        accessor: 'action',
        disableSortBy: true,
        Cell: tableProps => {
          const [showMenu, setShowMenu] = useState(false);
          const ref = useClickOutside(() => setShowMenu(false));

          const {
            row: {
              original: { _id: id },
            },
          } = tableProps;
          return useMemo(
            () => (
              <div aria-hidden ref={ref} onClick={() => setShowMenu(!showMenu)}>
                <div className="relative">
                  <MenuIcon />
                  {showMenu && (
                    <div className="absolute w-36 shadow-lg text-sm gap-2 flex flex-col border z-10  items-start right-4 top-0 bg-white py-4 px-2">
                      <div
                        onClick={() => navigate(`/inventory/view-details/${id}`)}
                        className="bg-white cursor-pointer flex items-center"
                        aria-hidden
                      >
                        <Eye className="h-4 mr-2" />
                        <span>View Details</span>
                      </div>
                      <div
                        onClick={() => navigate(`/inventory/edit-details/${id}`)}
                        className="bg-white cursor-pointer flex items-center"
                        aria-hidden
                      >
                        <Edit2 className="h-4 mr-2" />
                        <span>Edit</span>
                      </div>
                      <div
                        className="bg-white cursor-pointer flex items-center"
                        onClick={() => {
                          if (!isLoading) onDelete(id);
                        }}
                        aria-hidden
                      >
                        <Trash className="h-4 mr-2" />
                        <span>Delete</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ),
            [showMenu],
          );
        },
      },
    ],
    [updatedInventoryData],
  );

  const handleSortByColumn = colId => {
    if (searchParams.get('sortBy') === colId && searchParams.get('sortOrder') === 'desc') {
      searchParams.set('sortOrder', 'asc');
      setSearchParams(searchParams);
      return;
    }
    if (searchParams.get('sortBy') === colId && searchParams.get('sortOrder') === 'asc') {
      searchParams.set('sortOrder', 'desc');
      setSearchParams(searchParams);
      return;
    }

    searchParams.set('sortBy', colId);
    setSearchParams(searchParams);
  };

  useEffect(() => {
    if (search) searchParams.set('search', search);
    else searchParams.delete('search');

    setSearchParams(searchParams);
  }, [search]);

  useEffect(() => {
    if (inventoryData) {
      const finalData = [];
      for (const item of inventoryData.docs) {
        const obj = {};
        obj.photo = item.basicInformation.spacePhotos;
        obj._id = item._id;
        obj.space_name = item.basicInformation.spaceName;
        obj.space_type = item.basicInformation.spaceType?.name;
        obj.dimension = item.specifications.size;
        obj.impression = item.specifications.impressions?.min || 0;
        obj.health = item.specifications.health;
        obj.location = item.location;
        obj.media_type = item.basicInformation.mediaType?.name;
        obj.supportedMedia = item.basicInformation.supportedMedia;
        obj.pricing = item.basicInformation.price;
        obj.landlord_name = '';
        obj.status = 'Available';
        obj.illuminations = item.specifications.illuminations?.name;
        obj.unit = item.specifications.unit;
        obj.resolutions = item.specifications.resolutions;
        obj.startDate = item.startDate ? new Date(item.startDate) : new Date();
        obj.endDate = item.endDate ? new Date(item.endDate) : dayjs().add(1, 'day').toDate();
        finalData.push(obj);
      }
      setUpdatedInventoryData(finalData);
    }
  }, [inventoryData]);

  return (
    <>
      <div className="flex gap-2 pt-4 flex-col pl-5 pr-7">
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold">Select Place for Order</p>
          <div>
            <Button onClick={toggleFilter} variant="default">
              <ChevronDown size={16} className="mt-[1px] mr-1" /> Filter
            </Button>
            {showFilter && <Filter isOpened={showFilter} setShowFilter={setShowFilter} />}
          </div>
        </div>
        <div className="flex gap-4">
          <div>
            <p className="text-slate-400">Selected Places</p>
            <p className="font-bold">{values?.place?.length}</p>
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
      <Table
        data={updatedInventoryData}
        COLUMNS={COLUMNS}
        allowRowsSelect
        setSelectedFlatRows={setSelectedSpace}
        selectedRowData={values?.place?.map(item => ({ _id: item.id }))}
        isLoading={isLoading || isFetching}
        handleSorting={handleSortByColumn}
      />
    </>
  );
};

export default SelectSpace;

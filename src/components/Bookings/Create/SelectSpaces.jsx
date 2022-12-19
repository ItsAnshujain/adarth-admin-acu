import { useEffect, useMemo, useState } from 'react';
import { Button, Image, NumberInput, Progress, Badge, Loader } from '@mantine/core';
import { ChevronDown, Edit2, Eye, Trash } from 'react-feather';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DatePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import { useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames';
import { Dropzone } from '@mantine/dropzone';
import { useDebouncedState } from '@mantine/hooks';
import Search from '../../Search';
import toIndianCurrency from '../../../utils/currencyFormat';
import Table from '../../Table/Table';
import { useDeleteInventoryById, useFetchInventory } from '../../../hooks/inventory.hooks';
import MenuIcon from '../../Menu';
import upload from '../../../assets/upload.svg';
import { useFormContext } from '../../../context/formContext';
import { colors } from '../../../utils';
import { useUploadFile } from '../../../hooks/upload.hooks';
import Filter from '../../Inventory/Filter';

const styles = {
  padding: 0,
  border: 'none',
};

const UploadButton = ({ updateDateAndMedia, isActive, id }) => {
  const { mutateAsync: uploadMedia, isLoading } = useUploadFile();

  const handleUpload = async params => {
    const formData = new FormData();
    formData.append('files', params?.[0]);
    const res = await uploadMedia(formData);

    if (res?.[0].Location) {
      updateDateAndMedia('media', res[0].Location, id);
    }
  };

  return (
    <Dropzone
      style={styles}
      onDrop={handleUpload}
      multiple={false}
      disabled={!isActive || isLoading}
    >
      <Button
        disabled={isLoading}
        loading={isLoading}
        className={classNames(
          isActive ? 'bg-purple-350 cursor-pointer' : 'bg-purple-200 cursor-not-allowed',
          'py-1 px-2 h-[70%] flex items-center gap-2 text-white rounded-md',
        )}
      >
        Upload
        <img src={upload} alt="Upload" className="ml-2" />
      </Button>
    </Dropzone>
  );
};

const SelectSpace = () => {
  const { setFieldValue, values } = useFormContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchInput, setSearchInput] = useDebouncedState('', 1000);
  const [showFilter, setShowFilter] = useState(false);
  const [orderPrice, setOrderPrice] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams({
    'limit': 10,
    'page': 1,
    'sortOrder': 'desc',
    'sortBy': 'basicInformation.spaceName',
  });
  const { data: inventoryData, isLoading } = useFetchInventory(searchParams.toString());
  const { mutate } = useDeleteInventoryById();

  const [updatedInventoryData, setUpdatedInventoryData] = useState([]);

  const onDelete = id => {
    mutate(
      { inventoryId: id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(['inventory']);
        },
      },
    );
  };

  useEffect(() => {
    if (inventoryData) {
      const finalData = [];

      for (const item of inventoryData.docs) {
        const obj = {};
        obj.photo = item.basicInformation.spacePhoto;
        obj._id = item._id;
        obj.spaceName = item.basicInformation?.spaceName;
        obj.isUnderMaintenance = item?.isUnderMaintenance;
        obj.spaceType = item.basicInformation?.spaceType?.name;
        obj.dimension = `${item.specifications?.size?.height || 0}ft x ${
          item.specifications?.size?.width || 0
        }ft`;
        obj.impression = item.specifications?.impressions?.min || 0;
        obj.health = item?.specifications?.health;
        obj.location = item?.location?.city;
        obj.mediaType = item.basicInformation?.mediaType?.name;
        obj.pricing = item.basicInformation?.price || 0;
        obj.landlord = item.basicInformation?.mediaOwner?.name;
        obj.startDate = item.startDate ? new Date(item.startDate) : new Date();
        obj.endDate = item.endDate ? new Date(item.endDate) : dayjs().add(1, 'day').toDate();
        finalData.push(obj);
      }
      setUpdatedInventoryData(finalData);
    }
  }, [inventoryData]);

  const updateDateAndMedia = (key, val, id) => {
    setUpdatedInventoryData(prev =>
      prev.map(item => (item._id === id ? { ...item, [key]: val } : item)),
    );
  };

  const setSelectedFlatRows = selectedSpace => {
    const totalPrice = selectedSpace.reduce((acc, item) => acc + +(item.original.pricing || 0), 0);
    setOrderPrice(totalPrice);
    const formData = selectedSpace.map(item => ({
      id: item.original._id,
      price: +item.original.pricing || 0,
      startDate: item.original.startDate,
      endDate: item.original.endDate,
      media: item.original.media,
    }));
    setFieldValue('place', formData);
  };

  const updatePrice = (price, id) => {
    setUpdatedInventoryData(prev =>
      prev.map(item => (item._id === id ? { ...item, pricing: +price } : item)),
    );
  };

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
        accessor: 'spaceName',
        Cell: ({
          row: {
            original: { photo, spaceName, isUnderMaintenance, _id },
          },
        }) =>
          useMemo(
            () => (
              <div
                aria-hidden
                onClick={() => navigate(`/bookings/view-details/${_id}`)}
                className="grid grid-cols-2 gap-2 items-center cursor-pointer"
              >
                <div className="flex flex-1 gap-2 items-center w-44">
                  <Image
                    withPlaceholder
                    height={30}
                    width={30}
                    fit="cover"
                    className="rounded overflow-hidden"
                    src={photo}
                    alt={spaceName}
                  />
                  <span
                    title={spaceName}
                    className="w-[150px] text-ellipsis overflow-hidden whitespace-nowrap"
                  >
                    {spaceName}
                  </span>
                </div>
                <div className="w-fit">
                  <Badge
                    className="capitalize"
                    variant="filled"
                    color={isUnderMaintenance ? 'yellow' : 'green'}
                  >
                    {isUnderMaintenance ? 'Under Maintenance' : 'Available'}
                  </Badge>
                </div>
              </div>
            ),
            [isUnderMaintenance],
          ),
      },
      {
        Header: 'MEDIA OWNER NAME',
        accessor: 'landlord',
        Cell: ({
          row: {
            original: { landlord },
          },
        }) => useMemo(() => <p className="w-fit">{landlord || 'NA'}</p>, []),
      },
      {
        Header: 'UPLOAD MEDIA',
        accessor: '',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { _id },
          },
          selectedFlatRows,
        }) =>
          useMemo(
            () => (
              <UploadButton
                updateDateAndMedia={updateDateAndMedia}
                isActive={selectedFlatRows?.find(item => item.original._id === _id)}
                id={_id}
              />
            ),
            [selectedFlatRows],
          ),
      },
      {
        Header: 'SPACE TYPE',
        accessor: 'spaceType',
        Cell: ({
          row: {
            original: { spaceType },
          },
        }) =>
          useMemo(() => {
            const colorType = Object.keys(colors).find(key => colors[key] === spaceType);

            return (
              <Badge color={colorType} size="lg" className="capitalize">
                {spaceType || <span>-</span>}
              </Badge>
            );
          }),
      },
      {
        Header: 'DIMENSION',
        accessor: 'specifications.size.min',
        Cell: ({
          row: {
            original: { dimension },
          },
        }) => useMemo(() => <p>{dimension}</p>, []),
      },
      {
        Header: 'IMPRESSION',
        accessor: 'specifications.impressions.min',
        Cell: ({
          row: {
            original: { impression },
          },
        }) => useMemo(() => <p>{`${impression || 0}+`}</p>, []),
      },
      {
        Header: 'HEALTH',
        accessor: 'specifications.health',
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
        accessor: 'location.city',
        Cell: ({
          row: {
            original: { location },
          },
        }) => useMemo(() => <p>{location?.city}</p>, []),
      },
      {
        Header: 'MEDIA TYPE',
        accessor: 'mediaType',
      },
      {
        Header: 'PRICING',
        accessor: 'basicInformation.price',
        Cell: ({
          row: {
            original: { pricing, _id },
          },
        }) =>
          useMemo(
            () => (
              <NumberInput
                hideControls
                defaultValue={+(pricing || 0)}
                onBlur={e => updatePrice(e.target.value, _id)}
              />
            ),
            [],
          ),
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
                onChange={val => updateDateAndMedia('startDate', val, _id)}
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
                onChange={val => updateDateAndMedia('endDate', val, _id)}
              />
            ),
            [],
          ),
      },
      {
        Header: 'ACTION',
        accessor: 'action',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { id },
          },
        }) => {
          const [showMenu, setShowMenu] = useState(false);

          return useMemo(
            () => (
              <div aria-hidden onClick={() => setShowMenu(!showMenu)}>
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
            [],
          );
        },
      },
    ],
    [updatedInventoryData],
  );

  const toggleFilter = () => setShowFilter(!showFilter);

  const handleSearch = () => {
    searchParams.set('search', searchInput);
    setSearchParams(searchParams);
  };

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

  const handlePagination = currentPage => {
    searchParams.set('page', currentPage);
    setSearchParams(searchParams);
  };

  useEffect(() => {
    handleSearch();
    if (searchInput === '') {
      searchParams.delete('search');
      setSearchParams(searchParams);
    }
  }, [searchInput]);

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
            <p className="font-bold">{values?.place?.length || 0}</p>
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
              {updatedInventoryData?.length}
            </span>
          </p>
          <Search search={searchInput} setSearch={setSearchInput} />
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-[400px]">
          <Loader />
        </div>
      ) : null}
      {inventoryData?.docs?.length === 0 && !isLoading ? (
        <div className="w-full min-h-[400px] flex justify-center items-center">
          <p className="text-xl">No records found</p>
        </div>
      ) : null}
      {inventoryData?.docs?.length ? (
        <Table
          data={updatedInventoryData}
          COLUMNS={COLUMNS}
          allowRowsSelect
          isBookingTable
          setSelectedFlatRows={setSelectedFlatRows}
          selectedRowData={values?.place?.map(item => ({
            _id: item.id,
          }))}
          activePage={inventoryData?.page || 1}
          totalPages={inventoryData?.totalPages || 1}
          setActivePage={handlePagination}
          handleSorting={handleSortByColumn}
        />
      ) : null}
    </>
  );
};

export default SelectSpace;

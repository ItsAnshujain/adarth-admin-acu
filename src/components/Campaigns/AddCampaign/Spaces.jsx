import { useEffect, useMemo, useState } from 'react';
import { Button, Chip, Image, Loader, Progress } from '@mantine/core';
import { ChevronDown, Edit2, Eye, Trash } from 'react-feather';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useClickOutside, useDebouncedState } from '@mantine/hooks';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { DatePicker } from '@mantine/dates';
import { Dropzone } from '@mantine/dropzone';
import classNames from 'classnames';
import Filter from '../../Filter';
import Search from '../../Search';
import toIndianCurrency from '../../../utils/currencyFormat';
import Table from '../../Table/Table';
import { useDeleteInventoryById, useFetchInventory } from '../../../hooks/inventory.hooks';
import Badge from '../../shared/Badge';
import MenuIcon from '../../Menu';
import upload from '../../../assets/upload.svg';
import { useFormContext } from '../../../context/formContext';
import { useUploadFile } from '../../../hooks/upload.hooks';

const styles = {
  padding: 0,
  border: 'none',
};

const UploadButton = ({ updateData, isActive, id, hasMedia = false }) => {
  const { mutateAsync: uploadMedia, isLoading } = useUploadFile();

  const handleUpload = async params => {
    const formData = new FormData();
    formData.append('files', params?.[0]);
    const res = await uploadMedia(formData);

    if (res?.[0].Location) {
      updateData('media', res[0].Location, id);
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
        {hasMedia ? (
          <>
            <Chip
              classNames={{ checkIcon: 'text-white', label: 'bg-transparent' }}
              checked
              variant="filled"
              color="green"
              radius="lg"
              size="xs"
            />
            Uploaded
          </>
        ) : (
          'Upload'
        )}
        <img src={upload} alt="Upload" className="ml-2" />
      </Button>
    </Dropzone>
  );
};

const getHealthTag = score => {
  if (score <= 30) return 'Bad';

  if (score <= 50) return 'Good';

  return 'Best';
};

const getDate = (selectionItem, item, key, addDefault = true) => {
  if (selectionItem && selectionItem[key]) return new Date(selectionItem[key]);

  if (item && item[key]) return new Date(item.startDate);

  return addDefault ? new Date() : undefined;
};

const SelectSpace = () => {
  const { setFieldValue, values } = useFormContext();

  const [search, setSearch] = useDebouncedState('', 500);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  const [searchParams, setSearchParams] = useSearchParams({
    page: 1,
    limit: 10,
    sortBy: 'name',
    sortOrder: 'desc',
  });
  const { data: inventoryData, isLoading } = useFetchInventory(searchParams.toString());
  const { mutate } = useDeleteInventoryById();
  const queryClient = useQueryClient();
  const pages = searchParams.get('page');
  const limit = searchParams.get('limit');

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

  const getTotalPrice = (places = []) => {
    const totalPrice = places.reduce((acc, item) => acc + +(item.price || 0), 0);
    return totalPrice;
  };

  const [updatedInventoryData, setUpdatedInventoryData] = useState([]);

  const updateData = (key, val, id) => {
    setUpdatedInventoryData(prev =>
      prev.map(item => (item._id === id ? { ...item, [key]: val } : item)),
    );

    setFieldValue(
      'place',
      values.place.map(item => (item._id === id ? { ...item, [key]: val } : item)),
    );
  };

  const toggleFilter = () => setShowFilter(!showFilter);

  const COLUMNS = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id',
        disableSortBy: true,
        Cell: ({ row }) =>
          useMemo(() => {
            let currentPage = pages;
            let rowCount = 0;
            if (pages < 1) {
              currentPage = 1;
            }
            rowCount = (currentPage - 1) * limit;
            return <div className="pl-2">{rowCount + row.index + 1}</div>;
          }, []),
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
        Cell: ({
          row: {
            original: { _id },
          },
        }) =>
          useMemo(
            () => (
              <UploadButton
                updateData={updateData}
                isActive={values?.place?.find(item => item._id === _id)}
                hasMedia={values?.place?.find(item => (item._id === _id ? !!item?.media : false))}
                id={_id}
              />
            ),
            [],
          ),
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
        accessor: 'specifications.impressions.max',
        Cell: ({
          row: {
            original: { impression },
          },
        }) => useMemo(() => <p>{`${impression || 0}+`}</p>, []),
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
            original: { price },
          },
        }) => toIndianCurrency(Number.parseInt(price, 10) || 0),
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
                onChange={val => updateData('startDate', val, _id)}
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
                onChange={val => updateData('endDate', val, _id)}
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
    [updatedInventoryData, values.place],
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
  const handleSelection = selectedRows => {
    const avgHealth =
      selectedRows.reduce((acc, item) => acc + item.health, 0) / selectedRows.length;

    const formData = selectedRows.map(
      ({
        _id,
        space_name,
        photo,
        price,
        location,
        media_type,
        dimension,
        illuminations,
        unit,
        resolutions,
        supportedMedia,
        startDate,
        endDate,
      }) => ({
        _id,
        space_name,
        photo,
        price: +price || 0,
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

    setFieldValue('healthTag', getHealthTag(avgHealth));
    setFieldValue('place', formData);
  };

  useEffect(() => {
    if (search) searchParams.set('search', search);
    else searchParams.delete('search');

    setSearchParams(searchParams);
  }, [search]);

  useEffect(() => {
    if (inventoryData) {
      const { docs, ...page } = inventoryData;
      const finalData = [];

      for (const item of docs) {
        const selectionItem = values?.place?.find(pl => pl._id === item._id);

        const obj = {};
        obj.photo = item.basicInformation.spacePhoto;
        obj._id = item._id;
        obj.space_name = item.basicInformation.spaceName;
        obj.space_type = item.basicInformation.spaceType?.name;
        obj.dimension = item.specifications.size;
        obj.impression = item.specifications.impressions?.max || 0;
        obj.health = item.specifications.health;
        obj.location = item.location;
        obj.media_type = item.basicInformation.mediaType?.name;
        obj.supportedMedia = item.basicInformation.supportedMedia;
        obj.price = item.basicInformation.price;
        obj.landlord_name = '';
        obj.status = 'Available';
        obj.illuminations = item.specifications.illuminations?.name;
        obj.unit = item.specifications.unit;
        obj.resolutions = item.specifications.resolutions;
        obj.startDate = getDate(selectionItem, item, 'startDate');
        obj.endDate =
          getDate(selectionItem, item, 'endDate', false) || dayjs().add(1, 'day').toDate();
        finalData.push(obj);
      }
      setUpdatedInventoryData(finalData);
      setPagination(page);
    }
  }, [inventoryData]);

  useEffect(() => {
    searchParams.set('page', pagination.page);
    setSearchParams(searchParams);
  }, [pagination]);

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
            <p className="font-bold">{toIndianCurrency(getTotalPrice(values?.place))}</p>
          </div>
        </div>
        <div className="flex justify-between mb-4 items-center">
          <p className="text-purple-450 text-sm">
            Total Places{' '}
            <span className="bg-purple-450 text-white py-1 px-2 rounded-full ml-2">
              {inventoryData?.totalDocs}
            </span>
          </p>

          <Search search={search} setSearch={setSearch} />
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
          setSelectedFlatRows={handleSelection}
          selectedRowData={values.place}
          handleSorting={handleSortByColumn}
          activePage={pagination.page}
          totalPages={pagination.totalPages}
          setActivePage={page => setPagination(p => ({ ...p, page }))}
        />
      ) : null}
    </>
  );
};

export default SelectSpace;

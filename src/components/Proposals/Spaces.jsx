import { useMemo, useState, useEffect } from 'react';
import { Text, Button, Progress, Image, NumberInput, Badge, Box, Loader } from '@mantine/core';
import { ChevronDown } from 'react-feather';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useClickOutside, useDebouncedState } from '@mantine/hooks';
import { useModals } from '@mantine/modals';

import DateRange from '../DateRange';
import Search from '../Search';
import calendar from '../../assets/data-table.svg';
import toIndianCurrency from '../../utils/currencyFormat';
import Table from '../Table/Table';
import MenuPopover from './MenuPopover';
import { useFetchInventory } from '../../hooks/inventory.hooks';
import { colors, serialize } from '../../utils';
import modalConfig from '../../utils/modalConfig';
import Filter from '../Inventory/Filter';

const Spaces = ({
  setSelectedRow = () => {},
  selectedRowData = [],
  noOfSelectedPlaces,
  setProposedPrice = () => {},
}) => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useDebouncedState('', 1000);
  const modals = useModals();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const ref = useClickOutside(() => setShowDatePicker(false));
  const [updatedSpaces, setUpdatedSpaces] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilter, setShowFilter] = useState(false);
  const [query] = useState({
    limit: 10,
    page: 1,
  });

  const { data: inventoryData, isLoading: isLoadingInventoryData } = useFetchInventory(
    serialize(query),
  );
  const page = searchParams.get('page');

  const toggleDatePicker = () => setShowDatePicker(!showDatePicker);
  const toggleFilter = () => setShowFilter(!showFilter);

  const toggleImagePreviewModal = imgSrc =>
    modals.openContextModal('basic', {
      title: 'Preview',
      innerProps: {
        modalBody: (
          <Box className=" flex justify-center" onClick={id => modals.closeModal(id)}>
            {imgSrc ? (
              <Image src={imgSrc} height={580} width={580} alt="preview" />
            ) : (
              <Image src={null} height={580} width={580} withPlaceholder />
            )}
          </Box>
        ),
      },
      ...modalConfig,
    });

  const COLUMNS = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id',
        Cell: ({ row }) =>
          useMemo(() => {
            let currentPage = page;
            let rowCount = 0;
            if (page < 1) {
              currentPage = 1;
            }
            rowCount = (currentPage - 1) * 10;
            return <div className="pl-2">{rowCount + row.index + 1}</div>;
          }, []),
      },
      {
        Header: 'SPACE NAME & PHOTO',
        accessor: 'spaceName',
        Cell: ({
          row: {
            original: { _id, basicInformation, isUnderMaintenance },
          },
        }) =>
          useMemo(
            () => (
              <div className="flex items-center gap-2">
                <Box
                  className="bg-white border rounded-md cursor-zoom-in"
                  onClick={() => toggleImagePreviewModal(basicInformation?.spacePhotos)}
                >
                  {basicInformation?.spacePhotos ? (
                    <Image src={basicInformation.spacePhotos} alt="banner" height={32} width={32} />
                  ) : (
                    <Image src={null} withPlaceholder height={32} width={32} />
                  )}
                </Box>
                <Button
                  className="text-black px-2 font-medium max-w-[180px]"
                  onClick={() =>
                    navigate(`/inventory/view-details/${_id}`, {
                      replace: true,
                    })
                  }
                >
                  <span className="overflow-hidden text-ellipsis">
                    {basicInformation?.spaceName}
                  </span>
                </Button>
                <Badge
                  className="capitalize"
                  variant="filled"
                  color={isUnderMaintenance ? 'yellow' : 'green'}
                >
                  {isUnderMaintenance ? 'Under Maintenance' : 'Available'}
                </Badge>
              </div>
            ),
            [],
          ),
      },
      {
        Header: 'MEDIA OWNER NAME',
        accessor: 'mediaOwner',
        Cell: ({
          row: {
            original: { basicInformation },
          },
        }) =>
          useMemo(() => <p className="w-fit">{basicInformation?.mediaOwner?.name || 'NA'}</p>, []),
      },
      {
        Header: 'PEER',
        accessor: 'peer',
        Cell: () => useMemo(() => <p>-</p>),
      },
      {
        Header: 'SPACE TYPE',
        accessor: 'space_type',
        Cell: ({
          row: {
            original: { basicInformation },
          },
        }) =>
          useMemo(() => {
            const type = basicInformation?.spaceType?.name;
            return (
              <Badge color={colors[type]} size="lg" className="capitalize">
                {type || <span>-</span>}
              </Badge>
            );
          }),
      },
      {
        Header: 'DIMENSION',
        accessor: 'dimension',
        Cell: ({
          row: {
            original: { specifications },
          },
        }) =>
          useMemo(
            () => (
              <p>{`${specifications?.size?.height || 0}ft x ${
                specifications?.size?.width || 0
              }ft`}</p>
            ),
            [],
          ),
      },
      {
        Header: 'IMPRESSION',
        accessor: 'impressions',
        Cell: ({
          row: {
            original: { specifications },
          },
        }) => useMemo(() => <p>{`${specifications?.impressions?.min}+`}</p>, []),
      },
      {
        Header: 'HEALTH STATUS',
        accessor: 'health',
        Cell: ({
          row: {
            original: { specifications },
          },
        }) =>
          useMemo(
            () => (
              <div className="w-24">
                <Progress
                  sections={[
                    { value: specifications?.health, color: 'green' },
                    { value: 100 - (specifications?.health || 0), color: 'red' },
                  ]}
                />
              </div>
            ),
            [],
          ),
      },
      {
        Header: 'LOCATION',
        accessor: 'city',
        Cell: ({
          row: {
            original: { location },
          },
        }) => useMemo(() => <p>{location?.city}</p>, []),
      },
      {
        Header: 'MEDIA TYPE',
        accessor: 'mediaType',
        Cell: ({
          row: {
            original: { basicInformation },
          },
        }) => useMemo(() => <p>{basicInformation?.mediaType?.name}</p>),
      },
      {
        Header: 'PRICING',
        accessor: 'price',
        Cell: ({
          row: {
            original: { _id, basicInformation },
          },
        }) =>
          useMemo(
            () => (
              <NumberInput
                defaultValue={basicInformation?.price}
                className="w-40"
                hideControls
                onChange={val => setProposedPrice(val, _id)}
              />
            ),
            [],
          ),
      },
      {
        Header: '',
        accessor: 'details',
        Cell: ({
          row: {
            original: { _id },
          },
        }) => useMemo(() => <MenuPopover itemId={_id} />, []),
      },
    ],
    [inventoryData?.docs],
  );

  const handleSearch = () => {
    searchParams.set('spaceName', searchInput);
    setSearchParams(searchParams);
  };

  const calcutateTotalPrice = useMemo(() => {
    const initialCost = 0;
    if (selectedRowData.length > 0) {
      return selectedRowData
        .map(item => item?.price)
        .reduce((previousValue, currentValue) => previousValue + currentValue, initialCost);
    }
    return initialCost;
  }, [selectedRowData]);

  useEffect(() => {
    if (inventoryData?.docs) {
      const arrOfIds = selectedRowData?.map(item => item._id);
      const arrOfUpdatedPrices = inventoryData?.docs?.map(item => {
        if (arrOfIds.includes(item._id)) {
          const spaceData = selectedRowData.find(rowData => rowData._id === item._id);
          return {
            ...item,
            basicInformation: { ...item?.basicInformation, price: spaceData?.price },
          };
        }
        return { ...item };
      });
      setUpdatedSpaces(arrOfUpdatedPrices);
    }
  }, [inventoryData?.docs]);

  useEffect(() => {
    handleSearch();
    if (searchInput === '') {
      searchParams.delete('spaceName');
      setSearchParams(searchParams);
    }
  }, [searchInput]);

  return (
    <>
      <div className="flex gap-2 pt-4 flex-col pl-5 pr-7">
        <div className="flex justify-between items-center">
          <Text size="lg" weight="bold">
            Select Place for Campaign
          </Text>
          <div className="flex items-center gap-2">
            <div ref={ref} className="relative">
              <Button onClick={toggleDatePicker} variant="default" type="button">
                <Image src={calendar} className="h-5" alt="calendar" />
              </Button>
              {showDatePicker && (
                <div className="absolute z-20 -translate-x-[450px] bg-white -top-0.3">
                  <DateRange handleClose={toggleDatePicker} />
                </div>
              )}
            </div>
            <div className="mr-2">
              <Button onClick={toggleFilter} variant="default" type="button">
                <ChevronDown size={16} className="mt-[1px] mr-1" /> Filter
              </Button>
              {showFilter && <Filter isOpened={showFilter} setShowFilter={setShowFilter} />}
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <div>
            <Text color="gray">Selected Places</Text>
            <Text weight="bold">{noOfSelectedPlaces}</Text>
          </div>
          <div>
            <Text color="gray">Total Price</Text>
            <Text weight="bold">
              {calcutateTotalPrice ? toIndianCurrency(calcutateTotalPrice) : 0}
            </Text>
          </div>
        </div>
        <div className="flex justify-between mb-4 items-center">
          <Text size="sm" className="text-purple-450">
            Total Places{' '}
            <span className="bg-purple-450 text-white py-1 px-2 rounded-full ml-2">
              {inventoryData?.docs?.length}
            </span>
          </Text>

          <Search search={searchInput} setSearch={setSearchInput} />
        </div>
      </div>
      {isLoadingInventoryData ? (
        <div className="flex justify-center items-center h-[400px]">
          <Loader />
        </div>
      ) : null}
      {inventoryData?.docs?.length === 0 && !isLoadingInventoryData ? (
        <div className="w-full min-h-[400px] flex justify-center items-center">
          <p className="text-xl">No records found</p>
        </div>
      ) : null}
      {inventoryData?.docs?.length ? (
        <Table
          data={updatedSpaces}
          COLUMNS={COLUMNS}
          allowRowsSelect
          setSelectedFlatRows={setSelectedRow}
          selectedRowData={selectedRowData}
        />
      ) : null}
    </>
  );
};

export default Spaces;

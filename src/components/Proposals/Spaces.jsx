import { useMemo, useState, useEffect } from 'react';
import { Text, Button, Progress, Image, NumberInput, Badge, Box, Loader } from '@mantine/core';
import { ChevronDown } from 'react-feather';
import { useSearchParams } from 'react-router-dom';
import { useDebouncedState } from '@mantine/hooks';
import { useModals } from '@mantine/modals';
import dayjs from 'dayjs';
import Search from '../Search';
import toIndianCurrency from '../../utils/currencyFormat';
import Table from '../Table/Table';
import MenuPopover from './MenuPopover';
import { useFetchInventory } from '../../hooks/inventory.hooks';
import { colors } from '../../utils';
import modalConfig from '../../utils/modalConfig';
import Filter from '../Inventory/Filter';
import { useFormContext } from '../../context/formContext';

const Spaces = ({
  selectedRow,
  setSelectedRow = () => {},
  selectedRowData = [],
  noOfSelectedPlaces,
  setProposedPrice = () => {},
}) => {
  const [searchInput, setSearchInput] = useDebouncedState('', 1000);
  const modals = useModals();
  const [updatedSpaces, setUpdatedSpaces] = useState([]);
  const [totalProposedPrice, setTotalProposedPrice] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams({
    'limit': 10,
    'page': 1,
    'sortOrder': 'desc',
    'sortBy': 'basicInformation.spaceName',
  });
  const [showFilter, setShowFilter] = useState(false);
  const { values } = useFormContext();

  const { data: inventoryData, isLoading: isLoadingInventoryData } = useFetchInventory(
    searchParams.toString(),
  );
  const page = searchParams.get('page');

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

  const handleInventoryDetails = itemId =>
    window.open(`/inventory/view-details/${itemId}`, '_blank');

  const COLUMNS = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id',
        disableSortBy: true,
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
                  onClick={() => toggleImagePreviewModal(basicInformation?.spacePhoto)}
                >
                  {basicInformation?.spacePhoto ? (
                    <Image src={basicInformation.spacePhoto} alt="banner" height={32} width={32} />
                  ) : (
                    <Image src={null} withPlaceholder height={32} width={32} />
                  )}
                </Box>
                <Button
                  className="text-black px-2 font-medium max-w-[180px]"
                  onClick={() => handleInventoryDetails(_id)}
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
        accessor: 'landlord',
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
        accessor: 'spaceType',
        Cell: ({
          row: {
            original: { basicInformation },
          },
        }) =>
          useMemo(() => {
            const colorType = Object.keys(colors).find(
              key => colors[key] === basicInformation?.spaceType?.name,
            );

            return (
              <Badge color={colorType} size="lg" className="capitalize">
                {basicInformation?.spaceType?.name || <span>-</span>}
              </Badge>
            );
          }),
      },
      {
        Header: 'DIMENSION',
        accessor: 'specifications.size.min',
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
        accessor: 'specifications.impressions.min',
        Cell: ({
          row: {
            original: { specifications },
          },
        }) => useMemo(() => <p>{`${specifications?.impressions?.min}+`}</p>, []),
      },
      {
        Header: 'HEALTH STATUS',
        accessor: 'specifications.health',
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
        Cell: ({
          row: {
            original: { basicInformation },
          },
        }) => useMemo(() => <p>{basicInformation?.mediaType?.name}</p>),
      },
      {
        Header: 'PRICING',
        accessor: 'basicInformation.price',
        Cell: ({
          row: {
            original: { _id, basicInformation },
          },
        }) =>
          useMemo(
            () => (
              <NumberInput
                defaultValue={+(basicInformation?.price || 0)}
                className="w-40"
                hideControls
                onChange={val => setProposedPrice(val, _id)}
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
            original: { _id },
          },
        }) => useMemo(() => <MenuPopover itemId={_id} />, []),
      },
    ],
    [updatedSpaces],
  );

  const calcutateTotalPrice = useMemo(() => {
    const initialCost = 0;
    if (selectedRowData.length > 0) {
      return selectedRowData
        .map(item => item?.price)
        .reduce((previousValue, currentValue) => previousValue + currentValue, initialCost);
    }
    return initialCost;
  }, [selectedRowData]);

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

  const handleSearch = () => {
    searchParams.set('search', searchInput);
    setSearchParams(searchParams);
  };

  const handlePagination = currentPage => {
    searchParams.set('page', currentPage);
    setSearchParams(searchParams);
  };

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
      searchParams.delete('search');
      setSearchParams(searchParams);
    }
  }, [searchInput]);

  useEffect(() => {
    const total = selectedRow
      .map(item => item?.original?.basicInformation?.price)
      .reduce((previousValue, currentValue) => previousValue + +(currentValue || 0), 0);
    setTotalProposedPrice(total);
  }, [noOfSelectedPlaces]);

  useEffect(() => {
    if (values.startDate && values.endDate) {
      searchParams.set('from', dayjs(values.startDate).format('YYYY-MM-DD'));
      searchParams.set('to', dayjs(values.endDate).format('YYYY-MM-DD'));
      setSearchParams(searchParams);
    }
  }, []);

  return (
    <>
      <div className="flex gap-2 pt-4 flex-col pl-5 pr-7">
        <div className="flex justify-between items-center">
          <Text size="lg" weight="bold">
            Select Place for Proposal
          </Text>
          <div className="flex items-center gap-2">
            <div className="mr-2">
              <Button onClick={toggleFilter} variant="default">
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
            <Text weight="bold">{toIndianCurrency(totalProposedPrice ?? calcutateTotalPrice)}</Text>
          </div>
        </div>
        <div className="flex justify-between mb-4 items-center">
          <Text size="sm" className="text-purple-450">
            Total Places{' '}
            <span className="bg-purple-450 text-white py-1 px-2 rounded-full ml-2">
              {inventoryData?.docs?.length || updatedSpaces.length}
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
      {(inventoryData?.docs?.length === 0 || updatedSpaces?.length === 0) &&
      !isLoadingInventoryData ? (
        <div className="w-full min-h-[400px] flex justify-center items-center">
          <p className="text-xl">No records found</p>
        </div>
      ) : null}
      {inventoryData?.docs?.length && updatedSpaces?.length ? (
        <Table
          COLUMNS={COLUMNS}
          data={updatedSpaces}
          activePage={inventoryData?.page || 1}
          totalPages={inventoryData?.totalPages || 1}
          setActivePage={handlePagination}
          allowRowsSelect
          setSelectedFlatRows={setSelectedRow}
          selectedRowData={selectedRowData}
          handleSorting={handleSortByColumn}
        />
      ) : null}
    </>
  );
};

export default Spaces;

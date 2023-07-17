import { useState, useEffect, useMemo } from 'react';
import { Text, Button, Image, Box, Badge, Loader } from '@mantine/core';
import { Plus } from 'react-feather';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useClickOutside, useDebouncedValue } from '@mantine/hooks';
import { useModals } from '@mantine/modals';
import { getWord } from 'num-count';
import RowsPerPage from '../../../RowsPerPage';
import Search from '../../../Search';
import calendar from '../../../../assets/data-table.svg';
import DateRange from '../../../DateRange';
import Table from '../../../Table/Table';
import RoleBased from '../../../RoleBased';
import { categoryColors, ROLES } from '../../../../utils';
import toIndianCurrency from '../../../../utils/currencyFormat';
import modalConfig from '../../../../utils/modalConfig';
import SpacesMenuPopover from '../../../Popovers/SpacesMenuPopover';

const SpacesList = ({ spacesData = {}, isCampaignDataLoading }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams({
    'limit': 10,
    'page': 1,
    'sortOrder': 'desc',
    'sortBy': 'basicInformation.spaceName',
  });
  const ref = useClickOutside(() => setShowDatePicker(false));
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchInput, 800);
  const navigate = useNavigate();
  const modals = useModals();
  const toggleDatePicker = () => setShowDatePicker(!showDatePicker);

  const page = searchParams.get('page');
  const limit = searchParams.get('limit');

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
        disableSortBy: true,
        Cell: ({ row }) =>
          useMemo(() => {
            let currentPage = page;
            let rowCount = 0;
            if (page < 1) {
              currentPage = 1;
            }
            rowCount = (currentPage - 1) * limit;
            return <p>{rowCount + row.index + 1}</p>;
          }, []),
      },
      {
        Header: 'SPACE NAME & PHOTO',
        accessor: 'basicInformation.spaceName',
        Cell: ({
          row: {
            original: { basicInformation, isUnderMaintenance, _id },
          },
        }) =>
          useMemo(
            () => (
              <div className="flex items-center gap-2 ">
                <Box
                  className="bg-white border rounded-md cursor-zoom-in"
                  onClick={() => toggleImagePreviewModal(basicInformation?.spacePhoto)}
                >
                  {basicInformation?.spacePhoto ? (
                    <Image src={basicInformation?.spacePhoto} alt="banner" height={32} width={32} />
                  ) : (
                    <Image src={null} withPlaceholder height={32} width={32} />
                  )}
                </Box>
                <Link to={`/inventory/view-details/${_id}`} className="font-medium px-2 underline">
                  <Text
                    className="overflow-hidden text-ellipsis max-w-[180px] text-purple-450"
                    lineClamp={1}
                    title={basicInformation?.spaceName}
                  >
                    {basicInformation?.spaceName}
                  </Text>
                </Link>
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
        Header: 'CATEGORY',
        accessor: 'category',
        Cell: ({
          row: {
            original: { category },
          },
        }) =>
          useMemo(() => {
            const colorType = Object.keys(categoryColors).find(
              key => categoryColors[key] === category?.name,
            );

            return (
              <div>
                {category?.name ? (
                  <Badge color={colorType || 'gray'} size="lg" className="capitalize">
                    {category.name}
                  </Badge>
                ) : (
                  <span>-</span>
                )}
              </div>
            );
          }, []),
      },
      {
        Header: 'MEDIA OWNER NAME',
        accessor: 'mediaOwner.name',
        Cell: ({
          row: {
            original: { mediaOwner },
          },
        }) => useMemo(() => <p className="w-fit">{mediaOwner?.name || '-'}</p>, []),
      },
      {
        Header: 'IMPRESSION',
        accessor: 'specifications.impressions.max',
        Cell: ({
          row: {
            original: { specifications },
          },
        }) =>
          useMemo(
            () => (
              <p className="capitalize w-32">
                {specifications?.impressions?.max ? getWord(specifications.impressions.max) : 'NA'}
              </p>
            ),
            [],
          ),
      },
      {
        Header: 'MEDIA TYPE',
        accessor: 'basicInformation.mediaType.name',
        Cell: ({
          row: {
            original: { mediaType },
          },
        }) => useMemo(() => <p>{mediaType?.name || '-'}</p>),
      },
      {
        Header: 'PRICING',
        accessor: 'basicInformation.price',
        Cell: ({
          row: {
            original: { basicInformation },
          },
        }) =>
          useMemo(
            () => (
              <p>
                {basicInformation?.price
                  ? toIndianCurrency(Number.parseInt(basicInformation?.price, 10))
                  : 0}
              </p>
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
        }) => useMemo(() => <SpacesMenuPopover itemId={_id} enableDelete={false} />, []),
      },
    ],
    [spacesData?.docs],
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

  const handlePagination = (key, val) => {
    if (val !== '') {
      searchParams.set(key, val);
    } else {
      searchParams.delete(key);
    }
    setSearchParams(searchParams);
  };

  useEffect(() => {
    if (debouncedSearch) {
      searchParams.set('search', debouncedSearch);
    } else {
      searchParams.delete('search');
    }

    setSearchParams(searchParams);
  }, [debouncedSearch]);
  return (
    <>
      <div className="mt-5 flex justify-between">
        <Text>List of space for the campaign</Text>
        <div className="flex">
          <div ref={ref} className="mr-2 relative">
            <Button onClick={toggleDatePicker} variant="default">
              <img src={calendar} className="h-5" alt="calendar" />
            </Button>
            {showDatePicker && (
              <div className="absolute z-20 -translate-x-3/4 bg-white -top-0.3">
                <DateRange handleClose={toggleDatePicker} dateKeys={['from', 'to']} />
              </div>
            )}
          </div>
          <RoleBased acceptedRoles={[ROLES.ADMIN, ROLES.SUPERVISOR]}>
            <div>
              <Button
                onClick={() => navigate('/inventory/create-space/single')}
                className="bg-purple-450 flex items-center align-center py-2 text-white rounded-md px-4 text-sm"
              >
                <Plus size={16} className="mt-[1px] mr-1" /> Add Space
              </Button>
            </div>
          </RoleBased>
        </div>
      </div>
      <div>
        <div className="flex justify-between h-20 items-center">
          <RowsPerPage
            setCount={pageLimit => {
              searchParams.set('limit', pageLimit);
              setSearchParams(searchParams);
            }}
            count={searchParams.get('limit')}
          />
          <Search search={searchInput} setSearch={setSearchInput} />
        </div>
        {isCampaignDataLoading ? (
          <div className="flex justify-center items-center h-[400px]">
            <Loader />
          </div>
        ) : null}
        {!spacesData?.docs?.length && !isCampaignDataLoading ? (
          <div className="w-full min-h-[400px] flex justify-center items-center">
            <p className="text-xl">No records found</p>
          </div>
        ) : null}
        {spacesData?.docs?.length ? (
          <Table
            data={spacesData?.docs || []}
            COLUMNS={COLUMNS}
            handleSorting={handleSortByColumn}
            setActivePage={currentPage => handlePagination('page', currentPage)}
          />
        ) : null}
      </div>
    </>
  );
};

export default SpacesList;

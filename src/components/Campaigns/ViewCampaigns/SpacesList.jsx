import { useState, useEffect, useMemo } from 'react';
import { Text, Button, Image, Box, Badge, Loader } from '@mantine/core';
import { Plus } from 'react-feather';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useClickOutside, useDebouncedState } from '@mantine/hooks';
import { useModals } from '@mantine/modals';
import RowsPerPage from '../../RowsPerPage';
import Search from '../../Search';
import calendar from '../../../assets/data-table.svg';
import DateRange from '../../DateRange';
import Table from '../../Table/Table';
import RoleBased from '../../RoleBased';
import { colors, ROLES } from '../../../utils';
import toIndianCurrency from '../../../utils/currencyFormat';
import modalConfig from '../../../utils/modalConfig';
import SpacesMenuPopover from '../../Popovers/SpacesMenuPopover';

const SpacesList = ({ spacesData = {}, isCampaignDataLoading }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams({
    'limit': 10,
    'page': 1,
    'sortOrder': 'desc',
    'sortBy': 'basicInformation.spaceName',
  });
  const ref = useClickOutside(() => setShowDatePicker(false));
  const [search, setSearch] = useDebouncedState('', 500);
  const navigate = useNavigate();
  const modals = useModals();
  const toggleDatePicker = () => setShowDatePicker(!showDatePicker);

  const page = searchParams.get('page');
  const limit = searchParams.get('limit');

  const handleInventoryDetails = itemId =>
    navigate(`/inventory/view-details/${itemId}`, {
      replace: true,
    });

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
            return <div className="pl-2">{rowCount + row.index + 1}</div>;
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
                <Button
                  className="text-black font-medium px-2 max-w-[180px]"
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
        Header: 'SPACE TYPE',
        accessor: 'basicInformation.spaceType.name',
        Cell: ({
          row: {
            original: { spaceType },
          },
        }) =>
          useMemo(() => {
            const colorType = Object.keys(colors).find(key => colors[key] === spaceType?.name);

            return (
              <div>
                {spaceType?.name ? (
                  <Badge color={colorType} size="lg" className="capitalize">
                    {spaceType.name}
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
        accessor: 'basicInformation.mediaOwner.name',
        Cell: ({
          row: {
            original: { basicInformation },
          },
        }) =>
          useMemo(() => <p className="w-fit">{basicInformation?.mediaOwner?.name || '-'}</p>, []),
      },
      {
        Header: 'IMPRESSION',
        accessor: 'specifications.impressions.max',
        Cell: ({
          row: {
            original: { specifications },
          },
        }) => useMemo(() => <p>{`${specifications?.impressions?.max || 0}+`}</p>, []),
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
              <p className="pl-2">
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

  useEffect(() => {
    if (search) {
      searchParams.set('search', search);
    } else {
      searchParams.delete('search');
    }

    setSearchParams(searchParams);
  }, [search]);
  return (
    <>
      <div className="mt-5 pl-5 pr-7 flex justify-between">
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
          <Search search={search} setSearch={setSearch} />
        </div>
        {isCampaignDataLoading ? (
          <div className="flex justify-center items-center h-[400px]">
            <Loader />
          </div>
        ) : null}
        {spacesData?.docs?.length === 0 && !isCampaignDataLoading ? (
          <div className="w-full min-h-[400px] flex justify-center items-center">
            <p className="text-xl">No records found</p>
          </div>
        ) : null}
        {spacesData?.docs?.length ? (
          <Table
            data={spacesData?.docs || []}
            COLUMNS={COLUMNS}
            handleSorting={handleSortByColumn}
          />
        ) : null}
      </div>
    </>
  );
};

export default SpacesList;

import { useMemo, useState, useEffect } from 'react';
import { Badge, Button, Image, Loader, Text } from '@mantine/core';
import { ChevronDown } from 'react-feather';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import { useModals } from '@mantine/modals';
import classNames from 'classnames';
import { v4 as uuidv4 } from 'uuid';
import shallow from 'zustand/shallow';
import GoogleMapReact from 'google-map-react';
import RowsPerPage from '../../components/RowsPerPage';
import Search from '../../components/Search';
import Header from '../../components/modules/proposals/ViewProposal/Header';
import Details from '../../components/modules/proposals/ViewProposal/Details';
import Table from '../../components/Table/Table';
import { useFetchProposalById } from '../../apis/queries/proposal.queries';
import toIndianCurrency from '../../utils/currencyFormat';
import {
  categoryColors,
  currentDate,
  generateSlNo,
  getAvailableUnits,
  getOccupiedState,
  indianMapCoordinates,
  stringToColour,
} from '../../utils';
import modalConfig from '../../utils/modalConfig';
import Filter from '../../components/modules/inventory/Filter';
import useUserStore from '../../store/user.store';
import ProposalSpacesMenuPopover from '../../components/Popovers/ProposalSpacesMenuPopover';
import useLayoutView from '../../store/layout.store';
import SpaceNamePhotoContent from '../../components/modules/inventory/SpaceNamePhotoContent';
import VersionsDrawer from '../../components/modules/proposals/ViewProposal/VersionsDrawer';
import ShareContent from '../../components/modules/proposals/ViewProposal/ShareContent';
import MarkerIcon from '../../assets/pin.svg';
import { GOOGLE_MAPS_API_KEY } from '../../utils/config';

const updatedModalConfig = {
  ...modalConfig,
  classNames: {
    title: 'font-dmSans text-xl px-4',
    header: 'px-4 pt-4',
    body: '',
    close: 'mr-4',
  },
};

const defaultProps = {
  center: {
    lat: 28.70406,
    lng: 77.102493,
  },
  zoom: 10,
};

const Marker = () => <Image src={MarkerIcon} height={28} width={28} />;

const ProposalDetailsPage = () => {
  const modals = useModals();
  const [mapInstance, setMapInstance] = useState(null);
  const userId = useUserStore(state => state.id);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchInput, 800);
  const [showFilter, setShowFilter] = useState(false);
  const { activeLayout, setActiveLayout } = useLayoutView(
    state => ({
      activeLayout: state.activeLayout,
      setActiveLayout: state.setActiveLayout,
    }),
    shallow,
  );
  const [searchParams, setSearchParams] = useSearchParams({
    owner: 'all',
    page: 1,
    limit: activeLayout.inventoryLimit || 20,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const toggleFilter = () => setShowFilter(!showFilter);

  const [versionDrawerOpened, versionDrawerActions] = useDisclosure();

  const { id: proposalId } = useParams();
  const { data: proposalData, isLoading: isProposalDataLoading } = useFetchProposalById(
    `${proposalId}?${searchParams.toString()}`,
  );

  const page = searchParams.get('page');
  const limit = searchParams.get('limit');

  const togglePreviewModal = imgSrc =>
    modals.openModal({
      title: 'Preview',
      children: (
        <Image src={imgSrc || null} height={580} alt="preview" withPlaceholder={!!imgSrc} />
      ),
      ...updatedModalConfig,
    });

  const toggleShareOptions = id => {
    modals.openModal({
      modalId: 'shareProposalOption',
      title: 'Share and Download Option',
      children: (
        <ShareContent
          shareType="proposal"
          id={id}
          onClose={() => modals.closeModal('shareProposalOption')}
        />
      ),
      ...modalConfig,
    });
  };

  const COLUMNS = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id',
        disableSortBy: true,
        Cell: info => useMemo(() => <p>{generateSlNo(info.row.index, page, limit)}</p>, []),
      },
      {
        Header: 'SPACE NAME & PHOTO',
        accessor: 'spaceName',
        Cell: ({
          row: {
            original: { _id, spaceName, spacePhoto, isUnderMaintenance, bookingRange, unit },
          },
        }) =>
          useMemo(() => {
            const unitLeft = getAvailableUnits(bookingRange, currentDate, currentDate, unit);

            const occupiedState = getOccupiedState(unitLeft, unit);

            return (
              <SpaceNamePhotoContent
                id={_id}
                spaceName={spaceName}
                spacePhoto={spacePhoto}
                occupiedStateLabel={occupiedState}
                isUnderMaintenance={isUnderMaintenance}
                togglePreviewModal={togglePreviewModal}
              />
            );
          }, []),
      },
      {
        Header: 'FACIA TOWARDS',
        accessor: 'faciaTowards',
        disableSortBy: true,
        Cell: info => useMemo(() => <p>{info.row.original.faciaTowards || '-'}</p>, []),
      },
      {
        Header: 'CITY',
        accessor: 'location',
        Cell: ({
          row: {
            original: { location },
          },
        }) => useMemo(() => <p>{location || '-'}</p>),
      },
      {
        Header: 'ADDITIONAL TAGS',
        accessor: 'additionalTags',
        disableSortBy: true,
        Cell: info =>
          useMemo(
            () => (
              <div className="flex gap-x-2">
                {info.row.original.additionalTags?.length
                  ? info.row.original.additionalTags.map(
                      (item, index) =>
                        index < 2 && (
                          <Badge
                            key={uuidv4()}
                            size="lg"
                            className="capitalize w-fit"
                            title={item}
                            variant="outline"
                            color="cyan"
                            radius="xs"
                          >
                            {item}
                          </Badge>
                        ),
                    )
                  : '-'}
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
              key => categoryColors[key] === category,
            );
            return (
              <div>
                {category ? (
                  <Badge color={colorType || 'gray'} size="lg" className="capitalize">
                    {category}
                  </Badge>
                ) : (
                  <span>-</span>
                )}
              </div>
            );
          }, []),
      },
      {
        Header: 'MEDIUM',
        accessor: 'subCategory',
        Cell: info =>
          useMemo(
            () =>
              info.row.original.subCategory ? (
                <p
                  className="h-6 px-3 flex items-center rounded-xl text-white font-medium text-[13px] capitalize"
                  style={{
                    background: stringToColour(info.row.original.subCategory),
                  }}
                >
                  {info.row.original.subCategory}
                </p>
              ) : (
                '-'
              ),
            [],
          ),
      },
      {
        Header: 'DIMENSION (WxH)',
        accessor: 'size.height',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { size },
          },
        }) =>
          useMemo(
            () => (
              <p>
                {size
                  .map((item, index) =>
                    index < 2 ? `${item?.width || 0}ft x ${item?.height || 0}ft` : null,
                  )
                  .filter(item => item !== null)
                  .join(', ')}
              </p>
            ),
            [],
          ),
      },
      {
        Header: 'PRICING',
        accessor: 'price',
        Cell: ({
          row: {
            original: { price },
          },
        }) => useMemo(() => <p>{price ? toIndianCurrency(price) : 0}</p>, []),
      },
      {
        Header: 'UNIT',
        accessor: 'bookedUnits',
        Cell: ({
          row: {
            original: { bookedUnits },
          },
        }) => useMemo(() => <p>{bookedUnits || '-'}</p>, []),
      },
      {
        Header: 'INVENTORY ID',
        accessor: 'inventoryId',
        Cell: info => useMemo(() => <p>{info.row.original.inventoryId || '-'}</p>, []),
      },
      {
        Header: 'MEDIA OWNER NAME',
        accessor: 'mediaOwner',
        Cell: ({
          row: {
            original: { mediaOwner },
          },
        }) => useMemo(() => <p className="w-fit">{mediaOwner || '-'}</p>, []),
      },
      {
        Header: 'PEER',
        accessor: 'peer',
        Cell: ({
          row: {
            original: { peer, peerId, mediaOwner },
          },
        }) =>
          useMemo(
            () => (
              <p
                className={classNames(
                  peerId === userId ? 'text-purple-450' : 'text-black',
                  'w-fit',
                )}
              >
                {peer ? mediaOwner : '-'}
              </p>
            ),
            [],
          ),
      },
      {
        Header: 'MEDIA TYPE',
        accessor: 'mediaType',
        Cell: ({
          row: {
            original: { mediaType },
          },
        }) => useMemo(() => <p>{mediaType || '-'}</p>),
      },
      {
        Header: 'FACING',
        accessor: 'facing',
        Cell: info => useMemo(() => <p>{info.row.original.facing || '-'}</p>),
      },
      {
        Header: 'ACTION',
        accessor: 'action',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { _id, createdBy },
          },
        }) =>
          useMemo(
            () => (
              <ProposalSpacesMenuPopover
                inventoryId={_id}
                spacesData={proposalData?.inventories?.docs}
                enableEdit={createdBy && !createdBy?.isPeer}
                enableDelete={createdBy && !createdBy?.isPeer}
              />
            ),
            [],
          ),
      },
    ],
    [proposalData?.inventories?.docs],
  );

  const handleSortByColumn = colId => {
    if (searchParams.get('sortBy') === colId && searchParams.get('sortOrder') === 'desc') {
      searchParams.set('sortOrder', 'asc');
      setSearchParams(searchParams, { replace: true });
      return;
    }
    if (searchParams.get('sortBy') === colId && searchParams.get('sortOrder') === 'asc') {
      searchParams.set('sortOrder', 'desc');
      setSearchParams(searchParams, { replace: true });
      return;
    }

    searchParams.set('sortBy', colId);
    setSearchParams(searchParams, { replace: true });
  };

  const handleSearch = () => {
    searchParams.set('search', debouncedSearch);
    searchParams.set('page', debouncedSearch === '' ? page : 1);
    setSearchParams(searchParams, { replace: true });
  };

  const handlePagination = (key, val) => {
    if (val !== '') searchParams.set(key, val);
    else searchParams.delete(key);
    setSearchParams(searchParams, { replace: true });
  };

  useEffect(() => {
    handleSearch();
    if (debouncedSearch === '') {
      searchParams.delete('search');
      setSearchParams(searchParams, { replace: true });
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (mapInstance && proposalData?.inventories?.docs?.length) {
      const bounds = new mapInstance.maps.LatLngBounds();

      // default coordinates
      bounds.extend({
        lat: indianMapCoordinates.latitude,
        lng: indianMapCoordinates.longitude,
      });

      mapInstance.map.fitBounds(bounds);
      mapInstance.map.setCenter(bounds.getCenter());
      mapInstance.map.setZoom(Math.min(5, mapInstance.map.getZoom()));
    }
  }, [proposalData?.inventories?.docs?.length, mapInstance]);
  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 border-l border-gray-450 overflow-y-auto px-5">
      <Header
        isPeer={proposalData?.proposal?.isPeer}
        bookingId={proposalData?.proposal?.bookingId}
        onOpenVersionsDrawer={versionDrawerActions.open}
        toggleShareOptions={toggleShareOptions}
        parentProposalId={proposalData?.proposal?.parentProposalId}
        version={proposalData?.proposal?.versionTitle}
      />
      <Details
        proposalData={proposalData?.proposal}
        isProposalDataLoading={isProposalDataLoading}
        inventoryData={proposalData?.inventories}
        proposalId={proposalId}
      />

      <p className="text-lg font-bold py-2">Location Details</p>

      <div className="mt-1 mb-4 h-[40vh]">
        <GoogleMapReact
          bootstrapURLKeys={{ key: GOOGLE_MAPS_API_KEY, libraries: 'places' }}
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => setMapInstance({ map, maps })}
        >
          {proposalData?.inventories?.docs?.map(item => (
            <Marker
              key={item._id}
              lat={item.latitude && Number(item.latitude)}
              lng={item.longitude && Number(item.longitude)}
            />
          ))}
        </GoogleMapReact>
      </div>

      <div className="flex justify-between mt-4">
        <Text size="xl" weight="bolder">
          Selected Inventory
        </Text>
        <div className="flex gap-2">
          <div>
            <Button onClick={toggleFilter} variant="default">
              <ChevronDown size={16} className="mt-[1px] mr-1" /> Filter
            </Button>
            {showFilter && <Filter isOpened={showFilter} setShowFilter={setShowFilter} />}
          </div>
        </div>
      </div>

      <div className="flex justify-between h-20 items-center">
        <RowsPerPage
          setCount={currentLimit => {
            handlePagination('limit', currentLimit);
            setActiveLayout({ ...activeLayout, inventoryLimit: currentLimit });
          }}
          count={limit}
        />
        <Search search={searchInput} setSearch={setSearchInput} />
      </div>
      {isProposalDataLoading ? (
        <div className="flex justify-center items-center h-[400px]">
          <Loader />
        </div>
      ) : null}
      {!proposalData?.inventories?.docs?.length && !isProposalDataLoading ? (
        <div className="w-full min-h-[300px] flex justify-center items-center">
          <p className="text-xl">No records found</p>
        </div>
      ) : null}
      <div>
        {proposalData?.inventories?.docs?.length ? (
          <Table
            COLUMNS={COLUMNS}
            data={proposalData?.inventories?.docs || []}
            activePage={proposalData?.inventories?.page || 1}
            totalPages={proposalData?.inventories?.totalPages || 1}
            setActivePage={currentPage => handlePagination('page', currentPage)}
            handleSorting={handleSortByColumn}
          />
        ) : null}
      </div>
      <VersionsDrawer
        isOpened={versionDrawerOpened}
        onClose={versionDrawerActions.close}
        searchParams={searchParams}
        toggleShareOptions={toggleShareOptions}
        parentId={proposalData?.proposal?.parentProposalId}
        parentVersionTitle={proposalData?.proposal?.versionTitle}
      />
    </div>
  );
};

export default ProposalDetailsPage;

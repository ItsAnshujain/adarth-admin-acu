import { useSearchParams, useParams } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import { Image, Text } from '@mantine/core';
import GoogleMapReact from 'google-map-react';
import { Loader } from 'react-feather';
import { useDebouncedValue } from '@mantine/hooks';
import shallow from 'zustand/shallow';
import dayjs from 'dayjs';
import { useProposalByVersionName } from '../apis/queries/proposal.queries';
import Table from '../components/Table/Table';
import { calculateTotalMonths, generateSlNo, indianMapCoordinates } from '../utils';
import { GOOGLE_MAPS_API_KEY } from '../utils/config';
import MarkerIcon from '../assets/pin.svg';
import RowsPerPage from '../components/RowsPerPage';
import Search from '../components/Search';
import useLayoutView from '../store/layout.store';
import Details from '../components/modules/proposals/PublicLinkView/Details';
import Header from '../components/modules/proposals/PublicLinkView/Header';
import toIndianCurrency from '../utils/currencyFormat';

const Marker = () => <Image src={MarkerIcon} height={28} width={28} />;

const defaultProps = {
  center: {
    lat: 28.70406,
    lng: 77.102493,
  },
  zoom: 10,
};

const PublicLinkPage = () => {
  const [mapInstance, setMapInstance] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchInput, 800);
  const [searchParams, setSearchParams] = useSearchParams({
    owner: 'all',
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const { activeLayout, setActiveLayout } = useLayoutView(
    state => ({
      activeLayout: state.activeLayout,
      setActiveLayout: state.setActiveLayout,
    }),
    shallow,
  );

  const page = searchParams.get('page');
  const limit = searchParams.get('limit');

  const { proposal_version_name, client_company_name } = useParams();
  const { data: proposalData, isLoading: isProposalDataLoading } = useProposalByVersionName(
    `${proposal_version_name}?${searchParams.toString()}`,
  );

  const handlePagination = (key, val) => {
    if (val !== '') searchParams.set(key, val);
    else searchParams.delete(key);
    setSearchParams(searchParams, { replace: true });
  };

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

  useEffect(() => {
    handleSearch();
    if (debouncedSearch === '') {
      searchParams.delete('search');
      setSearchParams(searchParams, { replace: true });
    }
  }, [debouncedSearch]);

  const displayCost = place => {
    if (
      proposalData?.proposal?.displayColumns?.some(col => col === 'discountedDisplayPrice') &&
      place.pricingDetails.discountedDisplayCost > 0
    ) {
      return (
        place.pricingDetails.discountedDisplayCost *
        calculateTotalMonths(place.pricingDetails.startDate, place.pricingDetails.endDate)
      );
    }
    return place.pricingDetails.totalDisplayCost;
  };

  const calculateTotalPrice = place =>
    (proposalData?.proposal?.displayColumns?.some(col => col === 'displayPrice')
      ? displayCost(place)
      : 0) +
      (proposalData?.proposal?.displayColumns?.some(col => col === 'printingCost')
        ? place.pricingDetails.totalPrintingCost
        : 0) +
      (proposalData?.proposal?.displayColumns?.some(col => col === 'mountingCost')
        ? place.pricingDetails.totalMountingCost
        : 0) +
      (proposalData?.proposal?.displayColumns?.some(col => col === 'installationCost')
        ? place.pricingDetails.oneTimeInstallationCost
        : 0) +
      (proposalData?.proposal?.displayColumns?.some(col => col === 'monthlyAdditionalCost')
        ? place.pricingDetails.monthlyAdditionalCost
        : 0) || 0;

  const COLUMNS = useMemo(() => {
    const dataColumns = [
      {
        Header: '#',
        accessor: 'id',
        disableSortBy: true,
        show: proposalData?.proposal?.displayColumns?.some(col => col === 'serialNo'),
        Cell: info => useMemo(() => <p>{generateSlNo(info.row.index, page, limit)}</p>, []),
      },
      {
        Header: 'SPACE NAME & IMAGE',
        accessor: 'spaceName',
        show: true,
        Cell: ({
          row: {
            original: { _id, spaceName, spacePhoto },
          },
        }) =>
          useMemo(
            () => (
              <div className="flex gap-4 items-center">
                {spacePhoto ? (
                  <Image src={spacePhoto} alt="img" height={32} width={32} />
                ) : (
                  <Image src={null} withPlaceholder height={32} width={32} />
                )}
                <Text
                  className="overflow-hidden text-ellipsis underline"
                  lineClamp={1}
                  title={spaceName}
                >
                  {spaceName}
                </Text>
              </div>
            ),
            [],
          ),
      },
      {
        Header: 'FACIA TOWARDS',
        accessor: 'faciaTowards',
        show: proposalData?.proposal?.displayColumns?.some(col => col === 'faciaTowards'),
        disableSortBy: true,
        Cell: info => useMemo(() => <p>{info.row.original.faciaTowards || '-'}</p>, []),
      },
      {
        Header: 'MEDIUM',
        accessor: 'subCategory',
        disableSortBy: true,
        show: true,
        Cell: ({
          row: {
            original: { subCategory },
          },
        }) => useMemo(() => <p>{subCategory || '-'}</p>),
      },
      {
        Header: 'CITY',
        accessor: 'location',
        show: true,
        Cell: ({
          row: {
            original: { location },
          },
        }) => useMemo(() => <p>{location || '-'}</p>),
      },
      {
        Header: 'STATE',
        accessor: 'state',
        disableSortBy: true,
        show: proposalData?.proposal?.displayColumns?.some(col => col === 'state'),
        Cell: ({
          row: {
            original: { state },
          },
        }) => useMemo(() => <p>{state || '-'}</p>),
      },
      {
        Header: 'ILLUMINATION',
        accessor: 'illumination',
        disableSortBy: true,
        show: proposalData?.proposal?.displayColumns?.some(col => col === 'illumination'),
        Cell: ({
          row: {
            original: { illumination },
          },
        }) => useMemo(() => <p>{illumination || '-'}</p>, []),
      },
      {
        Header: 'LOCATION',
        accessor: 'landmark',
        disableSortBy: true,
        show: proposalData?.proposal?.displayColumns?.some(col => col === 'location'),
        Cell: ({
          row: {
            original: { landmark },
          },
        }) => useMemo(() => <p>{landmark || '-'}</p>, []),
      },
      {
        Header: 'UNITS',
        accessor: 'unit',
        disableSortBy: true,
        show: proposalData?.proposal?.displayColumns?.some(col => col === 'units'),
        Cell: ({
          row: {
            original: { unit },
          },
        }) => useMemo(() => <p>{unit || '-'}</p>, []),
      },
      {
        Header: 'FACING',
        accessor: 'facing',
        disableSortBy: true,
        show: proposalData?.proposal?.displayColumns?.some(col => col === 'facing'),
        Cell: ({
          row: {
            original: { facing },
          },
        }) => useMemo(() => <p>{facing || '-'}</p>, []),
      },
      {
        Header: 'W (IN FT.)',
        accessor: 'size.width',
        show: true,
        Cell: ({
          row: {
            original: { size },
          },
        }) =>
          useMemo(
            () => (
              <p className="flex flex-col">
                {size.map(ele => <div>{ele?.width}</div>).filter(ele => ele !== null) || '-'}
              </p>
            ),
            [],
          ),
      },
      {
        Header: 'H (IN FT.)',
        accessor: 'size.height',
        show: true,
        Cell: ({
          row: {
            original: { size },
          },
        }) =>
          useMemo(
            () => (
              <p>{size.map(ele => <div>{ele?.height}</div>).filter(ele => ele !== null) || '-'}</p>
            ),
            [],
          ),
      },
      {
        Header: 'AREA (IN SQ. FT.)',
        accessor: 'area',
        disableSortBy: true,
        show: proposalData?.proposal?.displayColumns?.some(col => col === 'areaInSqFt'),
        Cell: ({
          row: {
            original: { size },
          },
        }) =>
          useMemo(
            () => (
              <p>
                {size?.reduce(
                  (accumulator, dimension) => accumulator + dimension.height * dimension.width,
                  0,
                )}
              </p>
            ),
            [],
          ),
      },
      {
        Header: 'DISPLAY COST / MONTH',
        accessor: 'pricingDetails.displayCostPerMonth',
        disableSortBy: true,
        show: proposalData?.proposal?.displayColumns?.some(col => col === 'displayPrice'),
        Cell: ({
          row: {
            original: { pricingDetails },
          },
        }) =>
          useMemo(
            () => (
              <p>
                {pricingDetails.displayCostPerMonth
                  ? toIndianCurrency(pricingDetails.displayCostPerMonth)
                  : null}
              </p>
            ),
            [],
          ),
      },
      {
        Header: 'DISPLAY COST / SQ. FT',
        accessor: 'pricingDetails.displayCostPerSqFt',
        show: proposalData?.proposal?.displayColumns?.some(col => col === 'displayPricePerSqft'),
        disableSortBy: true,
        Cell: ({
          row: {
            original: { pricingDetails },
          },
        }) =>
          useMemo(
            () => (
              <p>
                {pricingDetails.displayCostPerSqFt
                  ? toIndianCurrency(pricingDetails.displayCostPerSqFt)
                  : null}
              </p>
            ),
            [],
          ),
      },
      {
        Header: 'DISCOUNTED DISPLAY COST',
        accessor: 'pricingDetails.discountedDisplayCost',
        show: proposalData?.proposal?.displayColumns?.some(col => col === 'discountedDisplayPrice'),
        disableSortBy: true,
        Cell: ({
          row: {
            original: { pricingDetails },
          },
        }) =>
          useMemo(
            () => (
              <p>
                {pricingDetails.discountedDisplayCost
                  ? toIndianCurrency(pricingDetails.discountedDisplayCost)
                  : null}
              </p>
            ),
            [],
          ),
      },
      {
        Header: 'PRINTING COST',
        accessor: 'pricingDetails.totalPrintingCost',
        show: proposalData?.proposal?.displayColumns?.some(col => col === 'printingCost'),
        disableSortBy: true,
        Cell: ({
          row: {
            original: { pricingDetails },
          },
        }) =>
          useMemo(
            () => (
              <p>
                {pricingDetails.totalPrintingCost
                  ? toIndianCurrency(pricingDetails.totalPrintingCost)
                  : null}
              </p>
            ),
            [],
          ),
      },
      {
        Header: 'MOUNTING COST',
        accessor: 'pricingDetails.totalMountingCost',
        show: proposalData?.proposal?.displayColumns?.some(col => col === 'mountingCost'),
        disableSortBy: true,
        Cell: ({
          row: {
            original: { pricingDetails },
          },
        }) =>
          useMemo(
            () => (
              <p>
                {pricingDetails.totalMountingCost
                  ? toIndianCurrency(pricingDetails.totalMountingCost)
                  : null}
              </p>
            ),
            [],
          ),
      },
      {
        Header: 'ONE TIME INSTALLATION COST',
        accessor: 'pricingDetails.oneTimeInstallationCost',
        disableSortBy: true,
        show: proposalData?.proposal?.displayColumns?.some(col => col === 'installationCost'),
        Cell: ({
          row: {
            original: { pricingDetails },
          },
        }) =>
          useMemo(
            () => <p>{pricingDetails.oneTimeInstallationCost ? toIndianCurrency() : null}</p>,
            [],
          ),
      },
      {
        Header: 'MONTHLY ADDITIONAL COST',
        accessor: 'pricingDetails.monthlyAdditionalCost',
        disableSortBy: true,
        show: proposalData?.proposal?.displayColumns?.some(col => col === 'monthlyAdditionalCost'),
        Cell: ({
          row: {
            original: { pricingDetails },
          },
        }) =>
          useMemo(
            () => (
              <p>
                {pricingDetails.monthlyAdditionalCost
                  ? toIndianCurrency(pricingDetails.monthlyAdditionalCost)
                  : null}
              </p>
            ),
            [],
          ),
      },
      {
        Header: 'TOTAL PRICE',
        accessor: 'price',
        disableSortBy: true,
        show: true,
        Cell: ({ row: { original } }) => useMemo(() => calculateTotalPrice(original), []),
      },
      {
        Header: 'AVAILABILITY',
        accessor: 'startDate',
        disableSortBy: true,
        show: proposalData?.proposal?.displayColumns?.some(col => col === 'availability'),
        Cell: ({
          row: {
            original: { startDate },
          },
        }) => useMemo(() => <p>{dayjs(startDate).format('DD/MM/YYYY') || '-'}</p>, []),
      },
      {
        Header: 'SUBJECT TO EXTENSION',
        accessor: 'subjectToExtension',
        disableSortBy: true,
        show: proposalData?.proposal?.displayColumns?.some(col => col === 'extension'),
        Cell: ({
          row: {
            original: {
              pricingDetails: { subjectToExtension },
            },
          },
        }) =>
          useMemo(
            () => <p className="italic">{subjectToExtension ? 'Subject to extension' : null}</p>,
            [],
          ),
      },
    ];
    return dataColumns.filter(col => col.show);
  }, [proposalData?.inventories?.docs]);

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
    <div className="col-span-12 md:col-span-12 lg:col-span-10 border-l border-gray-450 overflow-y-auto px-4  md:pb-10 md:px-14">
      <Header proposalId={proposalData?.proposal?._id} clientCompanyName={client_company_name} />
      <Details
        proposalData={proposalData?.proposal}
        isProposalDataLoading={isProposalDataLoading}
        inventoryData={proposalData?.inventories}
      />

      <p className="font-bold pt-2 text-2xl">Location Details</p>
      <p className="text-base font-light text-slate-400">
        All the places being covered in this campaign
      </p>
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

      <p className="font-bold pt-2 text-2xl">Places In The Campaign</p>
      <p className="text-base font-light text-slate-400">
        All the places being covered in this campaign
      </p>
      <div className="flex justify-between h-16 items-center">
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
    </div>
  );
};

export default PublicLinkPage;

import { useEffect, useMemo, useState } from 'react';
import { Button, Image, Pagination } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import GoogleMapReact from 'google-map-react';
import { useSearchParams } from 'react-router-dom';
import CustomBadge from '../../shared/Badge';
import Places from './UI/Places';
import toIndianCurrency from '../../../utils/currencyFormat';
import MarkerIcon from '../../../assets/pin.svg';
import { GOOGLE_MAPS_API_KEY } from '../../../utils/config';
import NoData from '../../shared/NoData';

const defaultProps = {
  center: {
    lat: 28.70406,
    lng: 77.102493,
  },
  zoom: 10,
};

const Marker = () => <Image src={MarkerIcon} height={28} width={28} />;

const Overview = ({ bookingData = {} }) => {
  const [readMore, toggle] = useToggle();
  const [posterImage, setPosterImage] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams({
    page: 1,
    limit: 6,
  });

  const calculateTotalCities = useMemo(() => {
    const initialCity = 0;
    if (bookingData?.campaign?.spaces?.length > 0) {
      const filteredNamesArr = bookingData?.campaign?.spaces.map(item => item?.location?.city);
      const uniqueNamesArr = Array.from(new Set(filteredNamesArr.map(item => item?.toLowerCase())));
      return uniqueNamesArr;
    }
    return initialCity;
  }, [bookingData?.campaign?.spaces]);

  const calcutateTotalMinimumImpressions = useMemo(() => {
    const initialImpressions = 0;
    if (bookingData?.campaign?.spaces?.length > 0) {
      return bookingData?.campaign?.spaces
        .map(item =>
          item?.specifications?.impressions
            ? Number.parseInt(item.specifications.impressions.min, 10)
            : 0,
        )
        .reduce((previousValue, currentValue) => previousValue + currentValue, initialImpressions);
    }
    return initialImpressions;
  }, [bookingData?.campaign?.spaces]);

  useEffect(() => {
    if (mapInstance && bookingData?.campaign?.spaces?.length) {
      const bounds = new mapInstance.maps.LatLngBounds();

      bookingData?.campaign?.spaces?.forEach(item => {
        bounds.extend({
          lat: +(item.location?.latitude || 0),
          lng: +(item.location?.longitude || 0),
        });
      });

      mapInstance.map.fitBounds(bounds);
      mapInstance.map.setCenter(bounds.getCenter());
      mapInstance.map.setZoom(Math.min(10, mapInstance.map.getZoom()));
    }
  }, [bookingData?.campaign?.spaces?.length, mapInstance]);

  useEffect(() => {
    if (bookingData?.campaign?.media) setPosterImage(bookingData?.campaign?.medias?.[0]);
  }, [bookingData]);

  return (
    <>
      <div className="flex gap-8 pt-4">
        <div className="flex-1 pl-5 max-w-1/2">
          <div className="flex flex-col">
            <div>
              <Image
                withPlaceholder
                className="w-full h-96 max-w-1/2"
                src={posterImage}
                alt="poster"
                height="24rem"
              />
            </div>
            <div className="flex overflow-scroll pt-4 gap-4 items-center">
              {bookingData?.campaign?.medias.map(src => (
                <Image
                  key={src}
                  aria-hidden
                  withPlaceholder
                  onClick={() => setPosterImage(src)}
                  className="cursor-pointer"
                  height="6rem"
                  width="7rem"
                  src={src}
                  alt="poster"
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 pr-7 max-w-1/2 gap-2">
          <p className="font-bold text-2xl mb-2">
            {bookingData?.campaign?.name || <NoData type="na" />}
          </p>
          <div>
            <p className="text-slate-400 font-light text-[14px]">
              {bookingData?.description?.split(' ')?.length > 4
                ? readMore
                  ? `${bookingData?.description?.split(' ')?.slice(0, 3).join(' ')}...`
                  : bookingData?.description
                : bookingData.description || <NoData type="na" />}
              {bookingData?.description?.split(' ')?.length > 4 ? (
                <Button onClick={() => toggle()} className="text-purple-450 font-medium p-0">
                  {readMore ? 'Read more' : 'Read less'}
                </Button>
              ) : null}
            </p>
          </div>
          <div className="flex mt-4 items-center gap-2 ">
            <span>{toIndianCurrency(bookingData?.campaign?.totalPrice || 0)}</span>
            <CustomBadge
              size="lg"
              text={
                <>
                  {calcutateTotalMinimumImpressions &&
                  !Number.isNaN(calcutateTotalMinimumImpressions)
                    ? calcutateTotalMinimumImpressions
                    : 0}{' '}
                  Total Impressions{' '}
                </>
              }
              className="py-4 font-extralight bg-[#4B0DAF1A] capitalize "
            />
          </div>
          <div className="mt-8">
            <p>Specifications</p>
            <p className="text-slate-400 text-sm">All the details regarding the campaign</p>
            <div className="p-4 py-6 grid grid-cols-2 grid-rows-2 border rounded-md gap-y-4 mt-2">
              <div>
                <p className="text-slate-400 text-sm">Total Media</p>
                <p>{bookingData?.campaign?.medias.length ?? <NoData type="na" />}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Impressions</p>
                <p>
                  {calcutateTotalMinimumImpressions &&
                  !Number.isNaN(calcutateTotalMinimumImpressions)
                    ? calcutateTotalMinimumImpressions
                    : 0}{' '}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Number of Locations</p>
                <p>{calculateTotalCities.length ?? <NoData type="na" />}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pl-5 pr-7 flex flex-col mt-16 mb-8 pb-10 relative">
        <p className="text-lg font-bold">Location Details</p>
        <p className="text-sm font-light text-slate-400">
          All the places been covered by this campaign
        </p>
        <div className="mt-1 mb-8 h-[30vh]">
          <GoogleMapReact
            bootstrapURLKeys={{ key: GOOGLE_MAPS_API_KEY, libraries: 'places' }}
            defaultCenter={defaultProps.center}
            defaultZoom={defaultProps.zoom}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }) => setMapInstance({ map, maps })}
          >
            {bookingData?.campaign?.spaces?.map(item => (
              <Marker
                key={item._id}
                lat={item.location?.latitude && Number(item.location.latitude)}
                lng={item.location?.longitude && Number(item.location.longitude)}
              />
            ))}
          </GoogleMapReact>
        </div>
        <p className="text-lg font-bold">Places in the campaign</p>
        <p className="text-sm font-light text-slate-400 mb-2">
          All the places been cover by this campaign
        </p>
        <div>
          {bookingData?.campaign?.spaces?.length ? (
            bookingData?.campaign?.spaces?.map(item => (
              <Places
                data={item}
                campaignId={bookingData?.campaign?._id}
                bookingId={bookingData?._id}
              />
            ))
          ) : (
            <div className="w-full min-h-[7rem] flex justify-center items-center">
              <p className="text-xl">No spaces found</p>
            </div>
          )}
        </div>
        {bookingData?.campaign?.spaces?.totalDocs > searchParams.get('limit') ? (
          <Pagination
            className="absolute bottom-0 right-10 gap-0"
            page={searchParams.get('page')}
            onChange={val => {
              searchParams.set('page', val);
              setSearchParams(searchParams);
            }}
            total={1}
            color="dark"
          />
        ) : null}
      </div>
    </>
  );
};

export default Overview;

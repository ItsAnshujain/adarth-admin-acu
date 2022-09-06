/* eslint-disable */
import { useState } from 'react';
import { Pagination } from '@mantine/core';
import CustomBadge from '../../shared/Badge';
import Places from './UI/Places';
import dummy0 from '../../../assets/unsplash.png';
import dummy1 from '../../../assets/dummy1.png';
import dummy2 from '../../../assets/dummy2.png';
import dummy3 from '../../../assets/dummy3.png';
import map from '../../../assets/mapplaceholder.png';
import toIndianCurrency from '../../../utils/currencyFormat';

const imageUrl = [dummy1, dummy2, dummy0, dummy2, dummy1, dummy0];
const dummyDataObj = {
  img: dummy1,
  status: 'Available',
  name: 'Open Digital Billboard',
  address: 'M G Road TOI Building Towards Brigade Road',
  cost: 230000,
  printing_status: 'Completed',
  mounting_status: 'In mountain',
  health_update: '90%',
  format_support: 'JPEG,PNG',
  ligting: 'Lighting',
  from_date: '02/12/2022',
  to_date: '02/12/2022',
  media: dummy3,
};

const dummyData = new Array(3).fill(dummyDataObj);

const Overview = () => {
  const [activePage, setPage] = useState(1);
  const [readMore, setReadMore] = useState(false);
  const [scrollImage, setScrollImage] = useState(imageUrl);
  const [posterImage, setPosterImage] = useState(dummy3);

  const exchangeImages = index => {
    const temp = posterImage;
    setPosterImage(scrollImage[index]);
    setScrollImage(prev => {
      const newImgs = [...prev];
      newImgs[index] = temp;
      return newImgs;
    });
  };

  return (
    <>
      <div className="flex gap-8 pt-4">
        <div className="flex-1 pl-5 max-w-1/2">
          <div className="flex flex-col">
            <div>
              <img className="w-full h-96 max-w-1/2" src={posterImage} alt="poster" />
            </div>
            <div className="flex overflow-scroll pt-4 gap-4 items-center">
              {scrollImage.map((src, index) => (
                <img
                  onClick={() => exchangeImages(index)}
                  className="h-24 w-28 cursor-pointer"
                  src={src}
                  alt="poster"
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 pr-7 max-w-1/2 gap-2">
          <p className="font-bold text-2xl mb-2">Bangalore Station Bill Board</p>
          <div>
            <p className="text-slate-400 font-light text-[14px]">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reiciendis laudantium
              officiis sunt temporibus est error non odit!{' '}
              {!readMore && (
                <button onClick={() => setReadMore(true)} type="button" className="text-purple-450">
                  Read more
                </button>
              )}
              {readMore && (
                <span>
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laborum molestias
                  perferendis aspernatur debitis pariatur dolores ipsa. Magni iusto, iure sapiente
                  numquam consequuntur est provident nihil id voluptas placeat reiciendis nostrum!
                  Pariatur temporibus et, suscipit unde impedit deleniti accusamus, possimus eos,
                  beatae id recusandae.
                </span>
              )}
            </p>
          </div>
          <div className="flex mt-4 items-center gap-2 ">
            <span>{toIndianCurrency(63667)}</span>
            <CustomBadge
              size="lg"
              text="497947947 Total Impressions"
              className="py-4 font-extralight bg-[#4B0DAF1A] capitalize "
            />
          </div>
          <div className="mt-8">
            <p>Specifications</p>
            <p className="text-slate-400 text-sm">All the details regarding the campaign</p>
            <div className="p-4 py-6 grid grid-cols-2 grid-rows-2 border rounded-md gap-y-4 mt-2">
              <div>
                <p className="text-slate-400 text-sm">Total Media</p>
                <p>15 hoarding, 3 digital screen</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Impressions</p>
                <p>38762874687</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Number of Locations</p>
                <p>867</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pl-5 pr-7 flex flex-col mt-16 mb-8">
        <p className="text-lg font-bold">Location Details</p>
        <p className="text-sm font-light text-slate-400">
          All the places been covered by this campaign
        </p>
        <div className="mt-1 mb-8">
          <img src={map} alt="map" />
        </div>

        <p className="text-lg font-bold">Places in the campaign</p>
        <p className="text-sm font-light text-slate-400 mb-2">
          All the places been cover by this campaign
        </p>
        <div>
          {dummyData.map(data => (
            <Places data={data} />
          ))}
        </div>
      </div>
      <Pagination
        className="absolute bottom-0 right-10 gap-0"
        page={activePage}
        onChange={setPage}
        total={1}
        color="dark"
      />
    </>
  );
};

export default Overview;

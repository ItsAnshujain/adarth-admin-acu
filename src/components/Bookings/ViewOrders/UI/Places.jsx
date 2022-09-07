import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'react-feather';
import CustomBadge from '../../../shared/Badge';
import toIndianCurrency from '../../../../utils/currencyFormat';
import upload from '../../../../assets/upload.svg';
import Carousel from './Carousel';

const Places = ({ data }) => {
  const [showMedia, setShowMedia] = useState(false);
  const [index, setIndex] = useState(0);

  const handlePrev = () => {
    setIndex(index - 1);
  };

  const handleNext = () => {
    setIndex(index + 1);
  };

  return (
    <div className="flex gap-4 p-4 shadow-md bg-white mb-2">
      <div>
        <img src={data.img} alt="logo" />
      </div>
      <div className="flex flex-col w-full">
        <div className="flex justify-between items-center w-full mb-2">
          <CustomBadge
            className="bg-green-200 text-green-700 tracking-wider"
            radius="lg"
            variant="filled"
            text={data.status}
            size="md"
          />

          <div className="flex gap-2 items-center">
            {!data.media ? (
              <button
                type="button"
                className="py-1 px-2 ml-1 h-[20%] flex items-center gap-2 border border-black rounded-md"
              >
                <span>Upload File</span>
                <img src={upload} alt="Upload" className="mr-1" />
              </button>
            ) : (
              <button
                onClick={() => setShowMedia(true)}
                type="button"
                className="py-1 px-2 ml-1 h-[20%] flex items-center gap-2 border bg-purple-350 text-white rounded-md"
              >
                <span>Show Uploaded Media</span>
              </button>
            )}
            {showMedia ? (
              <div
                aria-hidden
                onClick={() => setShowMedia(false)}
                className="absolute top-0 left-0 w-screen h-screen  bg-transparent flex justify-between items-center"
              >
                <button
                  className="disabled:cursor-not-allowed bg-red-300"
                  disabled={index === 0}
                  onClick={e => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  type="button"
                >
                  <ChevronLeft size={77} />
                </button>
                <Carousel photos={data.media} index={index} setIndex={setIndex} />
                <button
                  className="disabled:cursor-not-allowed bg-red-300"
                  disabled={index === 0}
                  onClick={e => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  type="button"
                >
                  <ChevronRight size={77} />
                </button>
              </div>
            ) : (
              ''
            )}

            <div className="flex gap-2 border p-2 rounded-md">
              <Calendar />
              <span> {data.from_date}</span>
            </div>
            <div className="flex gap-2 border p-2 rounded-md">
              <Calendar />
              <span>{data.to_date}</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4">
          <div>
            <p className="mb-2 font-bold">{data.name}</p>
            <p className="mb-2 text-sm font-light text-slate-400">{data.address}</p>
            <p className="font-bold">{toIndianCurrency(data.cost)}</p>
          </div>
          <div>
            <div className="mb-4">
              <p className="mb-2 text-sm font-light text-slate-400">Printing status</p>
              <p>{data.printing_status}</p>
            </div>
            <div>
              <p className="mb-2 text-sm font-light text-slate-400">Mounting Status</p>
              <p>{data.mounting_status}</p>
            </div>
          </div>
          <div>
            <div className="mb-4">
              <p className="mb-2 text-sm font-light text-slate-400">Health Update</p>
              <p>{data.health_update}</p>
            </div>
            <div>
              <p className="mb-2 text-sm font-light text-slate-400">Format Support</p>
              <p>{data.format_support}</p>
            </div>
          </div>
          <div>
            <div className="mb-4">
              <p className="mb-2 text-sm font-light text-slate-400">Lighting/Non Lighting</p>
              <p>{data.ligting}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Places;

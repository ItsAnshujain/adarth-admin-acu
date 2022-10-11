import { useState, useEffect } from 'react';
import { Button, Image, Text } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import dummy3 from '../../assets/dummy3.png';
import toIndianCurrency from '../../utils/currencyFormat';
import Badge from './Badge';
import { useFormContext } from '../../context/formContext';

const Preview = () => {
  const [readMore, toggle] = useToggle();
  const [scrollImage, setScrollImage] = useState([]);
  const [posterImage, setPosterImage] = useState(dummy3);
  const { values } = useFormContext();

  const exchangeImages = index => {
    const temp = posterImage;
    setPosterImage(scrollImage[index]);
    setScrollImage(prev => {
      const newImgs = [...prev];
      newImgs[index] = temp;
      return newImgs;
    });
  };

  useEffect(() => {
    setPosterImage(values?.basicInformation?.spacePhotos);
  }, [values?.basicInformation?.spacePhotos]);

  return (
    <div className="grid grid-cols-2 gap-x-8 pl-5 pr-7 pt-4">
      <div className="flex flex-col">
        <div className="h-96">
          {posterImage.length ? (
            <Image
              height={384}
              src={posterImage}
              alt="poster"
              fit="contain"
              withPlaceholder
              placeholder={
                <Text align="center">Unexpected error occured. Image cannot be loaded</Text>
              }
            />
          ) : (
            <Image height={384} src={null} alt="poster" fit="contain" withPlaceholder />
          )}
        </div>
        <div className="flex overflow-scroll pt-4 gap-4 items-center">
          {scrollImage.map((src, index) => (
            <img
              key={src}
              aria-hidden
              onClick={() => exchangeImages(index)}
              className="h-24 w-28 cursor-pointer"
              src={src}
              alt="poster"
            />
          ))}
        </div>
      </div>
      <div>
        <div className="flex-1 pr-7 max-w-1/2">
          <p className="text-lg font-bold">{values?.basicInformation?.spaceName || 'NA'}</p>
          <div>
            <div className="flex gap-2">
              <p className="font-bold text-xs text-purple-450">{'{category}'}</p>
            </div>
            <p className="font-light text-slate-400">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reiciendis laudantium
              officiis sunt temporibus est error non odit!{' '}
              {readMore && (
                <span>
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laborum molestias
                  perferendis aspernatur debitis pariatur dolores ipsa. Magni iusto, iure sapiente
                  numquam consequuntur est provident nihil id voluptas placeat reiciendis nostrum!
                  Pariatur temporibus et, suscipit unde impedit deleniti accusamus, possimus eos,
                  beatae id recusandae.
                </span>
              )}
              <Button onClick={() => toggle()} className="text-purple-450 font-medium p-0">
                {readMore ? 'Read less' : 'Read more'}
              </Button>
            </p>
            <div className="flex gap-3 items-center">
              <p className="font-bold my-2">
                {toIndianCurrency(values?.basicInformation?.price || 0)}
              </p>

              <Badge
                className="text-purple-450 bg-purple-100 capitalize"
                text={`${values?.specifications?.impressions?.max || 0}+ Total Impressions`}
                size="lg"
                variant="filled"
                radius="md"
              />
            </div>

            <div className="mt-4">
              <p className="mb-1">Specifications</p>
              <p className="text-slate-400 mb-2">All the related details regarding campaign</p>
              <div className="flex flex-col ">
                <div className="grid grid-cols-2 p-4 border rounded-md mb-4 flex-1">
                  <div>
                    <p className="text-slate-400 text-md font-light">Media Type</p>
                    <p className="mb-4">{'{mediaType}'}</p>

                    <p className="text-slate-400 text-md font-light">Resolution</p>
                    <p className="mb-4">
                      {values?.specifications?.resolutions?.height || 0}px X{' '}
                      {values?.specifications?.resolutions?.width || 0}px
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-md font-light">Illumination</p>
                    <p className="mb-4">{'{illumination}'}</p>
                    <p className="text-slate-400 text-md font-light">Unit</p>
                    <p className="mb-4">{values?.specifications?.unit}</p>
                    <p className="text-slate-400 text-md font-light">Supported Media</p>
                    <p>{values?.basicInformation?.supportedMedia || 'NA'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;

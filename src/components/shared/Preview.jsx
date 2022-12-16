import { useState, useEffect, useCallback } from 'react';
import { Badge, Button, Image, Text } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import toIndianCurrency from '../../utils/currencyFormat';
import { useFormContext } from '../../context/formContext';

const Preview = () => {
  const [readMore, toggle] = useToggle();
  const [otherImages, setOtherImages] = useState([]);
  const [posterImage, setPosterImage] = useState(null);
  const { values } = useFormContext();

  const exchangeImages = index => {
    const temp = posterImage;
    setPosterImage(otherImages[index]);
    setOtherImages(prev => {
      const newImgs = [...prev];
      newImgs[index] = temp;
      return newImgs;
    });
  };

  const renderBadges = useCallback(
    list =>
      list?.map(item => (
        <p key={item._id} className="pr-1 text-black">
          {item?.label},
        </p>
      )),
    [values?.specifications?.previousBrands, values?.specifications?.tags],
  );

  const renderColoredBadges = useCallback(
    list =>
      list?.map(item => (
        <Badge
          key={item?.value}
          className="text-purple-450 bg-purple-100 capitalize mr-3 my-2"
          size="lg"
          variant="filled"
          radius="sm"
        >
          {item?.label}
        </Badge>
      )),
    [values?.basicInformation?.audience],
  );

  useEffect(() => {
    setPosterImage(values?.basicInformation?.spacePhoto);

    if (values?.basicInformation?.otherPhotos) {
      setOtherImages([...values.basicInformation.otherPhotos]);
    }
  }, [values?.basicInformation?.spacePhoto, values?.basicInformation?.otherPhotos]);

  return (
    <div className="grid grid-cols-2 gap-x-8 pl-5 pt-4">
      <div className="flex flex-col">
        <div className="h-96">
          {posterImage ? (
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
        <div className="flex overflow-scroll pt-4 gap-4 items-center ">
          {otherImages.length > 0 && otherImages?.[0] !== ''
            ? otherImages.map((src, index) => (
                <Image
                  key={src}
                  onClick={() => exchangeImages(index)}
                  className="cursor-pointer bg-slate-300"
                  height={96}
                  width={112}
                  src={src}
                  fit="contain"
                  alt="poster"
                />
              ))
            : null}
        </div>
      </div>
      <div>
        <div className="flex-1 pr-7 max-w-1/2">
          <p className="text-lg font-bold">{values?.basicInformation?.spaceName || 'NA'}</p>
          <div>
            <div className="flex gap-2">
              <p className="font-bold text-xs text-purple-450">
                {values?.basicInformation?.category?.label}
              </p>
              <Text weight="bolder" size="xs">
                {values?.specifications?.spaceStatus?.label}
              </Text>
            </div>
            <p className="font-light text-slate-400">
              {values?.basicInformation?.description}
              <Button onClick={() => toggle()} className="text-purple-450 font-medium p-0">
                {readMore ? 'Read less' : 'Read more'}
              </Button>
            </p>
            <div className="flex gap-3 items-center">
              <p className="font-bold my-2">
                {values?.basicInformation?.price
                  ? toIndianCurrency(parseInt(values.basicInformation.price, 10))
                  : 0}
              </p>
              <Badge
                className="text-purple-450 bg-purple-100 capitalize"
                size="lg"
                variant="filled"
                radius="md"
              >
                {`${values?.specifications?.impressions?.min || 0}+ Total Impressions`}
              </Badge>
            </div>
            {values?.basicInformation?.audience?.length
              ? renderColoredBadges(values?.basicInformation?.audience)
              : null}
            <div className="mb-2">
              <p className="text-slate-400">Previously advertised brands</p>
              {values?.specifications?.previousBrands?.length ? (
                <div className="flex w-full flex-wrap">
                  {renderBadges(values?.specifications?.previousBrands)}
                </div>
              ) : null}
            </div>
            <div className="mb-2">
              <p className="text-slate-400">Previously advertised tags</p>
              {values?.specifications?.tags?.length ? (
                <div className="flex w-full flex-wrap">
                  {renderBadges(values?.specifications?.tags)}
                </div>
              ) : null}
            </div>
            <div>
              <p className="text-slate-400">Demographics</p>
              <div className="flex w-full flex-wrap">
                {values?.basicInformation?.demographic?.label || 'NA'}
              </div>
            </div>
            <div className="mt-3">
              <p className="mb-1">Specifications</p>
              <p className="text-slate-400 mb-2">All the related details regarding campaign</p>
              <div className="flex flex-col ">
                <div className="grid grid-cols-2 p-4 border rounded-md mb-4 flex-1">
                  <div>
                    <p className="text-slate-400 text-md font-light">Media Type</p>
                    <p className="mb-4">{values?.basicInformation?.mediaType?.label}</p>

                    <p className="text-slate-400 text-md font-light">Size</p>
                    <p className="mb-4">
                      {values?.specifications?.size?.height || 0}ft X{' '}
                      {values?.specifications?.size?.width || 0}ft
                    </p>
                    <p className=" text-slate-400 text-md font-light">Impressions</p>
                    <p className="mb-4">{values?.specifications?.impressions?.min || 'NA'}</p>
                    <p className="text-slate-400 text-md font-light">Resolution</p>
                    <p>{values?.specifications?.resolutions || 'NA'}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-md font-light">Illumination</p>
                    <p className="mb-4">{values?.specifications?.illuminations?.label}</p>
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

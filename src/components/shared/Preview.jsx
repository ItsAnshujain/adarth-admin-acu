import { useState, useEffect, useCallback } from 'react';
import { Badge, Button, Image, Text, BackgroundImage, Center } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { v4 as uuidv4 } from 'uuid';
import toIndianCurrency from '../../utils/currencyFormat';
import { useFormContext } from '../../context/formContext';

const Preview = () => {
  const [readMore, toggle] = useToggle();
  const { values } = useFormContext();
  const [previewSpacesPhotos, setPreviewSpacesPhotos] = useState([]);

  const getAllSpacePhotos = useCallback(() => {
    const tempPics = [];

    if (values?.basicInformation?.spacePhoto) tempPics.push(values.basicInformation.spacePhoto);
    if (values?.basicInformation?.otherPhotos)
      tempPics.push(...values.basicInformation.otherPhotos);

    return tempPics;
  }, [values]);

  const renderBadges = useCallback(
    list =>
      list?.map((item, index) => (
        <p key={item._id} className="pr-1 text-black">
          {item?.label}
          {list.length !== index + 1 && ','}
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
    const result = getAllSpacePhotos();
    setPreviewSpacesPhotos(result);
  }, [values]);

  return (
    <div className="grid grid-cols-2 pl-5 pt-4">
      <div className="flex flex-1 flex-col max-w-[500px]">
        <div className="flex flex-row flex-wrap justify-start">
          {previewSpacesPhotos?.map(
            (src, index) =>
              index < 4 && (
                <div key={uuidv4()} className="mr-2 mb-4 border-[1px] border-gray">
                  <Image
                    className="bg-slate-100"
                    height={index === 0 ? 300 : 96}
                    width={index === 0 ? 500 : 112}
                    src={src}
                    fit="contain"
                    alt="poster"
                  />
                </div>
              ),
          )}
          {previewSpacesPhotos?.length > 4 && (
            <div className="border-[1px] border-gray mr-2 mb-4">
              <BackgroundImage src={previewSpacesPhotos[4]} className="w-[112px] h-[96px]">
                <Center className="h-full">
                  <Text weight="bold" color="white" className="mix-blend-difference">
                    +{previewSpacesPhotos.length - 4} more
                  </Text>
                </Center>
              </BackgroundImage>
            </div>
          )}
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
                {`${values?.specifications?.impressions?.max || 0}+ Total Impressions`}
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
                    <p className="mb-4">{values?.specifications?.impressions?.max || 'NA'}</p>
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

import { Carousel, useAnimationOffsetEffect } from '@mantine/carousel';
import { BackgroundImage, Center, Image, Skeleton, Text } from '@mantine/core';
import { useModals } from '@mantine/modals';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { useEffect, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChevronLeft, ChevronRight } from 'react-feather';
import toIndianCurrency from '../../../utils/currencyFormat';
import modalConfig from '../../../utils/modalConfig';

const DATE_FORMAT = 'DD MMM YYYY';
const TRANSITION_DURATION = 200;
const updatedModalConfig = { ...modalConfig, size: 'xl' };

const SkeletonTopWrapper = () => (
  <div className="flex flex-row justify-between gap-2">
    <Skeleton height={200} mb="md" />
    <Skeleton height={200} />
  </div>
);

const Details = ({ proposalData, isProposalDataLoading, inventoryData }) => {
  const modals = useModals();
  const [previewSpacesPhotos, setPreviewSpacesPhotos] = useState([]);
  const [embla, setEmbla] = useState(null);

  useAnimationOffsetEffect(embla, TRANSITION_DURATION);

  const getAllSpacePhotos = useCallback(() => {
    const tempPics = [];
    const tempArr = inventoryData;
    tempArr?.docs?.map(item => {
      if (item?.spacePhoto) tempPics.push(item.spacePhoto);
      if (item?.otherPhotos) tempPics.push(...item.otherPhotos);
      return tempPics;
    });

    return tempPics;
  }, [inventoryData]);

  const toggleImagePreviewModal = imgIndex =>
    modals.openContextModal('basic', {
      title: 'Preview',
      innerProps: {
        modalBody: (
          <Carousel
            align="center"
            height={400}
            className="px-3"
            loop
            mx="auto"
            withControls={previewSpacesPhotos.length > 0}
            slideGap="lg"
            controlsOffset="lg"
            initialSlide={imgIndex}
            nextControlIcon={<ChevronRight size={40} className="bg-white rounded-full" />}
            previousControlIcon={<ChevronLeft size={40} className="bg-white rounded-full" />}
            classNames={{ indicator: 'bg-white-200' }}
            getEmblaApi={setEmbla}
          >
            {previewSpacesPhotos.length &&
              previewSpacesPhotos.map(item => (
                <Carousel.Slide>
                  <Image src={item} height={400} width="100%" alt="preview" fit="contain" />
                </Carousel.Slide>
              ))}
          </Carousel>
        ),
      },
      ...updatedModalConfig,
    });

  useEffect(() => {
    const result = getAllSpacePhotos();
    setPreviewSpacesPhotos(result);
  }, [inventoryData]);

  return (
    <div className="mt-4 pl-5 pr-7">
      <Text size="xl" weight="bold">
        Proposal Details
      </Text>
      {isProposalDataLoading ? (
        <SkeletonTopWrapper />
      ) : (
        <div className="mt-2 flex flex-col gap-4">
          <div
            className={classNames(
              'grid gap-3 auto-cols-min',
              previewSpacesPhotos?.length ? 'grid-cols-2' : 'grid-cols-1',
            )}
          >
            <div className="flex flex-1 flex-col">
              <div className="flex flex-row flex-wrap justify-start">
                {previewSpacesPhotos?.map(
                  (src, index) =>
                    index < 4 && (
                      <Image
                        key={uuidv4()}
                        className="mr-2 mb-4 border-[1px] border-gray bg-slate-100 cursor-zoom-in"
                        height={index === 0 ? 300 : 96}
                        width={index === 0 ? '100%' : 112}
                        src={src}
                        fit="cover"
                        alt="poster"
                        onClick={() => toggleImagePreviewModal(index)}
                      />
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
            <div className="border p-5 h-fit">
              <Text weight="bold" className="capitalize">
                {proposalData?.name}
              </Text>
              <div className="grid grid-cols-3 mb-3">
                <div className="col-span-1">
                  <Text color="grey" weight="400">
                    Total Spaces
                  </Text>
                  <Text weight="bolder">{proposalData?.totalSpaces || 0}</Text>
                </div>
                <div>
                  <Text color="grey" weight="400">
                    Expected Impressions
                  </Text>
                  <Text weight="bolder">{proposalData?.totalImpression || 0}</Text>
                </div>
              </div>
              <div className="grid grid-cols-3 mb-3">
                <div className="col-span-1">
                  <Text color="grey" weight="400">
                    Price
                  </Text>
                  <Text weight="bolder">
                    {proposalData?.price ? toIndianCurrency(proposalData.price) : 0}
                  </Text>
                </div>
                <div>
                  <Text color="grey" weight="400">
                    Total Cities
                  </Text>
                  <Text weight="bolder">{proposalData?.totalCities || 0}</Text>
                </div>
              </div>
              <div className="grid grid-cols-3 mb-3">
                <div>
                  <Text color="grey" weight="400">
                    Overall Start Date
                  </Text>
                  <Text weight="bolder">
                    {proposalData?.startDate
                      ? dayjs(proposalData.startDate).format(DATE_FORMAT)
                      : 'NA'}
                  </Text>
                </div>
                <div>
                  <Text color="grey" weight="400">
                    Overall End Date
                  </Text>
                  <Text weight="bolder">
                    {proposalData?.endDate ? dayjs(proposalData.endDate).format(DATE_FORMAT) : 'NA'}
                  </Text>
                </div>
              </div>
              <div className="grid grid-cols-1">
                <div>
                  <Text color="grey" weight="400">
                    Description
                  </Text>
                  <Text weight="bolder">
                    {proposalData?.description
                      ? proposalData.description
                      : `Our outdoor advertisementcampaign is the perfect way to get your brand in front of a large audience. 
                        With eye-catching graphics and strategic placement, our billboards and digital displays will capture the attention of anyone passing by. 
                        Our team will work with you to create a curated campaign that perfectly showcases your brand's message and identity.
                         From busy city streets to suburban highways, our outdoor advertising options are the perfect way to increase your brand's visibility and reach.
                       Don't miss out on the opportunity to make a lasting impression with your target audience.`}
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Details;

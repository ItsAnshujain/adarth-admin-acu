import { Carousel, useAnimationOffsetEffect } from '@mantine/carousel';
import { useModals } from '@mantine/modals';
import { Image } from '@mantine/core';
import { ChevronRight, ChevronLeft } from 'react-feather';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import modalConfig from '../../../utils/modalConfig';
import ImageCard from './ImageCard';

const TRANSITION_DURATION = 200;
const updatedModalConfig = { ...modalConfig, size: 'xl' };

const ImagesList = ({ imagesData, selectedImages, setSelectedImages }) => {
  const modals = useModals();
  const [embla, setEmbla] = useState(null);
  useAnimationOffsetEffect(embla, TRANSITION_DURATION);

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
            withControls={imagesData?.length > 0}
            slideGap="lg"
            controlsOffset="lg"
            initialSlide={imgIndex}
            nextControlIcon={<ChevronRight size={40} className="bg-white rounded-full" />}
            previousControlIcon={<ChevronLeft size={40} className="bg-white rounded-full" />}
            classNames={{ indicator: 'bg-white-200' }}
            getEmblaApi={setEmbla}
          >
            {imagesData?.length &&
              imagesData?.map(item => (
                <Carousel.Slide key={uuidv4()}>
                  <Image src={item.url} height={400} width="100%" alt="preview" fit="contain" />
                </Carousel.Slide>
              ))}
          </Carousel>
        ),
      },
      ...updatedModalConfig,
    });
  return (
    <div className="grid grid-cols-5 gap-2">
      {imagesData?.map((image, idx) => (
        <ImageCard
          key={uuidv4()}
          image={image}
          selectedImages={selectedImages}
          setSelectedImages={setSelectedImages}
          checked={selectedImages.some(img => img._id === image._id)}
          onClick={() => toggleImagePreviewModal(idx)}
        />
      ))}
    </div>
  );
};

export default ImagesList;

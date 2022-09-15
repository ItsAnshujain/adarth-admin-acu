import { useState } from 'react';
import { Text } from '@mantine/core';
import dummy0 from '../../assets/unsplash.png';
import dummy1 from '../../assets/dummy1.png';
import dummy2 from '../../assets/dummy2.png';
import dummy3 from '../../assets/dummy3.png';
import toIndianCurrency from '../../utils/currencyFormat';
import Badge from './Badge';

const imageUrl = [dummy1, dummy2, dummy0, dummy2, dummy1, dummy0];
const Preview = () => {
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
    <div className="grid grid-cols-2 gap-x-8 pl-5 pr-7 pt-4">
      <div className="flex flex-col">
        <div>
          <img className="w-full h-96 max-w-1/2" src={posterImage} alt="poster" />
        </div>
        <div className="flex overflow-scroll pt-4 gap-4 items-center">
          {scrollImage.map((src, index) => (
            <img
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
          <Text size="lg" weight="bolder">
            Bangalore Station Bill Board
          </Text>
          <div>
            <div className="flex gap-2">
              <Text weight="bolder" size="xs" className="text-purple-450">
                Billboard
              </Text>
              <Text weight="bolder" size="xs">
                Premium Site
              </Text>
            </div>
            <Text weight="300" color="gray">
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
            </Text>
            <div className="flex gap-3 items-center">
              <Text weight="bold" className="my-2">
                {toIndianCurrency(270000)}
              </Text>

              <Badge
                className="text-purple-450 bg-purple-100 capitalize"
                text="1000+ Total Impressions"
                size="lg"
                variant="filled"
                radius="md"
              />
            </div>

            <div className="mt-12">
              <Text>Specifications</Text>
              <Text color="gray" className="mb-2">
                All the related details regarding campaign
              </Text>
              <div className="flex flex-col ">
                <div className="grid grid-cols-2 p-4 border rounded-md mb-4 flex-1">
                  <div>
                    <Text color="gray" size="md" weight="300">
                      Media Type
                    </Text>
                    <Text className="mb-4">Bill Board</Text>
                    <Text color="gray" size="md" weight="300">
                      Size
                    </Text>
                    <Text className="mb-4">W X H</Text>

                    <Text color="gray" size="md" weight="300">
                      Resolution
                    </Text>
                    <Text>1080px</Text>
                  </div>
                  <div>
                    <Text color="gray" size="md" weight="300">
                      Illumination
                    </Text>
                    <Text className="mb-4">Lit</Text>
                    <Text color="gray" size="md" weight="300">
                      Unit
                    </Text>
                    <Text className="mb-4">1</Text>
                    <Text color="gray" size="md" weight="300">
                      Supported Media
                    </Text>
                    <Text>MPR</Text>
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

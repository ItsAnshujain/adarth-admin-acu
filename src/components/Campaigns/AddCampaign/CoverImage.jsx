import { Box, Image, Text } from '@mantine/core';
import classNames from 'classnames';
import { useFormContext } from '../../../context/formContext';

const CoverImage = () => {
  const { values, setFieldValue } = useFormContext();

  const handleClick = (img, thumbnailId) => {
    setFieldValue('thumbnailId', thumbnailId);
    setFieldValue('thumbnail', img);
  };

  return (
    <div className="pl-5 pr-7 mt-4 flex flex-col gap-y-4 relative mb-16">
      <Text weight="bold" className="font-sans">
        Select Thumbnail image
      </Text>
      <Text size="sm" className="text-gray-400 font-sans font-medium">
        Please fill the form with valid information,this specification details will help the
        customer
      </Text>
      <div className="grid grid-cols-4 gap-4">
        {values?.place?.map(placeItem => (
          <Box
            key={placeItem?._id}
            onClick={() => handleClick(placeItem.photo, placeItem._id)}
            className={classNames(
              'p-4 flex flex-col gap-y-4 border',
              values?.thumbnailId === placeItem._id ? 'border-purple-450' : '',
            )}
          >
            <div className="">
              {placeItem?.photo ? (
                <Image
                  height={200}
                  src={placeItem.photo}
                  alt="poster"
                  fit="cover"
                  withPlaceholder
                  placeholder={
                    <Text align="center">Unexpected error occured. Image cannot be loaded</Text>
                  }
                />
              ) : (
                <Image height={200} src={null} alt="poster" fit="contain" withPlaceholder />
              )}
            </div>
            <Text weight="bold">{placeItem?.space_name}</Text>
            <Text className="mb-2" weight="200">
              {placeItem?.location?.address}, {placeItem?.location?.zip}
            </Text>
          </Box>
        ))}
      </div>
    </div>
  );
};

export default CoverImage;

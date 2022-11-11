import { Text } from '@mantine/core';
import classNames from 'classnames';
import dummya from '../../../assets/dummya.png';
import dummyb from '../../../assets/dummyb.png';
import dummyc from '../../../assets/dummyc.png';
import dummyd from '../../../assets/dummyd.png';
import dummye from '../../../assets/dummye.png';
import dummyf from '../../../assets/dummyf.png';
import { useFormContext } from '../../../context/formContext';

const IMAGES = [dummya, dummyb, dummyc, dummyd, dummye, dummyf];

const CoverImage = () => {
  const { values, setFieldValue } = useFormContext();

  const handleClick = img => {
    setFieldValue('thumbnail', values.thumbnail === img ? '' : img);
  };

  return (
    <div className="pl-5 pr-7 mt-4 flex flex-col gap-y-4 relative mb-16">
      <Text weight="bold">Select Thumbnail Image</Text>
      <Text size="sm">
        Please fill the form with valid information,this specification details will help the
        customer
      </Text>
      <div className="flex gap-8 flex-wrap mb-8">
        {IMAGES.map(images => (
          <div
            key={images}
            aria-hidden
            onClick={() => handleClick(images)}
            className={classNames(
              `p-4 flex flex-col gap-y-4 border ${
                values.thumbnail === images ? 'border-purple-450' : ''
              } `,
            )}
          >
            <img key={images} src={images} alt="thumbnail" />
            <Text weight="bold">Billboard mg road, market</Text>
            <Text className="mb-2" weight="200">
              32 mg road Kolkata, near ac market
            </Text>
          </div>
        ))}
      </div>
      {/* <Pagination className="absolute right-14 -bottom-4 " total={8} /> */}
    </div>
  );
};

export default CoverImage;

/* eslint-disable */
import { Text, Pagination } from '@mantine/core';
import classNames from 'classnames';
import { useState } from 'react';
import dummya from '../../../assets/dummya.png';
import dummyb from '../../../assets/dummyb.png';
import dummyc from '../../../assets/dummyc.png';
import dummyd from '../../../assets/dummyd.png';
import dummye from '../../../assets/dummye.png';
import dummyf from '../../../assets/dummyf.png';

const IMAGES = [dummya, dummyb, dummyc, dummyd, dummye, dummyf];
const initialState = new Array(IMAGES.length).fill(false);

const CoverImage = () => {
  const [checkbox, setCheckbox] = useState(initialState);
  const handleClick = index => {
    setCheckbox(prev => {
      const newState = [...prev];
      newState[index] = !prev[index];
      return newState;
    });
  };
  return (
    <div className="pl-5 pr-7 mt-4 flex flex-col gap-y-4 relative mb-16">
      <Text weight="bold">Select Thumbnail Image</Text>
      <Text size="sm">
        Please fill the form with valid information,this specification details will help the
        customer
      </Text>
      <div className="flex gap-8 flex-wrap mb-8">
        {IMAGES.map((images, index) => (
          <div
            onClick={() => handleClick(index)}
            className={classNames(
              `p-4 flex flex-col gap-y-4 border ${checkbox[index] ? 'border-purple-450' : ''} `,
            )}
          >
            <img key={Math.random() * 1000000000000} src={images} alt="thumbnail" />
            <Text weight="bold">Billboard mg road, market</Text>
            <Text className="mb-2" weight="200">
              32 mg road Kolkata, near ac market
            </Text>
          </div>
        ))}
      </div>
      <Pagination className="absolute right-14 -bottom-4 " total={8} />
    </div>
  );
};

export default CoverImage;

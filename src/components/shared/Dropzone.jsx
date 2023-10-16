import React from 'react';
import { Dropzone } from '@mantine/dropzone';
import { Image } from '@mantine/core';
import image from '../../assets/image.png';
import { useFormContext } from '../../context/formContext';

const DropzoneComponent = ({ isLoading, onDrop, name, addExtraContent }) => {
  const { getInputProps } = useFormContext();

  return (
    <Dropzone
      onDrop={onDrop}
      accept={['image/png', 'image/jpeg']}
      className="h-full w-full flex justify-center items-center bg-slate-100"
      loading={isLoading}
      name={name}
      multiple={false}
      {...getInputProps(name)}
    >
      <div className="flex items-center justify-center">
        <Image src={image} alt="placeholder" height={50} width={50} />
      </div>
      {addExtraContent}
    </Dropzone>
  );
};

export default DropzoneComponent;

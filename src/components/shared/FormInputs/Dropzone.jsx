import React, { useMemo, useState } from 'react';
import { AspectRatio, Image, Text } from '@mantine/core';
import { Dropzone as MantineDropzone } from '@mantine/dropzone';

const Dropzone = ({ multiple = false, value, onChange, error, ...props }) => {
  const [files, setFiles] = useState([]);

  const preview = useMemo(() => {
    if (!files.length) return null;

    const imageUrl = URL.createObjectURL(files[0]);

    return (
      <Image
        src={imageUrl}
        alt="preview"
        imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
      />
    );
  }, [files]);

  const handleFileDrop = droppedFiles => {
    setFiles(droppedFiles);

    if (multiple === true) onChange?.(droppedFiles);
    else onChange?.(droppedFiles[0]);
  };

  React.useEffect(() => {
    setFiles(() => {
      if (!value) return [];

      if (Array.isArray(value)) return value;

      return [value];
    });
  }, [value]);

  return (
    <MantineDropzone
      onDrop={handleFileDrop}
      className="min-h-[100px] min-w-[100px]"
      maxSize={5 * 1024 ** 2} // 5 MB
      multiple={false}
      {...props}
      //   accept="image/png,image/jpeg"
      //   resetRef={ref}
    >
      <AspectRatio ratio={1024 / 1024} sx={{ maxWidth: 180 }} mx="auto">
        <div>
          {files.length ? preview : <Image src={null} alt="placeholder" withPlaceholder />}
          <Text className="text-red-450">{error}</Text>
        </div>
      </AspectRatio>
    </MantineDropzone>
  );
};

export default Dropzone;

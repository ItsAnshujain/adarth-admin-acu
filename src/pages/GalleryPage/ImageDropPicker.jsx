import React from 'react';
import { Dropzone } from '@mantine/dropzone';
import { Indicator, Image, useMantineTheme, ActionIcon } from '@mantine/core';
import { IconBan, IconCircleCheck, IconFile, IconPhoto, IconX } from '@tabler/icons';
import classNames from 'classnames';

const ImageDropPicker = ({
  multiple = true,
  value,
  onChange,
  error,
  imgUrl,
  onRemoveImage,
  label = 'Drag and drop the files directly into the upload area or',
  description = '(JPEG, JPG, PNG)',
  type = 'image',
  required,
  ...props
}) => {
  const theme = useMantineTheme();

  const [files, setFiles] = React.useState([]);
  const preview = React.useMemo(() => {
    if (!files.length && !imgUrl) return null;

    if (multiple)
      return (
        <div className="flex flex-col justify-center w-full text-center items-center h-full">
          <IconPhoto size={55} strokeWidth={1.5} className="text-gray-500" />
          <div className="border px-2 py-1 rounded-md flex items-center gap-3">
            <div className="font-normal">{files.length} images selected</div>
            <ActionIcon
              onClick={e => {
                e.stopPropagation();

                setFiles([]);
                onRemoveImage?.();
              }}
            >
              <IconX size={20} color="black" />
            </ActionIcon>
          </div>
        </div>
      );

    if (!files.length && imgUrl) {
      return (
        <Image width="100%" height={150} className="object-contain" src={imgUrl} alt="preview" />
      );
    }
    const imageUrl = URL.createObjectURL(files[0]);
    return (
      <Indicator
        size={16}
        color="white"
        label={
          <IconX
            size={20}
            className="text-black"
            onClick={e => {
              e.stopPropagation();

              setFiles([]);
              onRemoveImage?.();
            }}
          />
        }
      >
        <Image
          width="100%"
          height={150}
          className="object-contain"
          src={imageUrl}
          alt="preview"
          imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
        />
      </Indicator>
    );
  }, [files, imgUrl, multiple, onRemoveImage]);

  React.useEffect(() => {
    if (value) {
      setFiles(Array.isArray(value) ? value : [value]);
    }
  }, [value]);

  const handleFileDrop = droppedFiles => {
    setFiles(droppedFiles);

    if (multiple === true) onChange?.(droppedFiles);
    else onChange?.(droppedFiles[0]);
  };

  return (
    <Dropzone
      onDrop={handleFileDrop}
      maxSize={30 * 1024 ** 2} // 10 MB
      accept={['image/png', 'image/jpeg', 'image/jpg']}
      styles={{ inner: { pointerEvents: 'all' } }}
      className={classNames(error && 'border-red-400')}
      {...props}
      maxFiles={30}
    >
      <div className="w-auto h-96 items-center">
        <Dropzone.Accept>
          <IconCircleCheck size={34} color={theme.colors.green[7]} />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconBan size={34} color={theme.colors.red[5]} />
        </Dropzone.Reject>
        <Dropzone.Idle>
          {files.length > 0 || imgUrl ? (
            preview
          ) : (
            <div className="flex flex-col gap-2 items-center h-full justify-center">
              {type === 'file' ? (
                <IconFile size={55} strokeWidth={1.5} className="text-gray-500" />
              ) : (
                <IconPhoto size={55} strokeWidth={1.5} className="text-gray-500" />
              )}
              <div>
                <p className="text-lg font-medium mb-1">
                  {label} <span className="text-purple-450">browse</span>
                  {required ? <span className="text-red-500">*</span> : ''}
                </p>
                <p className="text-base text-gray-500 text-center">{description}</p>
              </div>
            </div>
          )}
        </Dropzone.Idle>
        <p className="text-xs text-red-500">{error}</p>
      </div>
      {imgUrl ? (
        <p className="text-xs text-gray-500 mt-3">
          To add new image, click on the dropzone to open the image selection dialog
        </p>
      ) : null}
    </Dropzone>
  );
};

export default ImageDropPicker;

import { Button, Image, Text } from '@mantine/core';
import { useState } from 'react';
import { ChevronDown } from 'react-feather';
import { Dropzone } from '@mantine/dropzone';
import TextareaInput from '../../shared/TextareaInput';
import DatePicker from '../../shared/DatePicker';
import { useFormContext } from '../../../context/formContext';
import TextInput from '../../shared/TextInput';
import { serialize } from '../../../utils';
import { useFetchMasters } from '../../../hooks/masters.hooks';
import NativeSelect from '../../shared/NativeSelect';
import image from '../../../assets/image.png';
import { useUploadFile } from '../../../hooks/upload.hooks';

const nativeSelectStyles = {
  rightSection: { pointerEvents: 'none' },
  label: {
    marginBottom: '4px',
    fontWeight: 700,
    fontSize: '15px',
    letterSpacing: '0.5px',
  },
};

const styles = {
  label: {
    marginBottom: '4px',
    fontWeight: 700,
    fontSize: '15px',
    letterSpacing: '0.5px',
  },
};

const BasicInfo = ({ proposalId }) => {
  const [showNotesOne, setShowNotesOne] = useState(false);
  const [showNotesTwo, setShowNotesTwo] = useState(false);
  const { values, errors, getInputProps, setFieldValue } = useFormContext();
  const { mutateAsync: upload, isLoading } = useUploadFile();

  const { data: proposalStatusData, isLoading: isProposalStatusLoading } = useFetchMasters(
    serialize({ type: 'proposal_status', parentId: null, limit: 100 }),
  );

  const onHandleDrop = async params => {
    const formData = new FormData();
    formData.append('files', params?.[0]);
    const res = await upload(formData);
    setFieldValue('image', res?.[0].Location);
  };

  return (
    <div className="flex gap-4 pt-4 flex-col pl-5 pr-7">
      <Text size="md" weight="bold">
        Basic Information
      </Text>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xl font-bold">Photo</p>

          <div className="h-[410px] mb-4">
            <Dropzone
              onDrop={onHandleDrop}
              accept={['image/png', 'image/jpeg']}
              className="h-full w-full flex justify-center items-center bg-slate-100"
              loading={isLoading}
              name="image"
              multiple={false}
              {...getInputProps('image')}
            >
              <div className="flex items-center justify-center">
                <Image src={image} alt="placeholder" height={50} width={50} />
              </div>
              <p>
                Drag and Drop your files here,or{' '}
                <span className="text-purple-450 border-none">browse</span>
              </p>
              <p className="text-gray-400 text-center">Supported png format only</p>
            </Dropzone>
          </div>
          {values?.image ? (
            <Image
              src={values?.image}
              alt="proposal-preview"
              height={400}
              className="bg-slate-300"
              placeholder={
                <Text align="center">Unexpected error occured. Image cannot be loaded</Text>
              }
            />
          ) : null}
        </div>
        <div className="row-span-2">
          <TextInput
            label="Proposal Name"
            name="name"
            styles={styles}
            errors={errors}
            className="mb-7"
            placeholder="Write..."
          />
          <div className="grid grid-cols-2 gap-4 mb-7">
            <DatePicker
              label="Start Date"
              name="startDate"
              placeholder="DD/MM/YYYY"
              minDate={new Date()}
              styles={styles}
              errors={errors}
            />
            <DatePicker
              label="End Date"
              name="endDate"
              placeholder="DD/MM/YYYY"
              minDate={new Date()}
              styles={styles}
              errors={errors}
            />
          </div>
          {proposalId ? (
            <NativeSelect
              label="Status"
              name="status"
              data={
                proposalStatusData?.docs?.map(item => ({
                  label: item?.name,
                  value: item?._id,
                })) || []
              }
              styles={nativeSelectStyles}
              rightSection={<ChevronDown size={16} className="mt-[1px] mr-1" />}
              rightSectionWidth={40}
              disabled={isProposalStatusLoading}
              className="mb-7"
            />
          ) : null}
          <TextareaInput
            label="Description"
            name="description"
            styles={styles}
            errors={errors}
            maxLength={200}
            placeholder="Maximum 200 characters"
            className="mb-7"
          />
          <div>
            <Text size="sm" weight="bold">
              Notes
            </Text>
            <Text size="sm">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto maxime distinctio,
              dicta consequatur ea at veniam illum,
              {showNotesOne ? (
                'qui totam esse eligendi repellendus laboriosam harum praesentium quidem minus expedita ut similique!'
              ) : (
                <Button
                  className="text-purple-450 font-normal px-1"
                  onClick={() => setShowNotesOne(true)}
                >
                  Read More
                </Button>
              )}
            </Text>
            <Text size="sm">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut, atque in? Odit, alias
              dolores vero porro asperiores rerum
              {showNotesTwo ? (
                'qui totam esse eligendi repellendus laboriosam harum praesentium quidem minus expedita ut similique!'
              ) : (
                <Button
                  className="text-purple-450 font-normal px-1"
                  onClick={() => setShowNotesTwo(true)}
                >
                  Read More
                </Button>
              )}
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;

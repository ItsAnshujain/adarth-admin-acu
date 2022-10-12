import { Button, Text } from '@mantine/core';
import { useState } from 'react';
import TextareaInput from '../../shared/TextareaInput';
import DatePicker from '../../shared/DatePicker';
import { useFormContext } from '../../../context/formContext';
import TextInput from '../../shared/TextInput';

const styles = {
  label: {
    marginBottom: '4px',
    fontWeight: 700,
    fontSize: '15px',
    letterSpacing: '0.5px',
  },
};

const BasicInfo = () => {
  const [showNotesOne, setShowNotesOne] = useState(false);
  const [showNotesTwo, setShowNotesTwo] = useState(false);
  const { errors } = useFormContext();

  return (
    <div className="flex gap-4 pt-4 flex-col pl-5 pr-7">
      <Text size="md" weight="bold">
        Basic Information
      </Text>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <TextInput
            label="Proposal Name"
            name="name"
            styles={styles}
            errors={errors}
            className="mb-7"
            placeholder="Write..."
          />
          <div className="grid grid-cols-2 gap-4 ">
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
        </div>
        <div className="row-span-2">
          <TextareaInput
            label="Description"
            name="description"
            styles={styles}
            errors={errors}
            maxLength={200}
            placeholder="Maximum 200 characters"
          />
        </div>
      </div>
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
  );
};

export default BasicInfo;

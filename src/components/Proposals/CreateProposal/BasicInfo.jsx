import { Text, TextInput, Textarea } from '@mantine/core';
import { DatePicker } from '@mantine/dates';

const textAreaStyles = () => ({
  label: {
    fontWeight: 'bold',
  },
  input: {
    height: '127px',
  },
});

const BasicInfo = () => (
  <div className="flex gap-4 pt-4 flex-col pl-5 pr-7">
    <Text size="md" weight="bold">
      Basic Information
    </Text>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <TextInput name="spacename" placeholder="Write" className="mb-7" label="Proposal Name" />
        <TextInput name="spacename" placeholder="Write" className="mb-7" label="Price" />
      </div>
      <div className="row-span-2">
        <Textarea
          styles={textAreaStyles}
          name="spacename"
          placeholder="Write"
          label="Description"
        />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4 w-1/2">
      <DatePicker label="Start Date" placeholder="DD/MM/YYYY" />
      <DatePicker label="End Date" placeholder="DD/MM/YYYY" />
    </div>
    <div>
      <Text size="sm" weight="bold">
        Notes
      </Text>
      <Text size="sm">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto maxime distinctio, dicta
        consequatur ea at veniam illum, qui totam esse eligendi repellendus laboriosam harum
        praesentium quidem minus expedita ut similique!
      </Text>
      <Text size="sm">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut, atque in? Odit, alias dolores
        vero porro asperiores rerum expedita accusantium, aut maxime animi aperiam nesciunt
        voluptatem doloribus debitis eveniet excepturi?
      </Text>
    </div>
  </div>
);

export default BasicInfo;

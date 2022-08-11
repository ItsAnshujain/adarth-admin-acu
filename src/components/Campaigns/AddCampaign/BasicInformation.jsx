import { useState } from 'react';
import { Text, TextInput, Textarea, Checkbox, MultiSelect, RangeSlider } from '@mantine/core';

const data = [
  { value: 'react', label: 'React' },
  { value: 'ng', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'vue', label: 'Vue' },
  { value: 'riot', label: 'Riot' },
  { value: 'next', label: 'Next.js' },
  { value: 'blitz', label: 'Blitz.js' },
];

const styles = {
  label: {
    marginBottom: '10px',
    fontWeight: 'bold',
  },
};

const textAreaStyles = {
  label: {
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  input: {
    height: '127px',
  },
};

const sliderStyle = {
  bar: {
    backgroundColor: 'black',
  },
  thumb: {
    backgroundColor: 'black',
    border: 'black',
  },
};

const multiSelectStyles = {
  label: {
    marginBottom: '10px',
    fontWeight: 'bold',
  },
  value: {
    backgroundColor: 'black',
    color: 'white',
    '& button svg': {
      backgroundColor: 'white',
      borderRadius: '50%',
    },
  },
  icon: {
    color: 'white',
  },
};
const BasicInformation = ({ formData, setFormData }) => {
  const [brands, setBrands] = useState([]);
  const [tags, setTags] = useState([]);
  const [minImpressions, setMinImpressions] = useState(200);
  const [maxImpressions, setMaxImpressions] = useState(800);
  const marks = [
    { value: 200, label: '20%' },
    { value: 800, label: '80%' },
  ];

  const handleChange = e => {
    const {
      target: { name, value },
    } = e;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="mt-4 pl-5 pr-7 flex flex-col gap-4">
      <Text size="md" weight="bold">
        Basic Information
      </Text>
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        <div className="flex flex-col gap-y-4">
          <TextInput
            name="campaignname"
            value={formData.campaignname}
            onChange={handleChange}
            styles={styles}
            label="Campaign Name"
            placeholder="Write"
          />
          <TextInput
            name="price"
            value={formData.price}
            onChange={handleChange}
            styles={styles}
            label="Price"
            placeholder="Write"
          />
          <TextInput
            name="healthstatus"
            value={formData.healthstatus}
            onChange={handleChange}
            styles={styles}
            label="Health Status"
            placeholder="Write"
          />
        </div>
        <Textarea
          styles={textAreaStyles}
          label="Description"
          placeholder="Maximum 200 characters"
        />
        <Checkbox label="Set as featured campaign" />
      </div>
      <MultiSelect
        styles={multiSelectStyles}
        label="Previous Brands"
        value={brands}
        onChange={setBrands}
        data={data}
      />
      <Text size="sm" weight="bolder">
        Impressions
      </Text>
      <div className="flex gap-4 items-center">
        <div>
          <input className="border w-24 py-1 px-1" type="text" readOnly value={minImpressions} />
          <Text size="sm" weight="100">
            Min
          </Text>
        </div>
        <RangeSlider
          onChange={val => {
            setMinImpressions(val[0], setMaxImpressions(val[1]));
          }}
          styles={sliderStyle}
          className="mb-5 flex-auto"
          min={100}
          max={1000}
          value={[minImpressions, maxImpressions]}
          defaultValue={[200, 1000]}
          marks={marks}
        />
        <div className="text-right">
          <input className="border w-24" type="text" readOnly value={maxImpressions} />
          <Text size="sm" weight="100">
            Max
          </Text>
        </div>
      </div>
      <MultiSelect
        styles={multiSelectStyles}
        label="Tags"
        value={tags}
        onChange={setTags}
        data={data}
      />
    </div>
  );
};

export default BasicInformation;

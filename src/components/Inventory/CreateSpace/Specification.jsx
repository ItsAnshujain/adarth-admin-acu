import { useState } from 'react';
import { Text, Select, RangeSlider, MultiSelect, TextInput } from '@mantine/core';

const styles = {
  label: {
    marginBottom: '4px',
    fontWeight: 700,
    fontSize: '15px',
    letterSpacing: '0.5px',
  },
};

const multiSelectStyles = {
  label: {
    marginBottom: '4px',
    fontWeight: 700,
    fontSize: '15px',
    letterSpacing: '0.5px',
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

const sliderStyle = {
  bar: {
    backgroundColor: 'black',
  },
  thumb: {
    backgroundColor: 'black',
  },
};

const Specification = ({ formData, setFormData }) => {
  const [minImpressions, setMinImpressions] = useState(200);
  const [maxImpressions, setMaxImpressions] = useState(800);
  const [previousBrands, setPreviousBrands] = useState([]);
  const [tags, setTags] = useState([]);

  const handleChange = e => {
    const { name, value } = e.target;

    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };
  const data = [
    { value: 'react', label: 'React' },
    { value: 'ng', label: 'Angular' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'vue', label: 'Vue' },
    { value: 'riot', label: 'Riot' },
    { value: 'next', label: 'Next.js' },
    { value: 'blitz', label: 'Blitz.js' },
  ];
  const marks = [
    { value: 200, label: '20%' },
    { value: 800, label: '80%' },
  ];
  return (
    <div className="flex flex-col pl-5 pr-7 pt-4 mb-12">
      <Text size="md" weight="bold">
        Space Specifications
      </Text>
      <Text size="sm" weight="300" className="text-gray-500">
        All the related details regarding the campaign
      </Text>
      <div className="grid grid-cols-2 gap-y-4 gap-x-8 mt-4">
        <div>
          <Select
            value={formData.illumination}
            onChange={handleChange}
            styles={styles}
            name="illumination"
            className="mb-7"
            label="Illumination"
            placeholder="Select one"
            data={[
              { value: 'react', label: 'React' },
              { value: 'ng', label: 'Angular' },
              { value: 'svelte', label: 'Svelte' },
              { value: 'vue', label: 'Vue' },
            ]}
          />
          <TextInput
            value={formData.resolutions}
            onChange={handleChange}
            styles={styles}
            name="resolutions"
            placeholder="Write"
            className="mb-7"
            label="Resolutions"
          />
          <TextInput
            value={formData.healthstatus}
            onChange={handleChange}
            styles={styles}
            name="healthstatus"
            placeholder="Write"
            className="mb-7"
            label="Health Status"
          />
        </div>
        <div>
          <Select
            value={formData.unit}
            onChange={handleChange}
            styles={styles}
            name="unit"
            className="mb-7"
            label="Unit"
            placeholder="Select one"
            data={[
              { value: 'react', label: 'React' },
              { value: 'ng', label: 'Angular' },
              { value: 'svelte', label: 'Svelte' },
              { value: 'vue', label: 'Vue' },
            ]}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              value={formData.width}
              onChange={handleChange}
              styles={styles}
              name="width"
              className="mb-7"
              label="Width"
              placeholder="Select one"
              data={[
                { value: 'react', label: 'React' },
                { value: 'ng', label: 'Angular' },
                { value: 'svelte', label: 'Svelte' },
                { value: 'vue', label: 'Vue' },
              ]}
            />
            <Select
              value={formData.height}
              onChange={handleChange}
              styles={styles}
              name="height"
              className="mb-7"
              label="Height"
              placeholder="Select one"
              data={[
                { value: 'react', label: 'React' },
                { value: 'ng', label: 'Angular' },
                { value: 'svelte', label: 'Svelte' },
                { value: 'vue', label: 'Vue' },
              ]}
            />
          </div>
        </div>
      </div>
      <div>
        <Text weight="bold">Impressions</Text>
        <div className="flex gap-4 items-center">
          <div>
            <input className="border w-24 py-1 px-1" type="text" readOnly value={minImpressions} />
            <p className="text-slate-400">Min</p>
          </div>
          <RangeSlider
            onChange={val => {
              setMinImpressions(val[0], setMaxImpressions(val[1]));
            }}
            className="mb-5 flex-auto"
            min={100}
            max={1000}
            styles={sliderStyle}
            value={[minImpressions, maxImpressions]}
            defaultValue={[200, 1000]}
            marks={marks}
          />
          <div>
            <input className="border w-24" type="text" readOnly value={maxImpressions} />
            <p className="text-right text-slate-400">Max</p>
          </div>
        </div>
        <MultiSelect
          className="mb-5 mt-4"
          name="previousbrands"
          onChange={setPreviousBrands}
          value={previousBrands}
          styles={multiSelectStyles}
          data={data}
          label="Previous brands"
          placeholder="Select all that you like"
        />
        <MultiSelect
          styles={multiSelectStyles}
          value={tags}
          onChange={setTags}
          name="tags"
          data={data}
          label="Tags"
          placeholder="Select all that you like"
        />
      </div>
    </div>
  );
};

export default Specification;

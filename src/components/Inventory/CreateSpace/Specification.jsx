import { useState } from 'react';
import { Text, NativeSelect, RangeSlider, MultiSelect, TextInput } from '@mantine/core';

const styles = () => ({
  label: {
    marginBottom: '10px',
    fontWeight: 'bold',
  },
});

const multiSelectStyles = () => ({
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
});
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
    <div className="flex flex-col pl-5 pr-7 pt-4">
      <Text size="md" weight="bold">
        Space Specifications
      </Text>
      <Text size="sm" weight="300" className="text-gray-500">
        All the related details regarding the campaign
      </Text>
      <div className="grid grid-cols-2 gap-y-4 gap-x-8 mt-4">
        <div>
          <NativeSelect
            value={formData.illumination}
            onChange={handleChange}
            styles={styles}
            name="illumination"
            className="mb-7"
            label="Illumination"
            placeholder="Pick one"
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
          <NativeSelect
            value={formData.unit}
            onChange={handleChange}
            styles={styles}
            name="unit"
            className="mb-7"
            label="Unit"
            placeholder="Pick one"
            data={[
              { value: 'react', label: 'React' },
              { value: 'ng', label: 'Angular' },
              { value: 'svelte', label: 'Svelte' },
              { value: 'vue', label: 'Vue' },
            ]}
          />
          <div className="grid grid-cols-2 gap-4">
            <NativeSelect
              value={formData.width}
              onChange={handleChange}
              styles={styles}
              name="width"
              className="mb-7"
              label="Width"
              placeholder="Pick one"
              data={[
                { value: 'react', label: 'React' },
                { value: 'ng', label: 'Angular' },
                { value: 'svelte', label: 'Svelte' },
                { value: 'vue', label: 'Vue' },
              ]}
            />
            <NativeSelect
              value={formData.height}
              onChange={handleChange}
              styles={styles}
              name="height"
              className="mb-7"
              label="Height"
              placeholder="Pick one"
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
          <input className="border w-24 py-1 px-1" type="text" readOnly value={minImpressions} />
          <RangeSlider
            onChange={val => {
              setMinImpressions(val[0], setMaxImpressions(val[1]));
            }}
            className="mb-5 flex-auto"
            min={100}
            max={1000}
            value={[minImpressions, maxImpressions]}
            defaultValue={[200, 1000]}
            marks={marks}
          />
          <input className="border w-24" type="text" readOnly value={maxImpressions} />
        </div>
        <MultiSelect
          className="mb-5 mt-4"
          name="previousbrands"
          onChange={setPreviousBrands}
          value={previousBrands}
          styles={multiSelectStyles}
          data={data}
          label="Previous brands"
          placeholder="Pick all that you like"
        />
        <MultiSelect
          styles={multiSelectStyles}
          value={tags}
          onChange={setTags}
          name="tags"
          data={data}
          label="Tags"
          placeholder="Pick all that you like"
        />
      </div>
    </div>
  );
};

export default Specification;
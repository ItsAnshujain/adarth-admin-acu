import { Checkbox, NumberInput, RangeSlider } from '@mantine/core';
import { useFetchMasters } from '../../../hooks/masters.hooks';
import { serialize } from '../../../utils/index';
import TextInput from '../../shared/TextInput';
import TextareaInput from '../../shared/TextareaInput';
import MultiSelect from '../../shared/MultiSelect';

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
  const { data: tagData } = useFetchMasters(serialize({ type: 'tag', parentId: null, limit: 100 }));
  const { data: brandData } = useFetchMasters(
    serialize({ type: 'brand', parentId: null, limit: 100 }),
  );

  const marks = [
    { value: 200, label: '20%' },
    { value: 800, label: '80%' },
  ];

  const handleChange = e => {
    const {
      target: { name, value },
    } = e;
    setFormData(name, value);
  };

  return (
    <div className="mt-4 pl-5 pr-7 flex flex-col gap-4 pb-20">
      <p className="text-md font-bold">Basic Information</p>
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        <div className="flex flex-col gap-y-4">
          <TextInput
            name="name"
            value={formData.name}
            onChange={handleChange}
            styles={styles}
            label="Campaign Name"
            placeholder="Write"
          />
          <NumberInput
            name="price"
            value={formData.price}
            onChange={value => handleChange({ target: { name: 'price', value } })}
            styles={styles}
            label="Price"
            placeholder="Write"
          />
          <NumberInput
            name="healthStatus"
            value={formData.healthStatus}
            onChange={value => handleChange({ target: { name: 'healthStatus', value } })}
            styles={styles}
            label="Health Status"
            placeholder="Write"
          />
        </div>
        <TextareaInput
          styles={textAreaStyles}
          label="Description"
          placeholder="Maximum 200 characters"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
        <Checkbox
          label="Set as featured campaign"
          onChange={e => setFormData('isFeatured', e.target.checked)}
        />
      </div>
      <MultiSelect
        styles={multiSelectStyles}
        label="Previous Brands"
        onChange={e => setFormData('previousBrands', [...e])}
        data={brandData?.docs.map(item => ({ label: item.name, value: item._id })) || []}
        name="previousBrands"
      />
      <p className="text-sm font-bolder">Impressions</p>
      <div className="flex gap-4 items-center">
        <div>
          <input
            className="border w-24 py-1 px-1"
            type="text"
            readOnly
            value={formData.minImpression}
          />
          <p className="text-sm font-thin">Min</p>
        </div>
        <RangeSlider
          onChange={val => {
            setFormData('minImpression', val[0]);
            setFormData('maxImpression', val[1]);
          }}
          styles={sliderStyle}
          className="mb-5 flex-auto"
          min={100}
          max={1000}
          value={[formData.minImpression, formData.maxImpression]}
          defaultValue={[200, 1000]}
          marks={marks}
        />
        <div className="text-right">
          <input
            className="border w-24 py-1 px-1"
            type="text"
            readOnly
            value={formData.maxImpression}
          />
          <p className="text-sm font-thin" size="sm">
            Max
          </p>
        </div>
      </div>
      <MultiSelect
        styles={multiSelectStyles}
        label="Tags"
        onChange={e => setFormData('tags', [...e])}
        data={tagData?.docs.map(item => ({ label: item.name, value: item._id })) || []}
        name="tags"
      />
    </div>
  );
};

export default BasicInformation;

import { Checkbox, RangeSlider } from '@mantine/core';
import { useFetchMasters } from '../../../hooks/masters.hooks';
import { serialize } from '../../../utils/index';
import TextInput from '../../shared/TextInput';
import TextareaInput from '../../shared/TextareaInput';
import MultiSelect from '../../shared/MultiSelect';
import { useFormContext } from '../../../context/formContext';

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
    backgroundColor: 'white',
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

const marks = [{ value: 1600000 }, { value: 3200000 }];

const BasicInformation = () => {
  const { values, errors, setFieldValue } = useFormContext();

  const { data: tagData } = useFetchMasters(
    serialize({ type: 'tag', parentId: null, limit: 100, page: 1 }),
  );
  const { data: brandData } = useFetchMasters(
    serialize({ type: 'brand', parentId: null, limit: 100, page: 1 }),
  );

  return (
    <div className="mt-4 pl-5 pr-7 flex flex-col gap-4 pb-20">
      <p className="text-md font-bold">Basic Information</p>
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        <div className="flex flex-col gap-y-4">
          <TextInput
            label="Campaign Name"
            name="name"
            withAsterisk
            styles={styles}
            errors={errors}
            placeholder="Write..."
          />
        </div>
        <TextareaInput
          styles={textAreaStyles}
          label="Description"
          placeholder="Maximum 400 characters"
          name="description"
          maxLength={400}
        />
        <Checkbox
          name="isFeatured"
          label="Set as featured campaign"
          checked={values?.isFeatured}
          onChange={e => setFieldValue('isFeatured', e.target.checked)}
        />
      </div>
      <MultiSelect
        styles={multiSelectStyles}
        label="Previous Brands"
        placeholder="Select all that you like"
        onChange={e => setFieldValue('previousBrands', [...e])}
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
            value={values.minImpression || 1600000}
          />
          <p className="text-sm font-thin">Min</p>
        </div>
        <RangeSlider
          onChange={val => {
            setFieldValue('minImpression', val[0]);
            setFieldValue('maxImpression', val[1]);
          }}
          styles={sliderStyle}
          className="mb-5 flex-auto"
          min={0}
          max={5000000}
          value={[values?.minImpression || 1600000, values?.maxImpression || 3200000]}
          marks={marks}
        />
        <div className="text-right">
          <input
            className="border w-24 py-1 px-1"
            type="text"
            readOnly
            value={values.maxImpression || 3200000}
          />
          <p className="text-sm font-thin" size="sm">
            Max
          </p>
        </div>
      </div>
      <MultiSelect
        styles={multiSelectStyles}
        label="Tags"
        placeholder="Select all that you like"
        onChange={e => setFieldValue('tags', [...e])}
        data={tagData?.docs.map(item => ({ label: item.name, value: item._id })) || []}
        name="tags"
      />
    </div>
  );
};

export default BasicInformation;

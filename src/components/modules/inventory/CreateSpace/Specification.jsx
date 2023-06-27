import { RangeSlider } from '@mantine/core';
import { useFormContext } from '../../../../context/formContext';
import { useFetchMasters } from '../../../../apis/queries/masters.queries';
import { serialize } from '../../../../utils';
// import AsyncSelect from '../../../shared/AsyncSelect';
import TextInput from '../../../shared/TextInput';
import Select from '../../../shared/Select';
import NumberInput from '../../../shared/NumberInput';
import AsyncMultiSelect from '../../../shared/AsyncMultiSelect';

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
    backgroundColor: 'white',
  },
};

const query = {
  parentId: null,
  limit: 100,
  page: 1,
  sortBy: 'name',
  sortOrder: 'asc',
};

const Specification = () => {
  const { values, errors, setFieldValue } = useFormContext();

  const {
    data: illuminationData,
    isLoading: isIlluminationLoading,
    isSuccess: isIlluminationLoaded,
  } = useFetchMasters(serialize({ type: 'illumination', ...query }));
  const {
    data: brandData,
    isLoading: isBrandLoading,
    isSuccess: isBrandLoaded,
  } = useFetchMasters(serialize({ type: 'brand', ...query }));
  const {
    data: tagData,
    isLoading: isTagLoading,
    isSuccess: isTagLoaded,
  } = useFetchMasters(serialize({ type: 'tag', ...query }));

  return (
    <div className="flex flex-col pl-5 pr-7 pt-4 mb-44">
      <p className="font-bold text-lg">Space Specifications</p>
      <p className="text-sm font-light text-gray-500">
        Please fill the relevant details regarding the ad Space
      </p>
      <div className="grid grid-cols-2 gap-y-4 gap-x-8 mt-4">
        <div>
          <Select
            label="Illumination"
            name="specifications.illuminations"
            withAsterisk
            styles={styles}
            errors={errors}
            disabled={isIlluminationLoading}
            placeholder="Select..."
            options={
              isIlluminationLoaded
                ? illuminationData.docs.map(category => ({
                    label: category.name,
                    value: category._id,
                  }))
                : []
            }
            className="mb-7"
          />
          <TextInput
            label="Resolutions"
            name="specifications.resolutions"
            styles={styles}
            errors={errors}
            placeholder="Write..."
            className="mb-7"
          />
        </div>
        <div>
          <NumberInput
            label="Unit"
            name="specifications.unit"
            withAsterisk
            styles={styles}
            errors={errors}
            placeholder="Write..."
            className="mb-7"
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="mt-[9px] font-bold text-[15px]">
                Width <span className="font-medium text-xs text-gray-500">(in sqft)</span>
              </p>
              <NumberInput
                name="specifications.size.width"
                withAsterisk
                styles={styles}
                errors={errors}
                placeholder="Write..."
                className="mb-7"
              />
            </div>
            <div>
              <p className="mt-[9px] font-bold text-[15px]">
                Height <span className="font-medium text-xs text-gray-500">(in sqft)</span>
              </p>
              <NumberInput
                name="specifications.size.height"
                withAsterisk
                styles={styles}
                errors={errors}
                placeholder="Write..."
                className="mb-7"
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="grid grid-cols-2 gap-y-4 gap-x-8">
          <NumberInput
            label="Health Status"
            name="specifications.health"
            styles={styles}
            errors={errors}
            placeholder="Write..."
            className="mb-7"
          />
        </div>
        <p className="font-bold">Impressions</p>
        <div className="flex gap-4 items-start">
          <div>
            <NumberInput name="specifications.impressions.min" errors={errors} className="w-24" />
            <p className="text-slate-400">Min</p>
          </div>
          <RangeSlider
            onChangeEnd={val => {
              setFieldValue('specifications.impressions.min', val[0]);
              setFieldValue('specifications.impressions.max', val[1]);
            }}
            styles={sliderStyle}
            className="pt-4 flex-auto"
            min={0}
            max={1800000}
            value={[
              values?.specifications?.impressions?.min || 0,
              values?.specifications?.impressions?.max || 1800000,
            ]}
          />
          <div>
            <NumberInput name="specifications.impressions.max" errors={errors} className="w-24" />
            <p className="text-right text-slate-400">Max</p>
          </div>
        </div>
        <AsyncMultiSelect
          label="Previous brands"
          name="specifications.previousBrands"
          styles={multiSelectStyles}
          errors={errors}
          disabled={isBrandLoading}
          options={
            isBrandLoaded
              ? brandData.docs.map(brand => ({
                  label: brand.name,
                  value: brand._id,
                }))
              : []
          }
          placeholder={brandData?.docs?.length ? 'Select all that you like' : 'None'}
          className="mb-5 mt-4"
          searchable
          clearable
          maxDropdownHeight={160}
        />
        <AsyncMultiSelect
          label="Tags"
          name="specifications.tags"
          styles={multiSelectStyles}
          errors={errors}
          disabled={isTagLoading}
          options={
            isTagLoaded
              ? tagData.docs.map(brand => ({
                  label: brand.name,
                  value: brand._id,
                }))
              : []
          }
          placeholder={tagData?.docs?.length ? 'Select all that you like' : 'None'}
          searchable
          clearable
          maxDropdownHeight={160}
        />
        {/* TODO: update select component  */}
        {/* <AsyncSelect
          name="specifications.previousBrands"
          label="Previous Brands"
          masterKey="brand"
          errors={errors}
        /> */}
        {/* <AsyncSelect name="specifications.tags" label="Tags" masterKey="tag" /> */}
      </div>
    </div>
  );
};

export default Specification;

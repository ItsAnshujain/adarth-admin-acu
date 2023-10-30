import { useMemo } from 'react';
import { useFormContext } from '../../../../context/formContext';
import TextInput from '../../../shared/TextInput';
import Textarea from '../../../shared/TextareaInput';
import NativeSelect from '../../../shared/NativeSelect';
import { serialize } from '../../../../utils';
import { useFetchMasters } from '../../../../apis/queries/masters.queries';

const styles = {
  label: {
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 16,
    letterSpacing: '0.5px',
  },
  input: {
    borderRadius: 0,
  },
};

const textAreaStyles = {
  label: {
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 16,
    letterSpacing: '0.5px',
  },
  input: {
    borderRadius: 0,
    padding: 8,
    height: '187px',
  },
};

const query = {
  parentId: null,
  limit: 100,
  page: 1,
  sortBy: 'name',
  sortOrder: 'asc',
};

const OrderInformationForm = () => {
  const form = useFormContext();

  const industryQuery = useFetchMasters(serialize({ type: 'industry', ...query }));

  const memoizedIndustryQuery = useMemo(
    () =>
      industryQuery.data?.docs.map(type => ({
        label: type.name,
        value: type._id,
      })),
    [industryQuery?.data?.docs],
  );
  return (
    <div className="mt-4">
      <p className="text-xl font-bold">Order Information</p>
      <div className="grid grid-cols-2 gap-8 mt-4">
        <div className="flex flex-col gap-y-4">
          <TextInput
            styles={styles}
            label="Campaign Name"
            name="campaignName"
            withAsterisk
            placeholder="Write..."
            errors={form.errors}
          />
          <NativeSelect
            label="Industry"
            name="industry"
            withAsterisk
            styles={styles}
            errors={form.errors}
            disabled={industryQuery.isLoading}
            placeholder="Select..."
            options={industryQuery.isSuccess ? memoizedIndustryQuery : []}
            className="mb-7"
          />
        </div>
        <div>
          <Textarea
            styles={textAreaStyles}
            label="Description"
            name="description"
            placeholder="Maximun 400 characters"
            errors={form.errors}
            maxLength={400}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderInformationForm;

import { Text } from '@mantine/core';
import { ChevronDown } from 'react-feather';
import TextareaInput from '../../shared/TextareaInput';
import { useFormContext } from '../../../context/formContext';
import TextInput from '../../shared/TextInput';
import { serialize } from '../../../utils';
import { useFetchMasters } from '../../../hooks/masters.hooks';
import NativeSelect from '../../shared/NativeSelect';

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
  monthPickerControlActive: { backgroundColor: '#4B0DAF !important' },
  yearPickerControlActive: { backgroundColor: '#4B0DAF !important' },
};

const BasicInfo = ({ proposalId }) => {
  const { errors } = useFormContext();
  const { data: proposalStatusData, isLoading: isProposalStatusLoading } = useFetchMasters(
    serialize({ type: 'proposal_status', parentId: null, limit: 100, page: 1 }),
  );

  return (
    <div className="flex gap-4 pt-4 flex-col pl-5 pr-7">
      <Text size="md" weight="bold">
        Basic Information
      </Text>
      <div className="grid grid-cols-2 gap-4">
        <div className="row-span-2">
          <TextInput
            label="Proposal Name"
            name="name"
            withAsterisk
            styles={styles}
            errors={errors}
            className="mb-7"
            placeholder="Write..."
          />
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
        </div>
        <div className="row-span-2">
          <TextareaInput
            label="Description"
            name="description"
            styles={styles}
            errors={errors}
            maxLength={200}
            placeholder="Maximum 200 characters"
            className="mb-7"
          />
        </div>
      </div>
      <Text size="md" weight="bold">
        Terms and Conditions:
      </Text>
      <ul className="list-disc px-5">
        <li>Printing charges are additional.</li>
        <li>Mounting charges are additional.</li>
        <li>Booking amount to be paid at the time of adsite blocking.</li>
        <li>Payment conditions to be adhered at the time of booking.</li>
        <li>GST is applicable as per government rules.</li>
      </ul>
    </div>
  );
};

export default BasicInfo;

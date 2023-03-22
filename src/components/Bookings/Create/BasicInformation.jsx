import { NativeSelect } from '@mantine/core';
import { ChevronDown } from 'react-feather';
import TextInput from '../../shared/TextInput';
import { useFormContext } from '../../../context/formContext';

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
const BasicInfo = () => {
  const { errors, setFieldValue } = useFormContext();

  return (
    <div className="pl-5 pr-7 mt-4">
      <p className="text-xl font-bold">Basic Information</p>
      <div className="grid grid-cols-2 gap-8 mt-4">
        <div className="flex flex-col gap-4">
          <TextInput
            styles={styles}
            label="Company Name"
            name="client.companyName"
            withAsterisk
            placeholder="Write..."
            errors={errors}
          />
          <TextInput
            styles={styles}
            label="Client Email"
            name="client.email"
            placeholder="Write..."
            errors={errors}
          />
          <TextInput
            styles={styles}
            label="Client Pan Number"
            name="client.panNumber"
            placeholder="Write..."
            errors={errors}
          />
          <NativeSelect
            styles={styles}
            label="Payment Type"
            name="paymentType"
            errors={errors}
            className="mr-2"
            data={[
              { label: 'NEFT', value: 'neft' },
              { label: 'RTGS', value: 'rtgs' },
              { label: 'CHEQUE', value: 'cheque' },
            ]}
            rightSection={<ChevronDown size={16} className="mt-[1px] mr-1" />}
            rightSectionWidth={40}
            onChange={e => setFieldValue('paymentType', e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-4">
          <TextInput
            styles={styles}
            label="Client Name"
            name="client.name"
            withAsterisk
            placeholder="Write..."
            errors={errors}
          />
          <TextInput
            styles={styles}
            label="Client Contact Number"
            name="client.contactNumber"
            placeholder="Write..."
            errors={errors}
          />
          <TextInput
            styles={styles}
            label="Client GST Number"
            name="client.gstNumber"
            placeholder="Write..."
            errors={errors}
          />
          <TextInput
            styles={styles}
            label="Payment Reference Number"
            name="paymentReference"
            placeholder="Write..."
            errors={errors}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;

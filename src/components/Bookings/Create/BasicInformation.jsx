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
    padding: 8,
  },
};
const BasicInfo = () => {
  const { errors } = useFormContext();
  return (
    <div className="pl-5 pr-7 mt-4">
      <p className="text-xl font-bold">Basic Information</p>
      <div className="grid grid-cols-2 gap-8 mt-4">
        <div className="flex flex-col gap-4">
          <TextInput
            styles={styles}
            label="Company Name"
            name="client.companyName"
            errors={errors}
          />
          <TextInput styles={styles} label="Client Email" name="client.email" errors={errors} />
          <TextInput
            styles={styles}
            label="Client Pan Number"
            name="client.panNumber"
            errors={errors}
          />
          <TextInput
            styles={styles}
            label="Payment Type"
            name="client.paymentType"
            errors={errors}
          />
        </div>
        <div className="flex flex-col gap-4">
          <TextInput styles={styles} label="Client Name" name="client.name" errors={errors} />
          <TextInput
            styles={styles}
            label="Client Contact Number"
            name="client.contactNumber"
            errors={errors}
          />
          <TextInput
            styles={styles}
            label="Client GST Number"
            name="client.gstNumber"
            errors={errors}
          />
          <TextInput
            styles={styles}
            label="Payment Reference Number"
            name="client.paymentReferenceNumber"
            errors={errors}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;

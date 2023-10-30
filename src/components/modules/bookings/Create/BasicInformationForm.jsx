import TextInput from '../../../shared/TextInput';
import { useFormContext } from '../../../../context/formContext';

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
const BasicInformationForm = () => {
  const form = useFormContext();

  return (
    <div className="mt-4">
      <p className="text-xl font-bold">Basic Information</p>
      <div className="grid grid-cols-2 gap-8 mt-4">
        <div className="flex flex-col gap-4">
          <TextInput
            styles={styles}
            label="Company Name"
            name="client.companyName"
            withAsterisk
            placeholder="Write..."
            errors={form.errors}
          />
          <TextInput
            styles={styles}
            label="Client Email"
            name="client.email"
            placeholder="Write..."
            errors={form.errors}
          />
          <TextInput
            styles={styles}
            label="Client Pan Number"
            name="client.panNumber"
            placeholder="Write..."
            errors={form.errors}
          />
          <TextInput
            styles={styles}
            label="Brand Display Name "
            name="displayBrands"
            placeholder="Write..."
            errors={form.errors}
          />
        </div>
        <div className="flex flex-col gap-4">
          <TextInput
            styles={styles}
            label="Client Name"
            name="client.name"
            withAsterisk
            placeholder="Write..."
            errors={form.errors}
          />
          <TextInput
            styles={styles}
            label="Client Contact Number"
            name="client.contactNumber"
            placeholder="Write..."
            errors={form.errors}
          />
          <TextInput
            styles={styles}
            label="Client GST Number"
            name="client.gstNumber"
            placeholder="Write..."
            errors={form.errors}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInformationForm;

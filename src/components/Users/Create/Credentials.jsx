import { useFormContext } from '../../../context/formContext';
import Select from '../../shared/Select';
import TextInput from '../../shared/TextInput';

const roleList = [
  { label: 'Manager', value: 'manager' },
  { label: 'Media Owner', value: 'media_owner' },
  { label: 'Supervisor', value: 'supervisor' },
  { label: 'Associate', value: 'associate' },
];

const styles = {
  label: {
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    borderRadius: 0,
    padding: 8,
  },
};
const Credentials = () => {
  const { errors } = useFormContext();

  return (
    <div className="pl-5 pr-7 mt-4">
      <p className="text-xl font-bold">Create credentials (ID Password) for the account</p>
      <div className="grid grid-cols-2 gap-8 mt-4">
        <div className="flex flex-col gap-4">
          <Select
            label="Role"
            name="role"
            options={roleList}
            withAsterisk
            errors={errors}
            placeholder="Select"
          />
          <TextInput
            label="Password"
            name="password"
            styles={styles}
            withAsterisk
            errors={errors}
            placeholder="Password"
          />
        </div>
        <div className="flex flex-col gap-4">
          <TextInput
            label="Email ID"
            name="email"
            styles={styles}
            withAsterisk
            errors={errors}
            placeholder="Email ID"
          />
          <TextInput
            label="Confirm Password"
            name="confirmPassword"
            styles={styles}
            withAsterisk
            errors={errors}
            placeholder="Confirm Password"
          />
        </div>
      </div>
    </div>
  );
};

export default Credentials;

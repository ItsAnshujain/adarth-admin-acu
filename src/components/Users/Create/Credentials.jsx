import { Select as MantineSelect } from '@mantine/core';
import { useState } from 'react';
import { ChevronDown } from 'react-feather';
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
  const [filter, setFilter] = useState('Team');
  const handleFilter = val => setFilter(val);

  return (
    <div className="pl-5 pr-7 mt-4">
      <p className="text-xl font-bold">Create new user account</p>
      <div className="grid grid-cols-2 gap-8 mt-4">
        <div className="flex flex-col gap-4">
          <MantineSelect
            label="Type"
            withAsterisk
            value={filter}
            onChange={handleFilter}
            data={['Team', 'Peer']}
            styles={styles}
            rightSection={<ChevronDown size={16} className="mt-[1px] mr-1" />}
          />
          {filter?.toLowerCase() === 'team' ? (
            <Select
              label="Role"
              name="role"
              options={roleList}
              styles={styles}
              withAsterisk
              errors={errors}
              placeholder="Select"
            />
          ) : null}
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
          {filter?.toLowerCase() === 'team' ? (
            <TextInput
              label="Name"
              name="name"
              styles={styles}
              withAsterisk
              errors={errors}
              placeholder="Name"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Credentials;

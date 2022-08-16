import { useState } from 'react';
import { Select, TextInput } from '@mantine/core';

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
  const [value, setValue] = useState(null);

  return (
    <div className="pl-5 pr-7 mt-4">
      <p className="text-xl font-bold">Create credentials (ID Password) for the account</p>
      <div className="grid grid-cols-2 gap-8 mt-4">
        <div className="flex flex-col gap-4">
          <Select
            styles={styles}
            value={value}
            onChange={setValue}
            data={['Admin', 'Super User']}
            label="Role"
            required
          />
          <TextInput styles={styles} label="Password" required />
        </div>
        <div className="flex flex-col gap-4">
          <TextInput styles={styles} label="Email ID" required />
          <TextInput styles={styles} label="Confirm Password" required />
        </div>
      </div>
    </div>
  );
};

export default Credentials;

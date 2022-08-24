import { TextInput } from '@mantine/core';

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
const BasicInfo = () => (
  <div className="pl-5 pr-7 mt-4">
    <p className="text-xl font-bold">Basic Information</p>
    <div className="grid grid-cols-2 gap-8 mt-4">
      <div className="flex flex-col gap-4">
        <TextInput styles={styles} label="Company Name" placeholder="Write..." />
        <TextInput styles={styles} label="Client Email" placeholder="Write..." />
        <TextInput styles={styles} label="Client Pan Number" placeholder="Write..." />
      </div>
      <div className="flex flex-col gap-4">
        <TextInput styles={styles} label="Client Name" placeholder="Write..." />
        <TextInput styles={styles} label="Client Contact Number" placeholder="Write..." />
        <TextInput styles={styles} label="Client GST Number" placeholder="Write..." />
      </div>
    </div>
  </div>
);

export default BasicInfo;

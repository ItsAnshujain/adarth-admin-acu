import { Text, TextInput } from '@mantine/core';

const styles = () => ({
  label: {
    marginBottom: '10px',
    fontWeight: 'bold',
  },
});
const Location = () => (
  <div className="flex flex-col pl-5 pr-7 pt-4">
    <Text size="md" weight="bold">
      Location
    </Text>
    <Text size="sm" weight="300" className="text-gray-500">
      Please fill the form with valid information, this details will help the customer
    </Text>
    <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-4">
      <div>
        <TextInput
          styles={styles}
          name="address"
          placeholder="Write"
          className="mb-7"
          label="Address"
        />
        <TextInput
          styles={styles}
          name="state"
          placeholder="Write"
          className="mb-7"
          label="State"
        />
        <TextInput
          styles={styles}
          name="latitude"
          placeholder="Write"
          className="mb-7"
          label="Latitude"
        />
        <TextInput
          styles={styles}
          name="landmark"
          placeholder="Write"
          className="mb-7"
          label="Landmark"
        />
      </div>
      <div>
        <TextInput styles={styles} name="city" placeholder="Write" className="mb-7" label="City" />
        <TextInput styles={styles} name="zip" placeholder="Write" className="mb-7" label="Zip" />
        <TextInput
          styles={styles}
          name="longitude"
          placeholder="Write"
          className="mb-7"
          label="Longitude"
        />
      </div>
    </div>
    <div className="w-[40%] h-48 border">Map Place Holder</div>
  </div>
);

export default Location;

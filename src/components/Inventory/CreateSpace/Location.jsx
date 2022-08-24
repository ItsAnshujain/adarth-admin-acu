import { Text, TextInput } from '@mantine/core';

const styles = {
  label: {
    marginBottom: '10px',
    fontWeight: 700,
    fontSize: '15px',
    letterSpacing: '0.5px',
  },
};
const Location = ({ formData, setFormData }) => {
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col pl-5 pr-7 pt-4 mb-10">
      <Text size="md" weight="bold">
        Location
      </Text>
      <Text size="sm" weight="300" className="text-gray-500">
        Please fill the form with valid information, this details will help the customer
      </Text>
      <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-4">
        <div>
          <TextInput
            value={formData.address}
            onChange={handleChange}
            styles={styles}
            name="address"
            placeholder="Write"
            className="mb-7"
            label="Address"
          />
          <TextInput
            value={formData.state}
            onChange={handleChange}
            styles={styles}
            name="state"
            placeholder="Write"
            className="mb-7"
            label="State"
          />
          <TextInput
            value={formData.latitude}
            onChange={handleChange}
            styles={styles}
            name="latitude"
            placeholder="Write"
            className="mb-7"
            label="Latitude"
          />
          <TextInput
            value={formData.zone}
            onChange={handleChange}
            styles={styles}
            name="zone"
            placeholder="Write"
            className="mb-7"
            label="Zone"
          />
          <TextInput
            value={formData.facing}
            onChange={handleChange}
            styles={styles}
            name="facing"
            placeholder="Write"
            className="mb-7"
            label="Facing"
          />
        </div>
        <div>
          <TextInput
            value={formData.city}
            onChange={handleChange}
            styles={styles}
            name="city"
            placeholder="Write"
            className="mb-7"
            label="City"
          />
          <TextInput
            value={formData.zip}
            onChange={handleChange}
            styles={styles}
            name="zip"
            placeholder="Write"
            className="mb-7"
            label="Zip"
          />
          <TextInput
            value={formData.longitude}
            onChange={handleChange}
            styles={styles}
            name="longitude"
            placeholder="Write"
            className="mb-7"
            label="Longitude"
          />
          <TextInput
            value={formData.landmark}
            onChange={handleChange}
            styles={styles}
            name="landmark"
            placeholder="Write"
            className="mb-7"
            label="Landmark"
          />
        </div>
      </div>
      <div className="w-[40%] h-48 border">Map Place Holder</div>
    </div>
  );
};

export default Location;

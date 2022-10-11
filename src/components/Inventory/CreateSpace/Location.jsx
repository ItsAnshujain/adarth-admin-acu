import { useFormContext } from '../../../context/formContext';
import NumberInput from '../../shared/NumberInput';
import TextInput from '../../shared/TextInput';
import MapView from './MapView';

const styles = {
  label: {
    marginBottom: '10px',
    fontWeight: 700,
    fontSize: '15px',
    letterSpacing: '0.5px',
  },
};
const Location = () => {
  const { errors, values } = useFormContext();

  return (
    <div className="flex flex-col pl-5 pr-7 pt-4 mb-10">
      <p className="font-bold text-lg">Location</p>
      <p className="text-gray-500 text-sm font-light">
        Please fill the form with valid information, this details will help the customer
      </p>
      <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-4">
        <div>
          <TextInput
            label="Address"
            name="location.address"
            styles={styles}
            errors={errors}
            placeholder="Write..."
            className="mb-7"
          />
          <TextInput
            label="State"
            name="location.state"
            styles={styles}
            errors={errors}
            placeholder="Write..."
            className="mb-7"
          />
          <NumberInput
            label="Latitude"
            name="location.latitude"
            styles={styles}
            errors={errors}
            placeholder="Write..."
            className="mb-7"
          />
          <TextInput
            label="Zone"
            name="location.zone"
            styles={styles}
            errors={errors}
            placeholder="Write..."
            className="mb-7"
          />
          <TextInput
            label="Facing"
            name="location.facing"
            styles={styles}
            errors={errors}
            placeholder="Write..."
            className="mb-7"
          />
        </div>
        <div>
          <TextInput
            label="City"
            name="location.city"
            styles={styles}
            errors={errors}
            placeholder="Write..."
            className="mb-7"
          />
          <NumberInput
            label="Zip"
            name="location.zip"
            styles={styles}
            errors={errors}
            placeholder="Write..."
            className="mb-7"
          />
          <NumberInput
            label="Longitude"
            name="location.longitude"
            styles={styles}
            errors={errors}
            placeholder="Write..."
            className="mb-7"
          />
          <TextInput
            label="Landmark"
            name="location.landmark"
            styles={styles}
            errors={errors}
            placeholder="Write..."
            className="mb-7"
          />
        </div>
      </div>
      <MapView latitude={+values.location.latitude} longitude={+values.location.longitude} />
    </div>
  );
};

export default Location;

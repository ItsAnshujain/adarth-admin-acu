import { useFormContext } from '../../../context/formContext';
import { useFetchMasters } from '../../../hooks/masters.hooks';
import { serialize } from '../../../utils';
import AutoCompleteLocationInput from '../../AutoCompleteLocationInput';
import NativeSelect from '../../shared/NativeSelect';
import NumberInput from '../../shared/NumberInput';
import TextInput from '../../shared/TextInput';
import MapView from './MapView';

const tierList = [
  {
    label: 'Tier 1',
    value: 'tier_1',
  },
  {
    label: 'Tier 2',
    value: 'tier_2',
  },
  {
    label: 'Tier 3',
    value: 'tier_4',
  },
];
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
  const {
    data: zoneData,
    isLoading: isZoneLoading,
    isSuccess: isZoneLoaded,
  } = useFetchMasters(serialize({ type: 'zone', limit: 100 }));
  const {
    data: facingData,
    isLoading: isFacingLoading,
    isSuccess: isFacingLoaded,
  } = useFetchMasters(serialize({ type: 'facing', limit: 100 }));

  return (
    <div className="flex flex-col pl-5 pr-7 pt-4 mb-10">
      <p className="font-bold text-lg">Location</p>
      <p className="text-gray-500 text-sm font-light">
        Please fill the relevant details regarding the ad Space
      </p>
      <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-4">
        <div>
          <p style={styles.label}>Address</p>
          <AutoCompleteLocationInput
            addressKeyName="location.address"
            latitudeKeyName="location.latitude"
            longitudeKeyName="location.longitude"
            cityKeyName="location.city"
            stateKeyName="location.state"
          />
          <TextInput
            label="State"
            name="location.state"
            styles={styles}
            errors={errors}
            placeholder="Write..."
            className="my-7"
          />
          <NumberInput
            label="Latitude"
            name="location.latitude"
            styles={styles}
            errors={errors}
            placeholder="Write..."
            className="mb-7"
            precision={6}
          />
          <NativeSelect
            label="Zone"
            name="location.zone"
            styles={styles}
            errors={errors}
            placeholder="Select..."
            disabled={isZoneLoading}
            options={
              isZoneLoaded
                ? zoneData.docs.map(category => ({
                    label: category.name,
                    value: category._id,
                  }))
                : []
            }
            className="mb-7"
          />
          <NativeSelect
            label="Facing"
            name="location.facing"
            styles={styles}
            errors={errors}
            placeholder="Select..."
            disabled={isFacingLoading}
            options={
              isFacingLoaded
                ? facingData.docs.map(category => ({
                    label: category.name,
                    value: category._id,
                  }))
                : []
            }
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
            precision={6}
          />
          <TextInput
            label="Landmark"
            name="location.landmark"
            styles={styles}
            errors={errors}
            placeholder="Write..."
            className="mb-7"
          />
          <NativeSelect
            label="Tier"
            name="location.tier"
            styles={styles}
            errors={errors}
            placeholder="Select..."
            disabled={isFacingLoading}
            options={tierList}
            className="mb-7"
          />
        </div>
      </div>
      <MapView latitude={+values.location.latitude} longitude={+values.location.longitude} />
    </div>
  );
};

export default Location;

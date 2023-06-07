import { showNotification } from '@mantine/notifications';
import { useCallback, useEffect } from 'react';
import { useFormContext } from '../../../context/formContext';
import { useFetchMasters } from '../../../hooks/masters.hooks';
import { debounce, getAddressByLatLng, serialize, tierList } from '../../../utils';
import AutoCompleteLocationInput from '../../AutoCompleteLocationInput';
import NativeSelect from '../../shared/NativeSelect';
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

const query = {
  parentId: null,
  limit: 100,
  page: 1,
  sortBy: 'name',
  sortOrder: 'asc',
};

const Location = () => {
  const { errors, values } = useFormContext();
  const {
    data: zoneData,
    isLoading: isZoneLoading,
    isSuccess: isZoneLoaded,
  } = useFetchMasters(serialize({ type: 'zone', ...query }));
  const {
    data: facingData,
    isLoading: isFacingLoading,
    isSuccess: isFacingLoaded,
  } = useFetchMasters(serialize({ type: 'facing', ...query }));

  const verifyCoordinates = useCallback(
    debounce(async (latitude, longitude) => {
      const res = await getAddressByLatLng(latitude, longitude);
      if (!res?.formatted_address.toLowerCase().includes('india')) {
        showNotification({ title: 'Coordinates cannot be outside India' });
      }
    }, 1000),
    [],
  );

  useEffect(() => {
    if (values?.location?.latitude && values?.location?.longitude) {
      verifyCoordinates(values?.location?.latitude, values?.location?.longitude);
    }
  }, [values?.location]);

  return (
    <div className="flex flex-col pl-5 pr-7 pt-4 mb-10">
      <p className="font-bold text-lg">Location</p>
      <p className="text-gray-500 text-sm font-light">
        Please fill the relevant details regarding the ad Space
      </p>
      <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-4">
        <div>
          <p style={styles.label}>
            Address <span className="text-red-450">*</span>
          </p>
          {typeof window.google !== 'undefined' ? (
            <AutoCompleteLocationInput
              addressKeyName="location.address"
              latitudeKeyName="location.latitude"
              longitudeKeyName="location.longitude"
              cityKeyName="location.city"
              stateKeyName="location.state"
            />
          ) : (
            <TextInput
              name="location.address"
              withAsterisk
              styles={styles}
              errors={errors}
              placeholder="Write..."
              className="mb-7"
            />
          )}
          <TextInput
            label="State"
            name="location.state"
            withAsterisk
            styles={styles}
            errors={errors}
            placeholder="Write..."
            className="my-7"
          />
          <NumberInput
            label="Latitude"
            name="location.latitude"
            withAsterisk
            styles={styles}
            errors={errors}
            placeholder="Write..."
            className="mb-7"
            precision={6}
          />
          <NativeSelect
            label="Zone"
            name="location.zone"
            withAsterisk
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
            withAsterisk
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
          <MapView
            latitude={values?.location?.latitude ? +values.location.latitude : 0}
            longitude={values?.location?.longitude ? +values.location.longitude : 0}
            className="w-[80%]"
          />
        </div>
        <div>
          <TextInput
            label="City"
            name="location.city"
            withAsterisk
            styles={styles}
            errors={errors}
            placeholder="Write..."
            className="mb-7"
          />
          <NumberInput
            label="Zip"
            name="location.zip"
            withAsterisk
            styles={styles}
            errors={errors}
            placeholder="Write..."
            className="mb-7"
          />
          <NumberInput
            label="Longitude"
            name="location.longitude"
            withAsterisk
            styles={styles}
            errors={errors}
            placeholder="Write..."
            className="mb-7"
            precision={6}
          />
          <TextInput
            label="Landmark"
            name="location.landmark"
            withAsterisk
            styles={styles}
            errors={errors}
            placeholder="Write..."
            className="mb-7"
          />
          <NativeSelect
            label="Tier"
            name="location.tier"
            withAsterisk
            styles={styles}
            errors={errors}
            placeholder="Select..."
            disabled={isFacingLoading}
            options={tierList}
            className="mb-7"
          />
          <TextInput
            label="Facia towards"
            name="location.faciaTowards"
            styles={styles}
            errors={errors}
            placeholder="Write..."
            className="mb-7"
          />
        </div>
      </div>
    </div>
  );
};

export default Location;

import React from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { useFormContext } from '../context/formContext';
import { getLatituteLongitude } from '../utils';
import { GOOGLE_MAPS_API_KEY } from '../utils/config';

const AutoCompleteLocationInput = () => {
  const { setFieldValue, errors, values } = useFormContext();
  const getLatLong = async address => {
    const location = await getLatituteLongitude(address);
    return location;
  };

  const onChangeHandler = async e => {
    if (e) {
      const res = await getLatLong(e.label);
      setFieldValue('location.address', e.label);
      setFieldValue('location.latitude', res?.lat);
      setFieldValue('location.longitude', res?.lng);
      if (e.value.terms.length) {
        setFieldValue('location.city', e.value.terms[e.value.terms.length - 3].value);
        setFieldValue('location.state', e.value.terms[e.value.terms.length - 2].value);
      }
    } else {
      setFieldValue('location.address', '');
    }
  };

  return (
    <>
      <GooglePlacesAutocomplete
        apiKey={GOOGLE_MAPS_API_KEY}
        selectProps={{
          defaultInputValue: values.location.address || '',
          isClearable: true,
          styles: {
            control: provided => ({
              ...provided,
              border: `0.5px solid ${errors['location.address'] ? 'red' : 'grey'} `,
              ':hover': {
                border: `0.5px solid ${errors['location.address'] ? 'red' : 'grey'}`,
              },
              width: '100%',
              boxShadow: 'none',
              height: 36,
            }),
            input: provided => ({
              ...provided,
            }),
            singleValue: provided => ({
              ...provided,
              color: '#000',
            }),
            valueContainer: () => ({
              paddingLeft: '0.5rem',
              fontSize: '14px',
            }),
            indicatorsContainer: () => ({
              display: 'none',
            }),
          },
          onChange: onChangeHandler,
        }}
      />
      {errors['location.address'] ? (
        <p className="text-xs mt-1 text-red-450">{errors['location.address']}</p>
      ) : null}
    </>
  );
};

export default AutoCompleteLocationInput;

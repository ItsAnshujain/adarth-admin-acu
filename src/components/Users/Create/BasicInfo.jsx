import { TextInput, Select } from '@mantine/core';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import image from '../../../assets/image.png';

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

const BasicInfo = () => {
  const [state, setState] = useState(null);
  const [city, setCity] = useState(null);
  const [peer, setPeer] = useState(null);
  const { search } = useLocation();
  const type = search.split('=')[1];

  return (
    <div className="pl-5 pr-7 mt-4">
      <p className="text-xl font-bold">Basic information about the associates</p>
      <div className="mt-8 flex flex-col">
        <p className="font-bold text-lg">Upload Profile Picture</p>
        <p className="text-md text-slate-400">Please upload png or jpeg photo(150x150 px)</p>
        <div className="flex items-center justify-center h-[150px] w-[150px] border-dotted border-4">
          <img src={image} alt="placeholder" />
        </div>
      </div>
      {!type === 'media-owner' ? (
        <div className="grid grid-cols-2 gap-6 mt-4 mb-12">
          <TextInput placeholder="Write" styles={styles} label="Name" required />
          <TextInput placeholder="Write" styles={styles} label="Organization" required />
          <TextInput placeholder="Write" styles={styles} label="Phone Number" required />
          <Select
            styles={styles}
            value={state}
            onChange={setState}
            data={['Admin', 'Super User']}
            label="State"
            required
            placeholder="Select"
          />
          <TextInput
            placeholder="Write"
            className="col-span-2"
            styles={styles}
            label="Address"
            required
          />
          <Select
            styles={styles}
            value={city}
            onChange={setCity}
            data={['Admin', 'Super User']}
            label="City"
            required
            placeholder="Select"
          />
          <TextInput placeholder="Write" styles={styles} label="Pin" required />
          <TextInput placeholder="Write" styles={styles} label="Aadhar Number" required />
          <TextInput placeholder="Write" styles={styles} label="Pan Number" required />
          <TextInput
            placeholder="Write"
            className="col-span-2"
            styles={styles}
            label="About"
            required
          />
          <Select
            styles={styles}
            value={peer}
            onChange={setPeer}
            data={['Admin', 'Super User']}
            label="Select Peer"
            required
            placeholder="Select"
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6 mt-4 mb-12">
          <TextInput styles={styles} label="Organization Name" required />
          <TextInput styles={styles} label="License ID" required />
          <TextInput styles={styles} label="Phone Number" required />
          <TextInput styles={styles} label="Email" required />
          <TextInput
            placeholder="Write"
            className="col-span-2"
            styles={styles}
            label="Address"
            required
          />
          <Select
            styles={styles}
            value={city}
            onChange={setCity}
            data={['Admin', 'Super User']}
            label="City"
            required
            placeholder="Select"
          />
          <TextInput styles={styles} label="Pin" required />
          <TextInput placeholder="Write" className="col-span-2" styles={styles} label="About" />
        </div>
      )}
    </div>
  );
};

export default BasicInfo;

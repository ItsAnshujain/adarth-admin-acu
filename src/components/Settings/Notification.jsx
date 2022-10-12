import { Switch, TextInput } from '@mantine/core';

const switchStyles = {
  root: {
    '& input': {
      borderRadius: '5px',
      height: '24px',
      width: '44px',

      '&::before': { borderRadius: '2px', height: '20px', width: '20px' },
    },
  },
};

const inputStyles = {
  input: {
    padding: '20px',
    paddingTop: '25px',
    paddingBottom: '25px',
    borderRadius: '10px',
    height: '34px',
    borderColor: '#969EA1',
  },
  label: {
    color: '#969EA1',
  },
};

const Notification = () => (
  <div className="pl-5 pr-7">
    <div className="py-8">
      <div className="w-4/12 flex justify-between">
        <p className="font-bold text-xl">Message Notification</p>
        <Switch styles={switchStyles} />
      </div>
      <p className="font-medium text-sm mt-2 text-slate-400">
        Get all update notification in your email
      </p>
    </div>
    <div className="py-8 border border-l-0 border-r-0  border-t-slate-300 border-b-slate-300">
      <div className="w-4/12 flex justify-between">
        <p className="font-bold text-xl">Email Notification</p>
        <Switch styles={switchStyles} />
      </div>
      <p className="font-medium text-sm mt-2 text-slate-400">
        Get all update notification in your email
      </p>
      <TextInput
        styles={inputStyles}
        className="w-4/12 mt-2"
        placeholder="Your email"
        label="Email"
      />
    </div>
    <div className="py-8">
      <div className="w-4/12 flex justify-between">
        <p className="font-bold text-xl">Whatsapp Notification</p>
        <Switch styles={switchStyles} />
      </div>
      <p className="font-medium text-sm mt-2 text-slate-400">
        Get all update notification in your whatsapp
      </p>
      <TextInput
        styles={inputStyles}
        className="w-4/12 mt-2 text-slate-400"
        placeholder="Your phone number"
        label="Whatsapp Number"
      />
    </div>
    <button type="button" className="py-2 px-8 rounded bg-purple-450 text-white">
      Save
    </button>
  </div>
);

export default Notification;

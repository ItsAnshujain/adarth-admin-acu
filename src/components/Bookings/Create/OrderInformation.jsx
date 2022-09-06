import { Textarea, TextInput } from '@mantine/core';
import upload from '../../../assets/upload.svg';

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

const textAreaStyles = {
  label: {
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 16,
    letterSpacing: '0.5px',
  },
  input: {
    borderRadius: 0,
    padding: 8,
    height: '187px',
  },
};

const OrderInfo = () => (
  <div className="pl-5 pr-7 mt-4">
    <p className="text-xl font-bold">Order Information</p>
    <div className="grid grid-cols-2 gap-8 mt-4">
      <div className="flex flex-col gap-4">
        <TextInput styles={styles} label="Campaign Name" placeholder="Write..." />
        <p className="font-bold">Upload Media</p>
        <div className="w-full border flex items-center cursor-pointer border-slate-300">
          <button
            type="button"
            className="p-2 ml-1 h-[80%] flex items-center gap-2 border border-black"
          >
            <span>Upload File</span>
            <img src={upload} alt="Upload" className="mr-1" />
          </button>
        </div>
      </div>
      <div>
        <Textarea
          styles={textAreaStyles}
          label="Description"
          placeholder="Maximun 200 characters"
        />
      </div>
    </div>
  </div>
);

export default OrderInfo;

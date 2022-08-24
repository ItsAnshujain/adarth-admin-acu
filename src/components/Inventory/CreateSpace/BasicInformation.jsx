import { useDropzone } from 'react-dropzone';
import { NativeSelect, Text, TextInput, Textarea } from '@mantine/core';
import placeholder from '../../../assets/placeholder.png';
import image from '../../../assets/image.png';

const BasicInfo = ({ formData, setFormData }) => {
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const { acceptedFiles, fileRejections, getRootProps, getInputProps, open } = useDropzone({
    accept: {
      'image/png': ['.png'],
    },
  });

  const acceptedFileItems = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
      <ul>
        {errors.map(e => (
          <li key={e.code}>{e.message}</li>
        ))}
      </ul>
    </li>
  ));

  const labelStyle = {
    label: {
      marginBottom: '4px',
      fontWeight: 700,
      fontSize: '15px',
      letterSpacing: '0.5px',
    },
  };

  return (
    <div className="flex gap-8 pt-4">
      <div className="flex-1 pl-5">
        <p className="mb-7 text-xl font-bold">Basic Information</p>
        <TextInput
          styles={labelStyle}
          value={formData.spacename}
          name="spacename"
          onChange={handleChange}
          placeholder="Write"
          className="mb-7"
          label="Space Name"
        />
        <NativeSelect
          styles={labelStyle}
          value={formData.landlord}
          onChange={handleChange}
          name="landlord"
          className="mb-7"
          label="Landlord"
          placeholder="Select one"
          data={[
            { value: 'react', label: 'React' },
            { value: 'ng', label: 'Angular' },
            { value: 'svelte', label: 'Svelte' },
            { value: 'vue', label: 'Vue' },
          ]}
        />
        <NativeSelect
          styles={labelStyle}
          value={formData.inventoryowner}
          onChange={handleChange}
          name="inventoryowner"
          className="mb-7"
          label="Category"
          placeholder="Select one"
          data={[
            { value: 'react', label: 'React' },
            { value: 'ng', label: 'Angular' },
            { value: 'svelte', label: 'Svelte' },
            { value: 'vue', label: 'Vue' },
          ]}
        />
        <NativeSelect
          styles={labelStyle}
          value={formData.spacetype}
          onChange={handleChange}
          name="spacetype"
          className="mb-7"
          label="Space Type"
          placeholder="Select one"
          data={[
            { value: 'react', label: 'React' },
            { value: 'ng', label: 'Angular' },
            { value: 'svelte', label: 'Svelte' },
            { value: 'vue', label: 'Vue' },
          ]}
        />
        <NativeSelect
          styles={labelStyle}
          value={formData.subcategory}
          onChange={handleChange}
          name="subcategory"
          className="mb-7"
          label="Sub Category"
          placeholder="Select one"
          data={[
            { value: 'react', label: 'React' },
            { value: 'ng', label: 'Angular' },
            { value: 'svelte', label: 'Svelte' },
            { value: 'vue', label: 'Vue' },
          ]}
        />
        <NativeSelect
          styles={labelStyle}
          value={formData.mediatype}
          onChange={handleChange}
          name="mediatype"
          className="mb-7"
          label="Media Type"
          placeholder="Select one"
          data={[
            { value: 'react', label: 'React' },
            { value: 'ng', label: 'Angular' },
            { value: 'svelte', label: 'Svelte' },
            { value: 'vue', label: 'Vue' },
          ]}
        />
        <NativeSelect
          styles={labelStyle}
          value={formData.supportedmedia}
          onChange={handleChange}
          name="supportedmedia"
          className="mb-7"
          label="Supported Media"
          placeholder="Select one"
          data={[
            { value: 'react', label: 'React' },
            { value: 'ng', label: 'Angular' },
            { value: 'svelte', label: 'Svelte' },
            { value: 'vue', label: 'Vue' },
          ]}
        />
        <TextInput
          styles={labelStyle}
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Write"
          className="mb-7"
          label="Price"
        />
        <TextInput
          styles={labelStyle}
          name="footfall"
          value={formData.footfall}
          onChange={handleChange}
          placeholder="Write"
          className="mb-7"
          label="Footfall"
        />
        <TextInput
          styles={labelStyle}
          name="audience"
          value={formData.audience}
          onChange={handleChange}
          placeholder="Write"
          className="mb-7"
          label="Audience"
        />
        <TextInput
          styles={labelStyle}
          name="demographics"
          value={formData.demographics}
          onChange={handleChange}
          placeholder="Write"
          className="mb-7"
          label="Demographics"
        />
        <Textarea
          styles={labelStyle}
          value={formData.description}
          onChange={handleChange}
          name="description"
          className="mb-7"
          placeholder="Maximunm 200 characters"
          label="Description"
        />
      </div>
      <div className="flex flex-col gap-24 flex-1 pr-7">
        <div className="flex-1">
          <p className="text-xl font-bold">Photos</p>
          <Text className="text-gray-500 my-2" size="md">
            Lorem ipsum atque quibusdam quos eius corrupti modi maiores.
          </Text>
          <div {...getRootProps()} className="border h-full flex justify-center items-center">
            <div className="hidden">
              <input {...getInputProps()} type="file" accept="image/png" />
            </div>
            <div className="text-center">
              <img className="inline-block" src={image} alt="placeholder" />
              <Text>
                Drag and Drop your files here,or{' '}
                <button
                  type="button"
                  onClick={open}
                  className="text-purple-450 border-none bg-white"
                >
                  browse
                </button>
              </Text>
              <Text className="text-gray-400">Supported png format only</Text>
              <aside>
                {acceptedFileItems.length > 0 && <ul>{acceptedFileItems}</ul>}
                {fileRejectionItems.length > 0 && <ul>{fileRejectionItems}</ul>}
              </aside>
            </div>
          </div>
        </div>
        <div className="flex-1 mb-7">
          <p className="text-xl font-bold">Other Images</p>
          <Text className="text-gray-400 mb-2" size="md">
            Lorem ipsum atque quibusdam quos eius corrupti modi maiores.
          </Text>
          <div className="flex flex-wrap gap-4">
            <div>
              <img src={placeholder} alt="placeholder" />
            </div>
            <div>
              <img src={placeholder} alt="placeholder" />
            </div>
            <div>
              <img src={placeholder} alt="placeholder" />
            </div>
            <div>
              <img src={placeholder} alt="placeholder" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;

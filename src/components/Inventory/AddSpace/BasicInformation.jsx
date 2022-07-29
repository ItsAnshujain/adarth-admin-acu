import { useRef } from 'react';
import { Select, Text, TextInput, Textarea } from '@mantine/core';
import placeholder from '../../../assets/placeholder.png';
import image from '../../../assets/image.png';

const BasicInfo = () => {
  const input = useRef();
  return (
    <div className="flex gap-8 pt-4">
      <div className="flex-1 pl-5">
        <Text className="mb-7" size="lg">
          Basic Information
        </Text>
        <TextInput placeholder="Write" className="mb-7" label="Space Name" />
        <Select
          className="mb-7"
          label="Space Name"
          placeholder="Pick one"
          data={[
            { value: 'react', label: 'React' },
            { value: 'ng', label: 'Angular' },
            { value: 'svelte', label: 'Svelte' },
            { value: 'vue', label: 'Vue' },
          ]}
        />
        <Select
          className="mb-7"
          label="Landlord"
          placeholder="Pick one"
          data={[
            { value: 'react', label: 'React' },
            { value: 'ng', label: 'Angular' },
            { value: 'svelte', label: 'Svelte' },
            { value: 'vue', label: 'Vue' },
          ]}
        />
        <Select
          className="mb-7"
          label="Category"
          placeholder="Pick one"
          data={[
            { value: 'react', label: 'React' },
            { value: 'ng', label: 'Angular' },
            { value: 'svelte', label: 'Svelte' },
            { value: 'vue', label: 'Vue' },
          ]}
        />
        <Select
          className="mb-7"
          label="Media Type"
          placeholder="Pick one"
          data={[
            { value: 'react', label: 'React' },
            { value: 'ng', label: 'Angular' },
            { value: 'svelte', label: 'Svelte' },
            { value: 'vue', label: 'Vue' },
          ]}
        />
        <Select
          className="mb-7"
          label="Supported Media"
          placeholder="Pick one"
          data={[
            { value: 'react', label: 'React' },
            { value: 'ng', label: 'Angular' },
            { value: 'svelte', label: 'Svelte' },
            { value: 'vue', label: 'Vue' },
          ]}
        />
        <TextInput placeholder="Write" className="mb-7" label="Price" />
        <Textarea className="mb-7" placeholder="Maximunm 200 characters" label="Description" />
      </div>
      <div className="flex flex-col gap-24 flex-1 pr-7">
        <div className="flex-1">
          <Text size="lg">Photos</Text>
          <Text className="text-gray-500 my-2" size="md">
            Lorem ipsum atque quibusdam quos eius corrupti modi maiores.
          </Text>
          <div className="border h-full flex justify-center items-center">
            <div className="hidden">
              <input type="file" ref={input} />
            </div>
            <div className="text-center">
              <img className="inline-block" src={image} alt="placeholder" />
              <Text>
                Drag and Drop your files here,or{' '}
                <button
                  type="button"
                  onClick={() => input.current.click()}
                  className="text-purple-450 border-none bg-white"
                >
                  browse
                </button>
              </Text>
              <Text className="text-gray-400">Supported png format only</Text>
            </div>
          </div>
        </div>
        <div className="flex-1 mb-7">
          <Text size="lg">Photos</Text>
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

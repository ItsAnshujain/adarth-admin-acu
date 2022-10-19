import { useState } from 'react';
import { Tabs } from '@mantine/core';
import BasicInfo from '../Users/Create/BasicInfo';
import Documents from '../Users/Create/Documents';
import { FormProvider, useForm } from '../../context/formContext';

const EditProfile = () => {
  const [activeTab, setActiveTab] = useState('first');
  const form = useForm();
  return (
    <FormProvider form={form}>
      <form>
        <Tabs value={activeTab} onTabChange={setActiveTab}>
          <Tabs.List className="h-[60px] relative">
            <Tabs.Tab className="text-base hover:bg-transparent" value="first">
              Basic Information
            </Tabs.Tab>
            <Tabs.Tab className="text-base hover:bg-transparent" value="second">
              Document
            </Tabs.Tab>
            <button
              className="absolute right-7 top-7 bg-purple-450 text-white px-4 py-2 rounded-md"
              type="button"
              onClick={() => {}}
            >
              Save
            </button>
          </Tabs.List>
          <Tabs.Panel value="first">
            <BasicInfo />
          </Tabs.Panel>
          <Tabs.Panel value="second">
            <Documents />
          </Tabs.Panel>
        </Tabs>
      </form>
    </FormProvider>
  );
};

export default EditProfile;

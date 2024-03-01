import { Button } from '@mantine/core';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import ControlledTextInput from '../../shared/FormInputs/Controlled/ControlledTextInput';
import ControlledNumberInput from '../../shared/FormInputs/Controlled/ControlledNumberInput';
import ControlledSelect from '../../shared/FormInputs/Controlled/ControlledSelect';
import DatePicker from '../../shared/FormInputs/DatePicker';

const AddContactContent = ({ onCancel }) => {
  const schema = yup.object({
    name: yup.string().trim().required('Name is required'),
  });

  const form = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = form.handleSubmit(_formData => {});

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit}>
        <div className="px-8 pt-4">
          <div className="text-2xl font-bold">Basic information</div>
          <div className="grid grid-cols-2 py-4 gap-2">
            <ControlledTextInput name="name" label="Name" withAsterisk />
            <ControlledNumberInput type="number" name="contactNumber" label="Contact Number" />
            <ControlledTextInput name="email" label="Email" />
            <ControlledTextInput name="department" label="Department" />
            <ControlledSelect
              data={[]}
              name="companyName"
              label="Company Name"
              placeholder="Select..."
            />
            <ControlledTextInput name="parentCompanyName" label="Parent Company Name" disabled />
            <ControlledSelect
              data={[]}
              name="stateAndStateCode"
              label="State & State Code"
              placeholder="Select..."
            />
            <ControlledTextInput name="city" label="City" />
            <DatePicker label="Birthday" name="birthday" errors={form.errors} clearable />
          </div>

          <div className="flex gap-2 py-4 float-right">
            <Button className="bg-black" onClick={onCancel}>
              Cancel
            </Button>
            <Button className="bg-purple-450" type="submit">
              Save
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default AddContactContent;

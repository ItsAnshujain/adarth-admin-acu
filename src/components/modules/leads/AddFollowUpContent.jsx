import { DatePickerInput } from '@mantine/dates';
import { Button } from '@mantine/core';
import { FormProvider, useForm } from 'react-hook-form';
import ControlledSelect from '../../shared/FormInputs/Controlled/ControlledSelect';
import ControlledTextarea from '../../shared/FormInputs/Controlled/ControlledTextarea';

const AddFollowUpContent = ({ onCancel }) => {
  const form = useForm();

  const onSubmit = form.handleSubmit(_formData => {});

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit}>
        <div>
          <div className="text-xl font-bold w-full py-4">Basic Information</div>
          <div className="grid grid-cols-2 gap-3">
            <ControlledSelect
              clearable
              searchable
              placeholder="Select..."
              name="leadStage"
              label="Lead Stage"
              data={[]}
              classNames={{ label: 'font-bold' }}
            />
            <ControlledSelect
              clearable
              searchable
              placeholder="Select..."
              name="communicationType"
              label="Communication Type"
              data={[]}
              classNames={{ label: 'font-bold' }}
            />
            <DatePickerInput
              name="followUpDate"
              label="Follow Up Date"
              classNames={{ label: 'font-bold' }}
            />
            <DatePickerInput
              name="nextFollowUpDate"
              label="Next Follow Up Date"
              classNames={{ label: 'font-bold' }}
            />
            <ControlledSelect
              clearable
              searchable
              placeholder="Select..."
              name="primaryInCharge"
              label="Primary Incharge"
              data={[]}
              classNames={{ label: 'font-bold' }}
            />
            <ControlledSelect
              clearable
              searchable
              placeholder="Select..."
              name="secondaryInCharge"
              label="Secondary Incharge"
              data={[]}
              classNames={{ label: 'font-bold' }}
            />
          </div>
          <ControlledTextarea
            name="notes"
            label="Notes"
            minRows={4}
            className="pt-2"
            classNames={{ label: 'font-bold' }}
          />
          <div className="py-4 flex gap-4 justify-end">
            <Button variant="default" color="dark" className="font-normal" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              className="bg-purple-450 font-normal text-white"
            >
              Save
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default AddFollowUpContent;

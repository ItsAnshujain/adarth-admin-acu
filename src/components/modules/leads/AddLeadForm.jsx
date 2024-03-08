import { Button, Divider, Image, MultiSelect } from '@mantine/core';
import { FormProvider, useForm } from 'react-hook-form';
import { DatePickerInput } from '@mantine/dates';
import ControlledSelect from '../../shared/FormInputs/Controlled/ControlledSelect';
import ControlledTextInput from '../../shared/FormInputs/Controlled/ControlledTextInput';
import CalendarIcon from '../../../assets/calendar.svg';
import ControlledTextarea from '../../shared/FormInputs/Controlled/ControlledTextarea';

const AddLeadForm = () => {
  const form = useForm();
  return (
    <FormProvider {...form}>
      <form onSubmit={() => {}}>
        <div className="flex items-center justify-between py-2 px-6">
          <div className="text-xl font-bold">Create Lead</div>
          <div className="flex gap-2">
            <Button variant="default">Cancel</Button>
            <Button className="bg-purple-450">Save</Button>
          </div>
        </div>
        <Divider />
        <div className="py-2 px-6">
          <div className="text-xl font-bold">Basic Information</div>
          <div className="grid grid-cols-2 pt-4 gap-2">
            <ControlledSelect
              clearable
              searchable
              placeholder="Select..."
              name="leadCompany"
              label="Lead Company"
              data={[]}
              withAsterisk
            />
            <ControlledSelect
              clearable
              searchable
              placeholder="Select..."
              name="companyRepresenting"
              label="Company Representing"
              data={[]}
            />
            <DatePickerInput
              name="startDate"
              label="Target Start Date"
              rightSection={<Image src={CalendarIcon} alt="icon" width={20} />}
            />
            <DatePickerInput
              name="endDate"
              label="Target End Date"
              rightSection={<Image src={CalendarIcon} alt="icon" width={20} />}
            />
            <ControlledSelect
              clearable
              searchable
              placeholder="Select..."
              name="contactPersonName"
              label="Contact Person Name"
              data={[]}
              withAsterisk
            />
            <ControlledTextInput name="displayBrand" label="Display Brand" />
          </div>
          <div className="grid grid-cols-1 py-4 gap-2">
            <ControlledTextInput name="objective" label="Objective" />
            <ControlledTextarea minRows={3} name="remarks" label="Remarks" />
          </div>
          <div className="text-xl font-bold mt-6">Other Information</div>
          <div className="grid grid-cols-2 pt-4 gap-2">
            <ControlledTextInput name="overallBudget" label="Overall Budget" />
            <DatePickerInput
              name="leadClosedDate"
              label="Lead Close Date"
              rightSection={<Image src={CalendarIcon} alt="icon" width={20} />}
            />
          </div>
          <div className="grid grid-cols-1 pt-4 gap-2">
            <ControlledTextInput name="targetAudience" label="Target Audiences" />
            <MultiSelect
              placeholder="Select..."
              name="brandCompetitor"
              label="Brand Competitor"
              data={[
                { label: 'a1', value: 'a1' },
                { label: 'a2', value: 'a2' },
              ]}
              classNames={{ label: 'text-base mb-2' }}
              clearable
              searchable
            />
            <ControlledTextInput name="campaignTheme" label="Campaign Theme" />
            <ControlledTextarea minRows={3} name="campaignObjective" label="Campaign Objective" />
          </div>
          <div className="grid grid-cols-2 py-4 gap-2">
            <ControlledSelect
              clearable
              searchable
              placeholder="Select..."
              name="prospect"
              label="Prospect"
              data={[]}
            />
            <ControlledSelect
              clearable
              searchable
              placeholder="Select..."
              name="leadSource"
              label="Lead Source"
              data={[]}
            />
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default AddLeadForm;

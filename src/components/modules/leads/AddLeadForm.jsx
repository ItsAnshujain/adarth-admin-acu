import { Button, Divider, Image, MultiSelect } from '@mantine/core';
import { FormProvider, useForm } from 'react-hook-form';
import { DatePickerInput } from '@mantine/dates';
import { ChevronDown } from 'react-feather';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import ControlledSelect from '../../shared/FormInputs/Controlled/ControlledSelect';
import ControlledTextInput from '../../shared/FormInputs/Controlled/ControlledTextInput';
import CalendarIcon from '../../../assets/calendar.svg';
import ControlledTextarea from '../../shared/FormInputs/Controlled/ControlledTextarea';

const schema = yup.object({
  leadCompany: yup.string().trim().required('Lead company is required'),
  contactPersonName: yup.string().trim().required('Contact person is required'),
});

const AddLeadForm = () => {
  const navigate = useNavigate();
  const form = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = form.handleSubmit(_formData => {});

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit}>
        <div className="flex items-center justify-between py-2 px-6">
          <div className="text-xl font-bold">Create Lead</div>
          <div className="flex gap-2">
            <Button variant="default" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button className="bg-purple-450" type="submit">
              Save
            </Button>
          </div>
        </div>
        <Divider />
        <div className="py-2 px-6">
          <div className="flex gap-3 justify-end py-4">
            <div />
            <div className="border border-gray-200 flex items-center text-gray-400 text-sm rounded-md px-2 w-fit">
              <div>Primary Incharge - </div>
              <ControlledSelect
                clearable
                searchable
                placeholder="Select..."
                name="primaryIncharge"
                data={[]}
                withAsterisk
                classNames={{
                  input: 'border-none',
                }}
                rightSection={<ChevronDown size={20} />}
                className="w-28"
              />
            </div>
            <div className="border border-gray-200 flex items-center text-gray-400 text-sm rounded-md px-2 w-fit">
              <div>Secondary Incharge - </div>
              <ControlledSelect
                clearable
                searchable
                placeholder="Select..."
                name="secondaryIncharge"
                data={[]}
                withAsterisk
                classNames={{
                  input: 'border-none',
                }}
                rightSection={<ChevronDown size={20} />}
                className="w-28"
              />
            </div>
            <div className="border border-gray-200 flex items-center text-gray-400 text-sm rounded-md px-2 w-fit">
              <div>Priority - </div>
              <ControlledSelect
                clearable
                searchable
                placeholder="Select..."
                name="priority"
                data={[]}
                withAsterisk
                classNames={{
                  input: 'border-none',
                }}
                rightSection={<ChevronDown size={20} />}
                className="w-28"
              />
            </div>
            <div className="border border-gray-200 flex items-center text-gray-400 text-sm rounded-md px-2 w-fit">
              <div>Stage - </div>
              <ControlledSelect
                clearable
                searchable
                placeholder="Select..."
                name="stage"
                data={[]}
                withAsterisk
                classNames={{
                  input: 'border-none',
                }}
                rightSection={<ChevronDown size={20} />}
                className="w-28"
              />
            </div>
          </div>
          <div className="text-xl font-bold w-full">Basic Information</div>
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

import { Button } from '@mantine/core';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import ControlledTextInput from '../../shared/FormInputs/Controlled/ControlledTextInput';
import ControlledSelect from '../../shared/FormInputs/Controlled/ControlledSelect';
import { gstRegexMatch } from '../../../utils';

const AddCoCompanyContent = ({ type, onCancel }) => {
  const schema = yup.object({
    companyName: yup.string().trim().required('Company name is required'),
    gstin: yup.string().trim().matches(gstRegexMatch, 'GST number must be valid and in uppercase'),
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
            <ControlledTextInput name="companyName" label="Company Name" withAsterisk />
            <ControlledTextInput name="email" label="Email" />
            <ControlledTextInput name="contactNumber" label="Contact Number" />
            <ControlledTextInput name="faxNumber" label="Fax Name" />
            <ControlledTextInput name="pan" label="PAN" />
            <ControlledTextInput name="gstin" label="GSTIN" />
            <ControlledSelect name="natureOfAccount" label="Nature of Account" data={[]} />
            <ControlledSelect name="companyType" label="Company Type" data={[]} />
          </div>

          <div className="flex flex-col gap-4">
            {type === 'sisterCompany' ? (
              <ControlledSelect name="parentCompany" label="Parent Company" data={[]} />
            ) : null}
            <ControlledTextInput name="address" label="Address" />
          </div>

          <div className="grid grid-cols-2 py-4 gap-2">
            <ControlledSelect name="stateAndStateCode" label="State & State Code" data={[]} />
            <ControlledTextInput name="city" label="City" />
          </div>
          <div className="text-2xl font-bold">Bank Information</div>
          <div className="grid grid-cols-2 py-4 gap-2">
            <ControlledTextInput name="accountNo" label="Account No" />
            <ControlledTextInput name="accountHolderName" label="Account Holder Name" />
          </div>
          <ControlledTextInput name="ifsc" label="IFSC" />
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

export default AddCoCompanyContent;

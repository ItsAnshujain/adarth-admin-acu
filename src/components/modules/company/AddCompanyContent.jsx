import { Button } from '@mantine/core';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { showNotification } from '@mantine/notifications';
import { useMemo } from 'react';
import ControlledTextInput from '../../shared/FormInputs/Controlled/ControlledTextInput';
import ControlledSelect from '../../shared/FormInputs/Controlled/ControlledSelect';
import { gstRegexMatch } from '../../../utils';
import { useAddCompany, useStateAndStateCode } from '../../../apis/queries/companies.queries';
import { CompanyTypeOptions, NatureOfAccountOptions } from '../../../utils/constants';

const AddCompanyContent = ({ type, onCancel }) => {
  const schema = yup.object({
    companyName: yup.string().trim().required('Company name is required'),
    companyGstNumber: yup
      .string()
      .trim()
      .matches(gstRegexMatch, 'GST number must be valid and in uppercase'),
    email: yup.string().trim().email('Invalid Email'),
  });

  const form = useForm({
    resolver: yupResolver(schema),
  });

  const stateAndStateCodeQuery = useStateAndStateCode('');

  const addCompanyHandler = useAddCompany();

  const onSubmit = form.handleSubmit(formData => {
    const {
      companyName,
      email,
      contactNumber,
      fax,
      companyPanNumber,
      companyGstNumber,
      parentCompany,
      companyType,
      accountNo,
      accountHolderName,
      ifsc,
      address,
      city,
      state,
      pincode,
      stateCode,
      natureOfAccount,
    } = formData;

    const data = {
      companyName,
      email,
      contactNumber,
      fax,
      companyPanNumber,
      companyGstNumber,
      parentCompany,
      natureOfAccount,
      companyType,
      type: '',
      bankAccountDetails: [
        {
          accountNo,
          accountHolderName,
          ifsc,
        },
      ],
      companyAddress: {
        address,
        city,
        state,
        pincode,
        stateCode,
      },
    };
    addCompanyHandler.mutate(data, {
      onSuccess: () =>
        showNotification({
          title: 'Company added successfully',
          color: 'green',
        }),
    });
  });

  const memoizedStateAndStateCodeList = useMemo(
    () =>
      stateAndStateCodeQuery?.data?.map(stateDoc => ({
        label: `(${stateDoc.gstCode}) ${stateDoc.name}`,
        value: stateDoc.gstCode,
        ...stateDoc,
      })) || [],
    [stateAndStateCodeQuery?.data],
  );

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit}>
        <div className="px-8 pt-4">
          <div className="text-2xl font-bold">Basic information</div>
          <div className="grid grid-cols-2 py-4 gap-2">
            <ControlledTextInput name="companyName" label="Company Name" withAsterisk />
            <ControlledTextInput name="email" label="Email" />
            <ControlledTextInput name="contactNumber" label="Contact Number" />
            <ControlledTextInput name="fax" label="Fax Name" />
            <ControlledTextInput name="companyPanNumber" label="PAN" />
            <ControlledTextInput name="companyGstNumber" label="GSTIN" />
            <ControlledSelect
              name="natureOfAccount"
              label="Nature of Account"
              data={NatureOfAccountOptions}
            />
            <ControlledSelect name="companyType" label="Company Type" data={CompanyTypeOptions} />
          </div>

          <div className="flex flex-col gap-4">
            {type === 'company' ? (
              <ControlledSelect name="parentCompany" label="Parent Company" data={[]} />
            ) : null}
            <ControlledTextInput name="address" label="Address" />
          </div>

          <div className="grid grid-cols-2 py-4 gap-2">
            <ControlledSelect
              name="stateCode"
              label="State & State Code"
              data={memoizedStateAndStateCodeList}
            />
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

export default AddCompanyContent;

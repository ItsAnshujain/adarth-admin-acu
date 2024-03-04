import { Button } from '@mantine/core';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { showNotification } from '@mantine/notifications';
import { useEffect, useMemo } from 'react';
import ControlledTextInput from '../../shared/FormInputs/Controlled/ControlledTextInput';
import ControlledSelect from '../../shared/FormInputs/Controlled/ControlledSelect';
import { gstRegexMatch } from '../../../utils';
import {
  useAddCompany,
  useInfiniteCompanies,
  useStateAndStateCode,
  useUpdateCompany,
} from '../../../apis/queries/companies.queries';
import { CompanyTypeOptions, NatureOfAccountOptions } from '../../../utils/constants';
import DropdownWithHandler from '../../shared/SelectDropdown/DropdownWithHandler';

const schema = yup.object({
  companyName: yup.string().trim().required('Company name is required'),
  companyGstNumber: yup
    .string()
    .trim()
    .matches(gstRegexMatch, 'GST number must be valid and in uppercase'),
  email: yup.string().trim().email('Invalid Email'),
});

const AddCompanyContent = ({ type, onCancel, companyData, mode }) => {
  const form = useForm({
    resolver: yupResolver(schema),
  });

  const stateAndStateCodeQuery = useStateAndStateCode('');

  const addCompanyHandler = useAddCompany();
  const updateCompanyHandler = useUpdateCompany();

  const parentCompaniesQuery = useInfiniteCompanies({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    type: 'lead-company',
    isParent: true,
  });

  const parentCompanies = useMemo(
    () =>
      parentCompaniesQuery.data?.pages
        .reduce((acc, { docs }) => [...acc, ...docs], [])
        .map(doc => ({
          ...doc,
          label: doc.companyName,
          value: doc._id,
        })) || [],
    [parentCompaniesQuery?.data],
  );

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
      pincode,
      stateAndStateCode,
      natureOfAccount,
      bankName,
    } = formData;

    const data = {
      companyName,
      email: email || undefined,
      contactNumber,
      fax,
      companyPanNumber,
      companyGstNumber,
      parentCompany: type === 'company' ? parentCompany : null,
      natureOfAccount,
      companyType: companyType || undefined,
      type: 'lead-company',
      bankAccountDetails:
        accountNo || accountHolderName || ifsc
          ? [
              {
                accountNo: accountNo || undefined,
                accountHolderName: accountHolderName || undefined,
                ifsc: ifsc || undefined,
                bankName: bankName || '-',
              },
            ]
          : [],
      companyAddress: {
        address,
        city,
        pincode,
        stateCode: stateAndStateCode?.split(/\((\d+)\)\s*(.+)/)?.[1],
        state: stateAndStateCode?.split(/\((\d+)\)\s*(.+)/)?.[2],
      },
      id: companyData ? companyData?._id : undefined,
    };

    if (mode === 'add') {
      addCompanyHandler.mutate(data, {
        onSuccess: () => {
          showNotification({
            title: 'Company added successfully',
            color: 'green',
          });
          onCancel();
        },
      });
    } else {
      updateCompanyHandler.mutate(data, {
        onSuccess: () => {
          showNotification({
            title: 'Company updated successfully',
            color: 'green',
          });
          onCancel();
        },
      });
    }
  });

  const memoizedStateAndStateCodeList = useMemo(
    () =>
      stateAndStateCodeQuery?.data?.map(stateDoc => ({
        label: `(${stateDoc.gstCode}) ${stateDoc.name}`,
        value: stateDoc.gstCode.toString(),
        ...stateDoc,
      })) || [],
    [stateAndStateCodeQuery?.data],
  );

  useEffect(() => {
    form.setValue('stateCode', '');
  }, [form.watch('state')]);

  useEffect(() => {
    form.reset({
      ...companyData,
      ...companyData?.companyAddress,
      ...companyData?.parentCompany,
      ...companyData?.bankAccountDetails?.[0],
      parentCompany: companyData?.parentCompany?._id,
      stateAndStateCode: `(${companyData?.companyAddress?.stateCode}) ${companyData?.companyAddress?.state}`,
    });
  }, [companyData]);

  const parentCompaniesDropdown = useMemo(
    () =>
      DropdownWithHandler(
        () => parentCompaniesQuery.fetchNextPage(),
        parentCompaniesQuery.isFetchingNextPage,
        parentCompaniesQuery.hasNextPage,
      ),
    [parentCompaniesQuery],
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
              clearable
              searchable
              name="natureOfAccount"
              label="Nature of Account"
              data={NatureOfAccountOptions}
            />
            <ControlledSelect
              clearable
              searchable
              name="companyType"
              label="Company Type"
              data={CompanyTypeOptions}
            />
          </div>

          {type === 'company' ? (
            <ControlledSelect
              clearable
              searchable
              name="parentCompany"
              label="Parent Company"
              dropdownComponent={parentCompaniesDropdown}
              data={parentCompanies}
            />
          ) : null}

          <div className="grid grid-cols-2 gap-2 pt-4">
            <ControlledTextInput name="address" label="Address" />

            <ControlledTextInput name="city" label="City" />
          </div>

          <div className="grid grid-cols-2 py-4 gap-2">
            <ControlledSelect
              clearable
              searchable
              name="stateCode"
              label="State & State Code"
              data={memoizedStateAndStateCodeList}
            />
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
            <Button
              className="bg-purple-450"
              type="submit"
              loading={addCompanyHandler.isLoading || updateCompanyHandler.isLoading}
            >
              Save
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default AddCompanyContent;

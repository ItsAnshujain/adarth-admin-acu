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

const AddCoCompanyContent = ({ type, onCancel, companyData, mode }) => {
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

  const parentCompaniesQuery = useInfiniteCompanies({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    type: 'co-company',
    isParent: true,
  });
  const addCompanyHandler = useAddCompany();
  const updateCompanyHandler = useUpdateCompany();

  const stateAndStateCodeQuery = useStateAndStateCode('');

  const memoizedStateAndStateCodeList = useMemo(
    () =>
      stateAndStateCodeQuery?.data?.map(stateDoc => ({
        label: `(${stateDoc.gstCode}) ${stateDoc.name}`,
        value: `(${stateDoc.gstCode}) ${stateDoc.name}`,
        ...stateDoc,
      })) || [],
    [stateAndStateCodeQuery?.data],
  );

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
      parentCompany: type === 'sisterCompany' ? parentCompany : null,
      natureOfAccount,
      companyType: companyType || undefined,
      type: 'co-company',
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

  const parentCompaniesDropdown = useMemo(
    () =>
      DropdownWithHandler(
        () => parentCompaniesQuery.fetchNextPage(),
        parentCompaniesQuery.isFetchingNextPage,
        parentCompaniesQuery.hasNextPage,
      ),
    [parentCompaniesQuery],
  );

  useEffect(() => {
    form.reset({
      ...companyData,
      ...companyData?.companyAddress,
      ...companyData?.parentCompany,
      ...companyData?.bankAccountDetails?.[0],
      parentCompany: companyData?.parentCompany?._id || companyData?.parentCompany,
      stateAndStateCode: `(${companyData?.companyAddress?.stateCode}) ${companyData?.companyAddress?.state}`,
    });
  }, [companyData]);

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit}>
        <div className="px-8 pt-4">
          <div className="text-2xl font-bold">Basic information</div>
          <div className="grid grid-cols-2 py-4 gap-2">
            <ControlledTextInput name="companyName" label="Company Name" withAsterisk />
            <ControlledTextInput name="email" label="Email" />
            <ControlledTextInput name="contactNumber" label="Contact Number" />
            <ControlledTextInput name="fax" label="Fax Number" />
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

          <div className="flex flex-col gap-4">
            {type === 'sisterCompany' ? (
              <ControlledSelect
                clearable
                searchable
                name="parentCompany"
                label="Parent Company"
                data={parentCompanies}
                dropdownComponent={parentCompaniesDropdown}
              />
            ) : null}
            <ControlledTextInput name="address" label="Address" />
          </div>

          <div className="grid grid-cols-2 py-4 gap-2">
            <ControlledSelect
              clearable
              searchable
              name="stateAndStateCode"
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

export default AddCoCompanyContent;

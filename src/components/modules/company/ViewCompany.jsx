import { Divider, Loader } from '@mantine/core';

const ViewCompany = ({ type, companyData, isLoading }) => {
  if (isLoading) {
    return <Loader className="mx-auto my-4" />;
  }
  return (
    <div className="py-4">
      <div className="text-lg font-bold">Basic Information</div>
      <div className="grid grid-cols-2 py-4 gap-4">
        <div>
          <div className="text-base text-gray-400 font-normal">Company Name</div>
          <div>{companyData?.companyName || '-'} </div>
        </div>
        <div>
          <div className="text-base text-gray-400 font-normal">Email</div>
          <div>{companyData?.email || '-'} </div>
        </div>
        <div>
          <div className="text-base text-gray-400 font-normal">Contact Number</div>
          <div>{companyData?.contactNumber || '-'} </div>
        </div>
        <div>
          <div className="text-base text-gray-400 font-normal">Fax Number</div>
          <div>{companyData?.fax || '-'} </div>
        </div>
        <div>
          <div className="text-base text-gray-400 font-normal">PAN</div>
          <div>{companyData?.companyPanNumber || '-'} </div>
        </div>
        <div>
          <div className="text-base text-gray-400 font-normal">GSTIN</div>
          <div>{companyData?.companyGstNumber || '-'} </div>
        </div>
        {type === 'company' ? (
          <div>
            <div className="text-base text-gray-400 font-normal">Parent Company</div>
            <div>{companyData?.parentCompany || '-'} </div>
          </div>
        ) : null}
        <div>
          <div className="text-base text-gray-400 font-normal">Nature of Account</div>
          <div>{companyData?.natureOfAccount || '-'} </div>
        </div>
        <div>
          <div className="text-base text-gray-400 font-normal">Company Type</div>
          <div>{companyData?.companyType || '-'} </div>
        </div>
        <div>
          <div className="text-base text-gray-400 font-normal">City</div>
          <div>{companyData?.companyAddress?.city || '-'} </div>
        </div>
        <div>
          <div className="text-base text-gray-400 font-normal">State</div>
          <div>{companyData?.companyAddress?.state || '-'} </div>
        </div>
        <div>
          <div className="text-base text-gray-400 font-normal">State Code</div>
          <div>{companyData?.companyAddress?.stateCode || '-'} </div>
        </div>
        <div>
          <div className="text-base text-gray-400 font-normal">Parent Account</div>
          <div>{companyData?.parentCompany?.name || '-'} </div>
        </div>
        <div>
          <div className="text-base text-gray-400 font-normal">Address</div>
          <div>{companyData?.companyAddress?.address || '-'} </div>
        </div>
      </div>

      <Divider className="mb-4" />
      <div className="text-lg font-bold">Bank Information</div>
      <div className="grid grid-cols-2 py-4 gap-4">
        <div>
          <div className="text-base text-gray-400 font-normal">Account No</div>
          <div>{companyData?.bankAccountDetails?.[0]?.accountNo || '-'} </div>
        </div>
        <div>
          <div className="text-base text-gray-400 font-normal">Account Holder Name</div>
          <div>{companyData?.bankAccountDetails?.[0]?.accountHolderName || '-'} </div>
        </div>
        <div>
          <div className="text-base text-gray-400 font-normal">IFSC</div>
          <div>{companyData?.bankAccountDetails?.[0]?.ifsc || '-'} </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCompany;

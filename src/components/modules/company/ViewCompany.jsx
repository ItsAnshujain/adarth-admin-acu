import { Divider } from '@mantine/core';

const ViewCompany = ({ type, data = {} }) => (
  <div className="py-4">
    <div className="text-lg font-bold">Basic Information</div>
    <div className="grid grid-cols-2 py-4 gap-4">
      <div>
        <div className="text-base text-gray-400 font-normal">Company Name</div>
        <div>{data?.companyName || '-'} </div>
      </div>
      <div>
        <div className="text-base text-gray-400 font-normal">Email</div>
        <div>{data?.email || '-'} </div>
      </div>
      <div>
        <div className="text-base text-gray-400 font-normal">Contact Number</div>
        <div>{data?.contactNumber || '-'} </div>
      </div>
      <div>
        <div className="text-base text-gray-400 font-normal">Fax Number</div>
        <div>{data?.faxNumber || '-'} </div>
      </div>
      <div>
        <div className="text-base text-gray-400 font-normal">PAN</div>
        <div>{data?.pan || '-'} </div>
      </div>
      <div>
        <div className="text-base text-gray-400 font-normal">GSTIN</div>
        <div>{data?.gstin || '-'} </div>
      </div>
      {type === 'company' ? (
        <div>
          <div className="text-base text-gray-400 font-normal">Parent Company</div>
          <div>{data?.parentCompany || '-'} </div>
        </div>
      ) : null}
      <div />
      <div>
        <div className="text-base text-gray-400 font-normal">Nature of Account</div>
        <div>{data?.natureOfAccount || '-'} </div>
      </div>
      <div>
        <div className="text-base text-gray-400 font-normal">Company Type</div>
        <div>{data?.companyType || '-'} </div>
      </div>
      <div>
        <div className="text-base text-gray-400 font-normal">City</div>
        <div>{data?.city || '-'} </div>
      </div>
      <div>
        <div className="text-base text-gray-400 font-normal">State</div>
        <div>{data?.state || '-'} </div>
      </div>
      <div>
        <div className="text-base text-gray-400 font-normal">State Code</div>
        <div>{data?.stateCode || '-'} </div>
      </div>
      <div>
        <div className="text-base text-gray-400 font-normal">Parent Account</div>
        <div>{data?.parentAccount || '-'} </div>
      </div>
    </div>
    <div>
      <div className="text-base text-gray-400 font-normal">Address</div>
      <div>{data?.address || '-'} </div>
    </div>
    <Divider className="my-4" />
    <div className="text-lg font-bold">Bank Information</div>
    <div className="grid grid-cols-2 py-4 gap-4">
      <div>
        <div className="text-base text-gray-400 font-normal">Account No</div>
        <div>{data?.accountNumber || '-'} </div>
      </div>
      <div>
        <div className="text-base text-gray-400 font-normal">Account Holder Name</div>
        <div>{data?.accountHolderName || '-'} </div>
      </div>
      <div>
        <div className="text-base text-gray-400 font-normal">IFSC</div>
        <div>{data?.ifsc || '-'} </div>
      </div>
    </div>
  </div>
);

export default ViewCompany;

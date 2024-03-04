import { Divider } from '@mantine/core';

const ViewContact = ({ data = {} }) => (
  <div className="py-4">
    <div className="text-lg font-bold">Basic Information</div>
    <div className="grid grid-cols-2 py-4 gap-4">
      <div>
        <div className="text-base text-gray-400 font-normal">Name</div>
        <div>{data?.name || '-'} </div>
      </div>
      <div>
        <div className="text-base text-gray-400 font-normal">Contact Number</div>
        <div>{data?.contactNumber || '-'} </div>
      </div>
      <div>
        <div className="text-base text-gray-400 font-normal">Email</div>
        <div>{data?.email || '-'} </div>
      </div>
      <div>
        <div className="text-base text-gray-400 font-normal">Department</div>
        <div>{data?.department || '-'} </div>
      </div>
      <div>
        <div className="text-base text-gray-400 font-normal">Company Name</div>
        <div>{data?.companyName || '-'} </div>
      </div>
      <div>
        <div className="text-base text-gray-400 font-normal">Parent Company Name</div>
        <div>{data?.parentCompanyName || '-'} </div>
      </div>

      <div>
        <div className="text-base text-gray-400 font-normal">City</div>
        <div>{data?.city || '-'} </div>
      </div>
      <div>
        <div className="text-base text-gray-400 font-normal">State and State Code</div>
        <div>{data?.stateAndStateCode || '-'} </div>
      </div>
      <div>
        <div className="text-base text-gray-400 font-normal">Birthday</div>
        <div>{data?.birthday || '-'} </div>
      </div>
    </div>

    <Divider className="my-4" />
  </div>
);

export default ViewContact;

import { Text } from '@mantine/core';

const PreviewLocation = () => (
  <div className="flex gap-8  p-4 col-span-2 mt-4 border rounded-md flex-1 mb-10 ml-5 mr-7">
    <div className="flex-1 ">
      <Text color="gray" size="md" weight="300">
        Address
      </Text>
      <Text className="mb-4">
        Melvin Porter P.O. Box 132 1599 Curabitur Rd. Bandera South Dakota 45149
      </Text>
      <div className="grid grid-cols-2">
        <div>
          <Text color="gray" size="md" weight="300">
            District
          </Text>
          <Text className="mb-4">Some District</Text>
        </div>
        <div>
          <Text color="gray" size="md" weight="300">
            State
          </Text>
          <Text className="mb-4">Some State</Text>
        </div>
      </div>
      <Text color="gray" size="md" weight="300">
        Pin Code
      </Text>
      <Text className="mb-4">1574516</Text>
    </div>
    <div className="flex-1">Map Place holder</div>
  </div>
);

export default PreviewLocation;

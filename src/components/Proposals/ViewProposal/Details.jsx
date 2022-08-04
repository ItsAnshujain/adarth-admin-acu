import { Text } from '@mantine/core';

const Details = () => (
  <div className="mt-4 pl-5 pr-7">
    <Text size="xl" weight="bold">
      Proposal Details
    </Text>
    <div className="border p-5 pr-8 mt-2 flex flex-col gap-4">
      <Text weight="bold">New Proposal</Text>
      <Text size="sm">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem fugit tenetur amet ex,
        doloremque maiores non sint sit quaerat, ad libero. Modi, dolore? Exercitationem ex pariatur
        aliquid, dicta quo itaque.
      </Text>
      <div className="flex gap-32">
        <div>
          <Text color="grey" weight="400">
            Total Spaces
          </Text>
          <Text weight="bolder">487849</Text>
        </div>
        <div>
          <Text color="grey" weight="400">
            Total Media
          </Text>
          <Text weight="bolder">474894</Text>
        </div>
        <div>
          <Text color="grey" weight="400">
            Expected Impressions
          </Text>
          <Text weight="bolder">4487894</Text>
        </div>
        <div>
          <Text color="grey" weight="400">
            Total Cities
          </Text>
          <Text weight="bolder">49u4</Text>
        </div>
      </div>
      <div>
        <Text color="grey" weight="400">
          Price
        </Text>
        <Text weight="bolder">23487489</Text>
      </div>
    </div>
  </div>
);

export default Details;

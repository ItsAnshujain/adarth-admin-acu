import { useState } from 'react';
import { Text, Pagination } from '@mantine/core';
import Preview from '../../shared/Preview';
import map from '../../../assets/mapplaceholder.png';
import dummya from '../../../assets/dummya.png';
import Places from '../ViewCampaigns/UI/Places';

const dummyDataObj = {
  img: dummya,
  status: 'Available',
  name: 'Open Digital Billboard',
  address: 'M G Road TOI Building Towards Brigade Road',
  cost: 230000,
  impression: 3833737,
  dimensions: '40 x12ft',
  format: 'JPEG,PNG',
  lighting: 'lighting',
  from_date: '02/12/2022',
  to_date: '02/12/2022',
};

const dummyData = new Array(3).fill(dummyDataObj);

const PreviewCampaign = () => {
  const [activePage, setPage] = useState(1);

  return (
    <>
      <Preview />
      <div className="pl-5 pr-7 flex flex-col">
        <Text size="lg" weight="bold">
          Location Details
        </Text>
        <Text size="sm" weight="lighter">
          All the places been covered by this campaign
        </Text>
        <div className="mt-1 mb-8">
          <img src={map} alt="map" />
        </div>

        <Text size="lg" weight="bolder">
          Places In The Campaign
        </Text>
        <Text text="sm" weight="lighter">
          All the places been cover by this campaign
        </Text>
        <div>
          {dummyData.map(data => (
            <Places data={data} />
          ))}
        </div>
      </div>
      <Pagination
        className="absolute bottom-0 right-10 gap-0"
        page={activePage}
        onChange={setPage}
        total={1}
        color="dark"
      />
    </>
  );
};

export default PreviewCampaign;

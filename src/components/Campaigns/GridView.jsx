import { Pagination, Skeleton } from '@mantine/core';
import Card from './Card';

const skeletonList = () =>
  Array.apply('', Array(5)).map((_, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <Skeleton height={410} width={273} radius="sm" key={index} />
  ));

const GridView = ({
  list,
  totalPages = 1,
  activePage = 1,
  setActivePage = () => {},
  isLoadingList,
}) => (
  <>
    <div className="flex flex-wrap mx-5 gap-6 mb-8">
      {list.map(item => (
        <Card key={item?._id} data={item} />
      ))}
      {isLoadingList ? skeletonList() : null}
    </div>
    <div className="flex justify-end my-4 pr-7">
      <Pagination
        styles={theme => ({
          item: {
            color: theme.colors.gray[9],
            fontWeight: 100,
            fontSize: '0.7em',
          },
        })}
        page={activePage}
        onChange={setActivePage}
        total={totalPages}
      />
    </div>
  </>
);

export default GridView;

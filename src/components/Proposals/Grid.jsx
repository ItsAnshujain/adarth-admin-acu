import { Pagination, Skeleton } from '@mantine/core';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Card from './Card';

const skeletonList = () =>
  Array.apply('', Array(5)).map(_ => (
    <Skeleton height={270} width={270} radius="sm" key={uuidv4()} />
  ));

const GridView = ({
  list,
  totalPages = 1,
  activePage = 1,
  setActivePage = () => {},
  isLoadingList,
}) => (
  <div>
    <div className="flex flex-wrap mx-5 gap-6 mb-8 h-[70%] overflow-y-auto">
      {list.map(item => (
        <Link to={`view-details/${item?._id}`}>
          <Card key={item._id} proposalData={item} />
        </Link>
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
  </div>
);

export default GridView;

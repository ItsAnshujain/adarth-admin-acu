import { useState } from 'react';
import { Pagination } from '@mantine/core';

// TODO : Add pagination
const GridView = ({ Card }) => {
  const [data, _] = useState(new Array(50).fill(true));
  const [activePage, setActivePage] = useState(1);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4  mx-5 justify-between gap-8 mb-10 pr-7">
        {data.map((dat, index) => (
          <Card key={Math.random() * 100000000000000000} id={index} />
        ))}
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
          total={10}
        />
      </div>
    </>
  );
};

export default GridView;

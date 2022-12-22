import { Pagination, Skeleton } from '@mantine/core';
import { useFormContext } from '../../context/formContext';
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
}) => {
  const { values, setFieldValue } = useFormContext();

  const handleCardSelection = (cardId, item) => {
    if (values.spaces?.includes(item)) {
      const tempArr = [...values.spaces];
      setFieldValue(
        'spaces',
        tempArr.filter(existingitem => existingitem._id !== item._id),
      );
    } else {
      const tempArr = [...values.spaces];
      tempArr.push(item);
      setFieldValue('spaces', tempArr);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 mx-5 justify-between mb-10">
        {list.map(item => (
          <Card
            key={item?._id}
            data={item}
            isSelected={values?.spaces?.includes(item)}
            onSelect={cardId => handleCardSelection(cardId, item)}
          />
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
};

export default GridView;

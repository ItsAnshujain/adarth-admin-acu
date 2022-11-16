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
  selectedCards = [],
  setSelectedCards = () => {},
}) => {
  const handleCardSelection = (cardId, itemId) => {
    if (selectedCards.includes(itemId)) {
      setSelectedCards(selectedCards.filter(ele => ele !== itemId));
    } else {
      const tempArr = [...selectedCards];
      tempArr.push(cardId);
      setSelectedCards(tempArr); // TODO: use immmer
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 mx-5 justify-between mb-10">
        {list.map(item => (
          <Card
            key={item?._id}
            data={item}
            isSelected={selectedCards.includes(item._id)}
            onSelect={cardId => handleCardSelection(cardId, item._id)}
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

import { useState, useEffect } from 'react';
import Card from './Card';
import data from '../Dummydata/CardData';

// TODO : Add pagination
const GridView = ({ count, page = 1, selectAll }) => {
  const state = new Array(100).fill(false);
  const [checkbox, setCheckbox] = useState(state);
  const newData = data.slice(count * page, count * page + count);
  const handleCheckboxClick = index => {
    setCheckbox(prevState => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };
  useEffect(() => {
    if (selectAll) {
      setCheckbox(state.fill(true));
    } else {
      setCheckbox(state.fill(false));
    }
  }, [selectAll]);

  return (
    <div className="flex flex-wrap mx-5 justify-between gap-y-8 ">
      {newData.map((each, index) => (
        <Card
          key={Math.random() * 100000000000000000}
          data={each}
          checkbox={checkbox[index]}
          handleCheckbox={() => handleCheckboxClick(index)}
        />
      ))}
    </div>
  );
};

export default GridView;

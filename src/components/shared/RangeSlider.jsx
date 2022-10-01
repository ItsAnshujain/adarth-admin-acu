import React, { useState } from 'react';
import { RangeSlider as MantineRangeSlider } from '@mantine/core';

const RangeSlider = ({ marks, controlledRangeValue, setControlledRangeValue, ...props }) => {
  const [rangeValue, setRangeValue] = useState([2000, 8000]);

  const handleChange = e => {
    setControlledRangeValue(e);
    setRangeValue(e);
  };

  return (
    <MantineRangeSlider
      value={controlledRangeValue || rangeValue}
      onChange={handleChange}
      marks={marks}
      {...props}
    />
  );
};

export default RangeSlider;

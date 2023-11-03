import { getWord } from 'num-count';
import React, { memo } from 'react';

const ImpressionContent = ({ impressionMax }) => (
  <p className="capitalize w-32">{impressionMax ? getWord(impressionMax) : 'NA'}</p>
);

export default memo(ImpressionContent);

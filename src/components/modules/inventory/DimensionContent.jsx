import { isArray } from 'lodash';
import React, { memo } from 'react';

const DimensionContent = ({ list }) => (
  <div className="flex gap-x-2">
    <p>
      {list && isArray(list)
        ? list
            .map((ele, index) =>
              index < 2 ? `${ele?.width || 0}ft x ${ele?.height || 0}ft` : null,
            )
            .filter(ele => ele !== null)
            .join(', ')
        : '-'}
    </p>
  </div>
);

export default memo(DimensionContent);

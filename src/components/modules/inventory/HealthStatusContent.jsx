import React, { memo } from 'react';
import { Progress } from '@mantine/core';

const HealthStatusContent = ({ health }) => (
  <div className="w-24">
    <Progress
      sections={[
        { value: health, color: 'green' },
        { value: 100 - health, color: 'red' },
      ]}
    />
  </div>
);

export default memo(HealthStatusContent);

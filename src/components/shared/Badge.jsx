import { Badge } from '@mantine/core';

const CustomBadge = ({ radius, color, variant, text, size }) => (
  <Badge radius={radius} color={color} variant={variant} size={size}>
    {text}
  </Badge>
);

export default CustomBadge;

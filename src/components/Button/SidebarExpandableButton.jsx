import { Group, Text, Accordion } from '@mantine/core';
import Mail from '../../assets/Icons/Mail';

const AccordionLabel = ({ label }) => (
  <Group noWrap>
    <Mail stroke="#969EA1" />
    <div>
      <Text>{label}</Text>
    </div>
  </Group>
);

// TODO add Links to text field in Accordion Item
const SidebarExpandableButton = ({ item }) => (
  <Accordion
    sx={theme => ({
      backgroundColor: theme.colors.gray[0],
      'div h3 button': {
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 8,
        paddingRight: 3,
      },
    })}
    iconPosition="right"
  >
    <Accordion.Item label={<AccordionLabel {...item} />}>
      <div className="ml-7">
        {item.content.map(text => (
          <Text key={Math.random() * 1000000000} size="sm">
            {text}
          </Text>
        ))}
      </div>
    </Accordion.Item>
  </Accordion>
);

export default SidebarExpandableButton;

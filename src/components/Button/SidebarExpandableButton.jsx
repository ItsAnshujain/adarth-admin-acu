import { Group, Text, Accordion } from '@mantine/core';
import { useId } from 'react';
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
const SidebarExpandableButton = ({ item }) => {
  const id = useId();
  return (
    <Accordion
      sx={theme => ({
        backgroundColor: theme.colors.gray[0],
        'button': {
          paddingTop: 4,
          paddingBottom: 4,
          paddingLeft: 8,
          paddingRight: 3,
        },
      })}
      chevronPosition="right"
    >
      <Accordion.Item value={id}>
        <Accordion.Control>
          <AccordionLabel {...item} />
        </Accordion.Control>
        <Accordion.Panel>
          <div className="ml-5">
            {item.content.map(text => (
              <Text key={text} size="sm">
                {text}
              </Text>
            ))}
          </div>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};

export default SidebarExpandableButton;

import { Box, Button, Checkbox, Group, Image, Radio, TextInput } from '@mantine/core';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Mail, Link as LinkIcon, MessageSquare } from 'react-feather';
import classNames from 'classnames';
import whatsapp from '../../../assets/whatsapp.svg';

const fileType = [
  { name: 'PPT', _id: 'ppt' },
  { name: 'PDF', _id: 'pdf' },
  { name: 'EXCEL', _id: 'excel' },
];

const sendVia = [
  {
    name: 'Email',
    _id: 'email',
    placeholder: 'Email Address',
    icon: <Mail className="text-black h-5" />,
  },
  {
    name: 'WhatsApp',
    _id: 'whatsapp',
    placeholder: 'WhatsApp Number',
    icon: <Image src={whatsapp} alt="whatsapp" />,
  },
  {
    name: 'Message',
    _id: 'message',
    placeholder: 'Phone Number',
    icon: <MessageSquare className="text-black h-5" />,
  },
  {
    name: 'Copy Link',
    _id: 'copy_link',
    icon: <LinkIcon className="h-4" color="#000" />,
  },
];

const ShareContent = () => {
  const [activeFileType, setActiveFileType] = useState([]);
  const [activeShare, setActiveShare] = useState('');

  const handleActiveFileType = value => {
    let tempArr = [...activeFileType]; // TODO: use immmer
    if (tempArr.some(item => item === value)) {
      tempArr = tempArr.filter(item => item !== value);
    } else {
      tempArr.push(value);
    }
    setActiveFileType(tempArr);
  };

  const handleActiveShare = value => {
    setActiveShare(value);
  };

  return (
    <Box className="flex flex-col px-7">
      <div>
        <p className="font-medium text-xl mb-2">Select file type:</p>
        <div className="grid grid-cols-3 gap-2 mb-2">
          {fileType.map(item => (
            <Checkbox
              key={uuidv4()}
              onChange={event => handleActiveFileType(event.target.value)}
              label={item.name}
              defaultValue={item._id}
              className="font-medium"
              checked={activeFileType.includes(item._id)}
            />
          ))}
        </div>
      </div>
      <div className="my-2">
        <p className="font-medium text-xl mb-2">Share via:</p>
        <Group className="grid grid-cols-1">
          {sendVia.map(item => (
            <Group
              className={classNames(
                activeShare === item._id && 'bg-gray-100',
                'col-span-1 grid grid-cols-2 items-start',
              )}
              key={uuidv4()}
            >
              <Radio
                onChange={event => handleActiveShare(event.target.value)}
                label={item.name}
                defaultValue={item._id}
                checked={activeShare === item._id}
                className="font-medium"
              />
              {activeShare === item._id && (
                <div>
                  <TextInput placeholder="Name" className="mb-2" />
                  {item._id !== 'copy_link' ? <TextInput placeholder={item.placeholder} /> : null}
                  <Button
                    className="secondary-button font-medium text-base mt-2 w-full"
                    leftIcon={item.icon}
                  >
                    {item._id === 'copy_link' ? 'Copy' : 'Send'}
                  </Button>
                </div>
              )}
            </Group>
          ))}
        </Group>
      </div>
    </Box>
  );
};

export default ShareContent;

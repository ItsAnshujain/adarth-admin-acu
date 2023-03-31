import { Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React, { useState } from 'react';
import CookiePolicyContent from './DocAndPolicies/CookiePolicyContent';
import DisclaimerPolicyContent from './DocAndPolicies/DisclaimerPolicyContent';
import PrivacyPolicyContent from './DocAndPolicies/PrivacyPolicyContent';
import SidebarContent from './SidebarContent';

const docTypes = {
  privacyPolicy: PrivacyPolicyContent,
  disclaimerPolicy: DisclaimerPolicyContent,
  cookiePolicy: CookiePolicyContent,
};

const Sidebar = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [currentContent, setCurrentContent] = useState('privacyPolicy');

  const Preview = docTypes[currentContent] ?? <div />;

  const handleModal = type => {
    setCurrentContent(type);
    open();
  };

  return (
    <div className="hidden lg:block lg:col-span-2 pt-4 bg-purple-450 overflow-y-auto">
      <div className="h-full flex flex-col justify-between">
        <SidebarContent className="gap-3 px-5" />
        <ui className="p-5 text-white">
          <li>
            <Button className="p-0 text-base" onClick={() => handleModal('privacyPolicy')}>
              Privacy Policy
            </Button>
          </li>
          <li>
            <Button className="p-0 text-base " onClick={() => handleModal('disclaimerPolicy')}>
              Disclaimer policy
            </Button>
          </li>
          <li>
            <Button className="p-0 text-base" onClick={() => handleModal('cookiePolicy')}>
              Cookie Policy
            </Button>
          </li>
        </ui>
      </div>
      <Modal
        opened={opened}
        onClose={close}
        withCloseButton={false}
        centered
        size="xl"
        overlayBlur={3}
        overlayOpacity={0.55}
        radius={0}
        padding={0}
        classNames={{
          header: 'pt-2',
          body: 'py-4',
          close: 'mr-4',
        }}
      >
        <Preview />
      </Modal>
    </div>
  );
};

export default Sidebar;

import React from 'react';

import SidebarContent from './SidebarContent';

const Sidebar = () => (
  <div className="hidden lg:block lg:col-span-2 pt-4 bg-purple-450">
    <SidebarContent className="gap-3 px-5" />
  </div>
);

export default Sidebar;

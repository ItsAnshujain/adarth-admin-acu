import React from 'react';

import SidebarContent from './SidebarContent';

const Sidebar = () => (
  <div className="hidden lg:block lg:col-span-2 mt-4">
    <SidebarContent className="gap-3 px-5" />
  </div>
);

export default Sidebar;

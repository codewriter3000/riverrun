import { Outlet } from 'react-router-dom';
import { Content, Column, Grid } from '@carbon/react';
import { AppHeader } from './AppHeader';
import { AppSidebar } from './AppSidebar';

import './_layout.scss';

export const AppLayout: React.FC = () => {
  return (
    <div className="app-layout">
      <AppHeader />
      <div className="app-layout-body">
        <Content className="app-content">
          <Outlet />
        </Content>
      </div>
    </div>
  );
};

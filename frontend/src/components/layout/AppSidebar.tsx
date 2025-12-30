import {
  SideNav,
  SideNavItems,
  SideNavLink,
  SideNavMenu,
  SideNavMenuItem,
} from '@carbon/react';
import {
  Dashboard,
  Document,
  TaskView,
  Flow,
  WhitePaper,
  Settings,
} from '@carbon/icons-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const AppSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasRole } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <SideNav
      aria-label="Side navigation"
      isFixedNav
      expanded
      isChildOfHeader={false}
    >
      <SideNavItems>
        <SideNavLink
          renderIcon={Dashboard}
          onClick={() => navigate('/dashboard')}
          isActive={isActive('/dashboard')}
        >
          Dashboard
        </SideNavLink>

        <SideNavLink
          renderIcon={Document}
          onClick={() => navigate('/cases')}
          isActive={isActive('/cases')}
        >
          Cases
        </SideNavLink>

        <SideNavLink
          renderIcon={TaskView}
          onClick={() => navigate('/tasks')}
          isActive={isActive('/tasks')}
        >
          Tasks
        </SideNavLink>

        {hasRole('ADMIN') && (
          <>
            <SideNavLink
              renderIcon={WhitePaper}
              onClick={() => navigate('/forms')}
              isActive={isActive('/forms')}
            >
              Forms
            </SideNavLink>

            <SideNavLink
              renderIcon={Flow}
              onClick={() => navigate('/workflows')}
              isActive={isActive('/workflows')}
            >
              Workflows
            </SideNavLink>

            <SideNavMenu
              renderIcon={Settings}
              title="Administration"
              defaultExpanded={location.pathname.startsWith('/admin')}
            >
              <SideNavMenuItem
                onClick={() => navigate('/admin/users')}
                isActive={isActive('/admin/users')}
              >
                Users
              </SideNavMenuItem>
              <SideNavMenuItem
                onClick={() => navigate('/admin/audit')}
                isActive={isActive('/admin/audit')}
              >
                Audit Logs
              </SideNavMenuItem>
            </SideNavMenu>
          </>
        )}
      </SideNavItems>
    </SideNav>
  );
};

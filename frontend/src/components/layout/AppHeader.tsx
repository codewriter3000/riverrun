import {
  Header,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderGlobalAction,
  HeaderPanel,
  Switcher,
  SwitcherItem,
} from '@carbon/react';
import { Notification, UserAvatar, Logout } from '@carbon/icons-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';

export const AppHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Header aria-label="Riverrun">
      <HeaderName prefix="Riverrun">
        Case Management
      </HeaderName>

      <HeaderNavigation aria-label="Main Navigation">
        <HeaderMenuItem onClick={() => navigate('/dashboard')}>
          Dashboard
        </HeaderMenuItem>
        <HeaderMenuItem onClick={() => navigate('/cases')}>
          Cases
        </HeaderMenuItem>
        <HeaderMenuItem onClick={() => navigate('/tasks')}>
          Tasks
        </HeaderMenuItem>
        {user?.roles.includes('ADMIN') && (
          <>
            <HeaderMenuItem onClick={() => navigate('/forms')}>
              Forms
            </HeaderMenuItem>
            <HeaderMenuItem onClick={() => navigate('/workflows')}>
              Workflows
            </HeaderMenuItem>
          </>
        )}
      </HeaderNavigation>

      <HeaderGlobalBar>
        <HeaderGlobalAction
          aria-label="Notifications"
          onClick={() => console.log('Notifications clicked')}
        >
          <Notification size={20} />
        </HeaderGlobalAction>

        <HeaderGlobalAction
          aria-label="User menu"
          isActive={isUserMenuOpen}
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
        >
          <UserAvatar size={20} />
        </HeaderGlobalAction>
      </HeaderGlobalBar>

      <HeaderPanel aria-label="User Menu" expanded={isUserMenuOpen}>
        <Switcher aria-label="User menu options">
          <SwitcherItem aria-label="User info">
            <strong>{user?.username}</strong>
            <div style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>
              {user?.roles.join(', ')}
            </div>
          </SwitcherItem>
          <SwitcherItem
            aria-label="Logout"
            onClick={handleLogout}
          >
            <Logout size={16} style={{ marginRight: '0.5rem' }} />
            Logout
          </SwitcherItem>
        </Switcher>
      </HeaderPanel>
    </Header>
  );
};

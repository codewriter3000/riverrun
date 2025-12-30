import { useNavigate } from 'react-router-dom';
import { Button } from '@carbon/react';

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '1rem'
    }}>
      <h1>403 - Unauthorized</h1>
      <p>You don't have permission to access this page.</p>
      <Button onClick={() => navigate('/dashboard')}>
        Go to Dashboard
      </Button>
    </div>
  );
};

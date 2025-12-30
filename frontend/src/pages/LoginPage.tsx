import { useState, ChangeEvent, MouseEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  Button,
  Checkbox,
  Column,
  Form,
  Grid,
  Heading,
  InlineNotification,
  PasswordInput,
  Section,
  Stack,
  TextInput,
} from '@carbon/react';
import { useAuth } from '../hooks/useAuth';
import { AxiosError } from 'axios';

export const LoginPage: React.FC = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  const invalidLoginErrorText = 'Invalid username and/or password';
  const systemDownErrorText = 'The system appears to be down';
  const [error, setError] = useState('');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) =>
    setUsername(e.target.value);
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);
  const handleRememberMeChange = () => setRememberMe((prevState) => !prevState);

  const handleLogin = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError('');

    try {
      await login(username, password, rememberMe);
      navigate('/dashboard');
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError.message === 'Network Error') {
        setError(systemDownErrorText);
      } else if (axiosError.response?.status === 401 || axiosError.response?.status === 403) {
        setError(invalidLoginErrorText);
      } else {
        setError('An unexpected error occurred');
      }
      console.error(err);
    }
  };

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Grid fullWidth>
      <Column lg={16} md={8} sm={4}>
        {error !== '' && (
          <InlineNotification
            aria-label="login error"
            kind="error"
            title="Login error"
            subtitle={error}
          />
        )}

        <Section level={2} style={{ width: 300, marginTop: 8 }}>
          <Heading>Login</Heading>
          <Form aria-label="login" style={{ marginTop: 12 }}>
            <Stack gap={7}>
              <TextInput
                id="username"
                aria-label="username"
                labelText="Username"
                placeholder="admin"
                onChange={handleUsernameChange}
                value={username}
              />
              <PasswordInput
                id="password"
                aria-label="password"
                labelText="Password"
                onChange={handlePasswordChange}
                value={password}
              />
              <Checkbox
                id="rememberMe"
                aria-label="remember me for 30 days"
                labelText="Remember me for 30 days"
                onChange={handleRememberMeChange}
                checked={rememberMe}
              />
              <Button type="submit" onClick={handleLogin}>
                Login
              </Button>
            </Stack>
          </Form>
        </Section>
      </Column>
    </Grid>
  );
};

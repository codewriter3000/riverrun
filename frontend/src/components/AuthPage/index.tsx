import { useState, ChangeEvent, MouseEvent } from 'react';

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
} from "@carbon/react";

import { authService } from "../../services";
import { AxiosError } from "axios";


function AuthPage() {
  const invalidLoginErrorText = "Invalid username and/or password";
  const systemDownErrorText = "The system appears to be down";
  const [error, setError] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) =>
    setUsername(e.target.value);
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);
  const handleRememberMeChange = () => setRememberMe((prevState) => !prevState);

  const handleLogin = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    authService
      .login({
        username: username,
        password: password,
        rememberMe: rememberMe,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err: AxiosError) => {
        if (err.message === "Network Error") {
          setError(systemDownErrorText);
        } else if (err.message === "Request failed with status code 403") {
          setError(invalidLoginErrorText);
        }

        console.error(err);
      });
  };

  return (
    <Grid fullWidth>
      <Column lg={16} md={8} sm={4}>
        {error != "" && (
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
                placeholder="karen.smith"
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
}

export default AuthPage;
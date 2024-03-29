import React, { memo, useState, useCallback, useContext } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Background from '../../components/Background';
import Logo from '../../components/Logo';
import Header from '../../components/Header';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';
import BackButton from '../../components/BackButton';

import { theme } from '../../styles/themes/default';
import { emailValidator, passwordValidator } from '../../core/utils';
import { useAuth } from '../../hooks/auth';
import { AlertContext } from '../../context';

const Login: React.FC = () => {
  const navigation = useNavigation();
  const { dispatchAlert } = useContext(AlertContext);
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const { handleSignIn } = useAuth();

  const _onLoginPressed = useCallback(
    async (email, password) => {
      const emailError = await emailValidator(email.value);
      const passwordError = await passwordValidator(password.value);

      if (emailError || passwordError) {
        setEmail({ ...email, error: emailError });
        setPassword({ ...password, error: passwordError });
        return;
      }

      try {
        await handleSignIn({
          email: email.value,
          password: password.value,
        });
      } catch ({ message }) {
        if (message.toLowerCase().includes('email')) {
          setEmail({ ...email, error: message });
          setPassword({ ...password, error: '' });
          return;
        }

        if (message.toLowerCase().includes('password')) {
          setPassword({ ...password, error: message });
          setEmail({ ...email, error: '' });
          return;
        }

        dispatchAlert({
          type: 'open',
          alertType: 'error',
          message: message
            ? message
            : 'Something went wrong, please try again later.',
        });

        return;
      }
    },
    [handleSignIn]
  );

  return (
    <Background>
      <BackButton goBack={() => navigation.navigate('Home')} />

      <Logo />

      <Header>Welcome back.</Header>

      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />

      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />

      <View style={styles.forgotPassword}>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.label}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>

      <Button mode="contained" onPress={() => _onLoginPressed(email, password)}>
        Login
      </Button>

      <View style={styles.row}>
        <Text style={styles.label}>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  label: {
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
});

export default memo(Login);

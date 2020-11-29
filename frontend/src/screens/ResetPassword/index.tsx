import React, { memo, useState, useContext } from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useMutation, gql, ApolloError } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { validate as uuidValidate } from 'uuid';

import { passwordValidator } from '../../core/utils';
import Background from '../../components/Background';
import BackButton from '../../components/BackButton';
import Logo from '../../components/Logo';
import Header from '../../components/Header';
import TextInput from '../../components/TextInput';
import { theme } from '../../styles/themes/default';
import Button from '../../components/Button';
import { AlertContext } from '../../context';

const RESET_PASSWORD = gql`
  mutation ResetPassword($token: String!, $password: String!) {
    resetPassword(resetPasswordInput: { token: $token, password: $password })
  }
`;

type AppProps = { route: { params: { token: string } } };

const ResetPassword = ({ route }: AppProps) => {
  const { dispatchAlert } = useContext(AlertContext);
  const navigation = useNavigation();

  const [token, setToken] = useState({
    value: route?.params?.token && route.params.token,
    error: '',
  });
  const [password, setPassword] = useState({ value: '', error: '' });

  const resetPasswordResponse = () => ({
    onCompleted: async (data: Object) => {
      dispatchAlert({
        type: 'open',
        alertType: 'success',
        message: 'A new password has been set. You can now login.',
      });

      navigation.navigate('Login');
    },
  });

  const [resetPassword] = useMutation(RESET_PASSWORD, resetPasswordResponse());

  const handleResetPassword = async () => {
    const isValidToken = uuidValidate(token.value);

    if (!isValidToken) {
      setToken({ ...token, error: 'Invalid token.' });
      dispatchAlert({
        type: 'open',
        alertType: 'error',
        message: 'Invalid token.',
      });
      return;
    }

    const passwordError = passwordValidator(password.value);

    if (passwordError) {
      setPassword({ ...password, error: passwordError });
      return;
    }

    try {
      await resetPassword({
        variables: { token: token.value, password: password.value },
      });
    } catch ({ message }) {
      if (message.toLowerCase().includes('password')) {
        setPassword({ ...password, error: message });
        return;
      }

      dispatchAlert({
        type: 'open',
        alertType: 'error',
        message,
      });
    }
  };

  return (
    <Background>
      <BackButton goBack={() => navigation.navigate('Login')} />
      <Logo />

      <Header>Reset Password</Header>

      <TextInput
        label="New Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />

      <Button
        mode="contained"
        onPress={handleResetPassword}
        style={styles.button}
      >
        Reset Password
      </Button>

      <TouchableOpacity
        style={styles.back}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.label}>← Back to login</Text>
      </TouchableOpacity>
    </Background>
  );
};

const styles = StyleSheet.create({
  back: {
    width: '100%',
    marginTop: 12,
  },
  button: {
    marginTop: 12,
  },
  label: {
    color: theme.colors.secondary,
    width: '100%',
  },
});

export default memo(ResetPassword);

import React, { memo, useState, useContext } from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useMutation, gql } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';

import { emailValidator } from '../../core/utils';
import Background from '../../components/Background';
import BackButton from '../../components/BackButton';
import Logo from '../../components/Logo';
import Header from '../../components/Header';
import TextInput from '../../components/TextInput';
import { theme } from '../../styles/themes/default';
import Button from '../../components/Button';
import { AlertContext } from '../../context';

const FORGOT_PASSWORD_EMAIL = gql`
  mutation PasswordRecoveryEmail($email: String!) {
    passwordRecoveryEmail(passwordRecoveryEmailInput: { email: $email })
  }
`;

const ForgotPasswordScreen: React.FC = () => {
  const { dispatchAlert } = useContext(AlertContext);
  const navigation = useNavigation();
  const [email, setEmail] = useState({ value: '', error: '' });

  const passwordRecoveryResponse = () => ({
    onCompleted: async (data: Object) => {
      dispatchAlert({
        type: 'open',
        alertType: 'success',
        message: 'Recovery instructions have been sent to your email.',
      });

      navigation.navigate('Login');
    },
    onError: async (error: Error) => {
      dispatchAlert({
        type: 'open',
        alertType: 'error',
        message: error.message,
      });
    },
  });

  const [passwordRecoveryEmail] = useMutation(
    FORGOT_PASSWORD_EMAIL,
    passwordRecoveryResponse()
  );

  const _onSendPressed = async () => {
    const emailError = emailValidator(email.value);

    if (emailError) {
      setEmail({ ...email, error: emailError });
      return;
    }

    try {
      await passwordRecoveryEmail({
        variables: { email: email.value },
      });
    } catch (err) {
      setEmail({ ...email, error: err.message });
      return;
    }
  };

  return (
    <Background>
      <BackButton goBack={() => navigation.navigate('Login')} />
      <Logo />

      <Header>Restore Password</Header>

      <TextInput
        label="E-mail address"
        returnKeyType="done"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />

      <Button mode="contained" onPress={_onSendPressed} style={styles.button}>
        Send Reset Instructions
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

export default memo(ForgotPasswordScreen);

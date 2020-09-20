import React, { memo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { gql, useMutation } from '@apollo/client';
import Background from '../../components/Background';
import Logo from '../../components/Logo';
import Header from '../../components/Header';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';
import BackButton from '../../components/BackButton';
import { theme } from '../../styles/themes/default';
import { emailValidator, passwordValidator } from '../../core/utils';

const SIGN_UP = gql`
  mutation SignUp($email: String!, $password: String!) {
    signUp(createUserInput: { email: $email, password: $password })
  }
`;

const Register: React.FC = () => {
  const navigation = useNavigation();
  const [signUp] = useMutation(SIGN_UP);
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });

  const _onSignUpPressed = useCallback(
    async (email, password) => {
      const emailError = emailValidator(email.value);
      const passwordError = passwordValidator(password.value);

      if (emailError || passwordError) {
        setEmail({ ...email, error: emailError });
        setPassword({ ...password, error: passwordError });
        return;
      }

      try {
        await signUp({
          variables: { email: email.value, password: password.value },
        });
        navigation.navigate('Login');
      } catch (err) {
        setEmail({ ...email, error: err.message });
        return;
      }
    },
    [navigation]
  );

  return (
    <Background>
      <BackButton goBack={() => navigation.navigate('Home')} />

      <Logo />

      <Header>Create Account</Header>

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

      <Button
        mode="contained"
        onPress={() => _onSignUpPressed(email, password)}
        style={styles.button}
      >
        Sign Up
      </Button>

      <View style={styles.row}>
        <Text style={styles.label}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  label: {
    color: theme.colors.secondary,
  },
  button: {
    marginTop: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
});

export default memo(Register);

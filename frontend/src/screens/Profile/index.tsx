import React, { memo, useState, useCallback } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
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
import { useAuth } from '../../hooks/auth';

const UPDATE_USER = gql`
  mutation UpdateUser(
    $email: String!
    $old_password: String!
    $password: String!
  ) {
    updateUser(
      updateUserInput: {
        email: $email
        old_password: $old_password
        password: $password
      }
    ) {
      email
    }
  }
`;

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [updateUser] = useMutation(UPDATE_USER);
  const navigation = useNavigation();
  const [email, setEmail] = useState({ value: user.email, error: '' });
  const [oldPassword, setOldPassword] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [confirmPassword, setConfirmPassword] = useState({
    value: '',
    error: '',
  });

  const handleUpdateProfile = async () => {
    const emailError = emailValidator(email.value);

    if (emailError) {
      setEmail({ ...email, error: emailError });
      return;
    }

    if (password.value !== confirmPassword.value) {
      setConfirmPassword({
        ...confirmPassword,
        error: 'New Password & Confirmation do not match',
      });
      return;
    }

    try {
      await updateUser({
        variables: {
          email: email.value,
          old_password: oldPassword.value,
          password: password.value,
        },
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

      setEmail({
        ...email,
        error: message
          ? message
          : 'Something went wrong, please try again later.',
      });
    }
  };

  return (
    <Background>
      <Header>Profile</Header>

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
        accessibilityStates
      />

      <TextInput
        label="Old Password"
        returnKeyType="done"
        value={oldPassword.value}
        onChangeText={(text) => setOldPassword({ value: text, error: '' })}
        error={!!oldPassword.error}
        errorText={oldPassword.error}
        secureTextEntry
        accessibilityStates
      />

      <TextInput
        label="New Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
        accessibilityStates
      />

      <TextInput
        label="Confirm Password"
        returnKeyType="done"
        value={confirmPassword.value}
        onChangeText={(text) => setConfirmPassword({ value: text, error: '' })}
        error={!!confirmPassword.error}
        errorText={confirmPassword.error}
        secureTextEntry
        accessibilityStates
      />

      <Button
        accessibilityStates
        mode="contained"
        onPress={handleUpdateProfile}
      >
        Update Profile
      </Button>
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

export default memo(Profile);

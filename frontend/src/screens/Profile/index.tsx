import React, { memo, useState, useContext, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { gql, useMutation } from '@apollo/client';

import Background from '../../components/Background';
import Header from '../../components/Header';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';

import { theme } from '../../styles/themes/default';
import { emailValidator } from '../../core/utils';
import { useAuth } from '../../hooks/auth';
import { AlertContext } from '../../context';

interface VariablesType {
  email: string;
  old_password?: string;
  password?: string;
}

const UPDATE_USER = gql`
  mutation updateUser(
    $email: String!
    $old_password: String
    $password: String
  ) {
    updateUser(
      updateUserInput: {
        email: $email
        old_password: $old_password
        password: $password
      }
    )
  }
`;

const Profile: React.FC = () => {
  const { dispatchAlert } = useContext(AlertContext);
  const { user, signOut } = useAuth();
  const [email, setEmail] = useState({ value: user.email, error: '' });
  const [oldPassword, setOldPassword] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [confirmPassword, setConfirmPassword] = useState({
    value: '',
    error: '',
  });

  const [disableUpdate, setDisableUpdate] = useState(true);

  const updateUserResponse = () => ({
    onCompleted: async (data: Object) => {
      dispatchAlert({
        type: 'open',
        alertType: 'success',
        message: 'Your information has been updated!',
      });

      signOut();
    },
  });

  const [updateUser] = useMutation(UPDATE_USER, updateUserResponse());

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

    const variables: VariablesType = { email: email.value };

    if (oldPassword.value && password.value) {
      variables.old_password = oldPassword.value;
      variables.password = password.value;
    }

    try {
      await updateUser({
        variables,
      });
    } catch ({ message }) {
      if (message.toLowerCase().includes('email')) {
        setEmail({ ...email, error: message });
        setPassword({ ...password, error: '' });
        return;
      }

      if (message.toLowerCase().includes('old')) {
        setOldPassword({ ...oldPassword, error: message });
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
    }
  };

  const handleEnableButton = (text?: string) => {
    const passwords = document.querySelectorAll<HTMLInputElement>(
      'input[type=password]'
    );
    let passwordSum = 0;

    // If only some of the password fields are empty disable the button
    Array.from(passwords).some((password) => {
      passwordSum += password.value.length;
      setDisableUpdate(password.value.length === 0);
      return password.value.length === 0;
    });

    // Enable button if all password fields are empty but email was changed
    if (passwordSum === 0) {
      setDisableUpdate(text === user.email);
    }
  };

  return (
    <Background>
      <Header>Profile</Header>

      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => {
          setEmail({ value: text, error: '' });
          handleEnableButton(text);
        }}
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
        onChangeText={(text) => {
          setOldPassword({ value: text, error: '' });
          handleEnableButton();
        }}
        error={!!oldPassword.error}
        errorText={oldPassword.error}
        secureTextEntry
        accessibilityStates
      />

      <TextInput
        label="New Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => {
          setPassword({ value: text, error: '' });
          handleEnableButton();
        }}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
        accessibilityStates
      />

      <TextInput
        label="Confirm Password"
        returnKeyType="done"
        value={confirmPassword.value}
        onChangeText={(text) => {
          setConfirmPassword({ value: text, error: '' });
          handleEnableButton();
        }}
        error={!!confirmPassword.error}
        errorText={confirmPassword.error}
        secureTextEntry
        accessibilityStates
      />

      <Button
        disabled={disableUpdate}
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

import React, { memo, useState, useContext, useEffect } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useRoute, RouteProp } from '@react-navigation/native';

import Background from '../../../components/Background';
import Header from '../../../components/Header';
import Button from '../../../components/Button';
import TextInput from '../../../components/TextInput';

import { emailValidator } from '../../../core/utils';
import { AlertContext, UsersListContext } from '../../../context';
import { Keyboard } from 'react-native';
import IUser from '../../../context/usersList/user.interface';

interface VariablesType {
  id: string;
  email: string;
  old_password?: string;
  password?: string;
}

type SimpleStackParamList = {
  EditUser: { userId: string };
};

type EditUserScreenRouteProp = RouteProp<SimpleStackParamList, 'EditUser'>;

const GET_USER = gql`
  query getUser($id: String!) {
    getUser(getUserInput: { id: $id }) {
      id
      email
      role
    }
  }
`;

const UPDATE_USER = gql`
  mutation updateUser(
    $id: String!
    $email: String!
    $old_password: String
    $password: String
  ) {
    updateUser(
      updateUserInput: {
        id: $id
        email: $email
        old_password: $old_password
        password: $password
      }
    )
  }
`;

const EditUser: React.FC = () => {
  const route = useRoute<EditUserScreenRouteProp>();
  const { userId } = route.params;
  const { dispatchAlert } = useContext(AlertContext);
  const { users, setUsers } = useContext(UsersListContext);
  const [user, setUser] = useState<IUser>({
    email: '',
    id: '',
    role: 'member',
  });
  const [email, setEmail] = useState({ value: user.email, error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [confirmPassword, setConfirmPassword] = useState({
    value: '',
    error: '',
  });

  const { data } = useQuery(GET_USER, {
    variables: { id: userId },
    fetchPolicy: 'no-cache',
  });

  const [disableUpdate, setDisableUpdate] = useState(true);

  useEffect(() => {
    if (data) {
      console.log(data);
      const userData = data && data.getUser;
      setUser(userData);
      setEmail({ value: userData.email, error: '' });
      setUsers((users) => {
        const updatedUsers = users.map((x) =>
          x.id === userData.id ? { ...userData } : x
        );
        return updatedUsers;
      });
    }
  }, [data]);

  useEffect(() => {}, [user]);

  const updateUserResponse = () => ({
    onCompleted: async (data: Object) => {
      dispatchAlert({
        type: 'open',
        alertType: 'success',
        message: 'The user has been updated!',
      });

      updateUsersList();
    },
  });

  const updateUsersList = () => {
    const updatedUsers = users.map((x) =>
      x.id === user.id ? { ...user, email: email.value } : x
    );
    setUsers(updatedUsers);
  };

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

    const variables: VariablesType = { id: user.id, email: email.value };

    if (password.value) {
      variables.password = password.value;
      variables.old_password = 'anything';
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

  useEffect(() => {
    const passwords = [password, confirmPassword];
    let passwordSum = 0;

    // If only some of the password fields are empty disable the button
    passwords.forEach((password) => {
      passwordSum += password.value.length !== 0 ? 1 : 0;
      return password.value.length === 0;
    });

    setDisableUpdate(passwordSum !== passwords.length);

    if (
      email.value !== user.email &&
      (passwordSum === 0 || passwordSum === passwords.length)
    ) {
      setDisableUpdate(false);
    }
  }, [password, confirmPassword, email]);

  return (
    <Background>
      <Header>Profile</Header>

      <TextInput
        label="Id"
        value={user.id}
        disabled
        returnKeyType="next"
        accessibilityStates
      />

      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => {
          setEmail({ value: text, error: '' });
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
        label="New Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => {
          setPassword({ value: text, error: '' });
        }}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
        accessibilityStates
        blurOnSubmit={false}
        onSubmitEditing={() => Keyboard.dismiss()}
        textContentType={'oneTimeCode'}
      />

      <TextInput
        label="Confirm Password"
        returnKeyType="done"
        value={confirmPassword.value}
        onChangeText={(text) => {
          setConfirmPassword({ value: text, error: '' });
        }}
        error={!!confirmPassword.error}
        errorText={confirmPassword.error}
        secureTextEntry
        accessibilityStates
        blurOnSubmit={false}
        onSubmitEditing={() => Keyboard.dismiss()}
        textContentType={'oneTimeCode'}
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

export default memo(EditUser);

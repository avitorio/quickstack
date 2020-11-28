import React, { memo, useState, useContext, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Keyboard, View } from 'react-native';
import { Menu } from 'react-native-paper';

import Background from '../../../components/Background';
import Header from '../../../components/Header';
import Button from '../../../components/Button';
import TextInput from '../../../components/TextInput';

import { emailValidator } from '../../../core/utils';
import { AlertContext, UsersListContext } from '../../../context';
import IUser from '../../../context/usersList/user.interface';
import { UPDATE_USER } from '../../../graphql/mutations/updateUser';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { GET_USER } from '../../../graphql/queries/getUser';

interface VariablesType {
  id: string;
  email: string;
  old_password?: string;
  password?: string;
  role?: string;
}

type SimpleStackParamList = {
  EditUser: { userId: string };
};

type EditUserScreenRouteProp = RouteProp<SimpleStackParamList, 'EditUser'>;

const initialUser = {
  email: '',
  id: '',
  role: '',
};

const EditUser: React.FC = () => {
  const route = useRoute<EditUserScreenRouteProp>();
  const { userId } = route.params;
  const { dispatchAlert } = useContext(AlertContext);
  const { users, setUsers } = useContext(UsersListContext);
  const [user, setUser] = useState<IUser>(
    users.find((user) => user.id === userId) || initialUser
  );
  const [email, setEmail] = useState({ value: user.email, error: '' });
  const [role, setRole] = useState({ value: user.role, error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [confirmPassword, setConfirmPassword] = useState({
    value: '',
    error: '',
  });

  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const { data } = useQuery(GET_USER, {
    variables: { id: userId },
    fetchPolicy: 'no-cache',
  });

  const [disableUpdate, setDisableUpdate] = useState(true);

  useEffect(() => {
    if (data) {
      const userData = data && data.getUser;
      setUser(userData);
      setEmail({ value: userData.email, error: '' });
      setRole({ value: userData.role, error: '' });
    }
  }, [data]);

  useEffect(() => {
    const updatedUsers = users.map((x) =>
      x.id === user.id ? { ...user, email: email.value } : x
    );
    setUsers(updatedUsers);
  }, [user]);

  useEffect(() => {}, [user]);

  const updateUserResponse = () => ({
    onCompleted: async (data: Object) => {
      dispatchAlert({
        type: 'open',
        alertType: 'success',
        message: 'The user has been updated!',
      });

      setUser({
        ...user,
        email: email.value,
        role: role.value,
      });
      setDisableUpdate(true);
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

    const variables: VariablesType = { id: user.id, email: email.value };

    if (password.value) {
      variables.password = password.value;
      variables.old_password = 'anything';
    }

    if (role) {
      variables.role = role.value;
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

    const emailChanged = email.value !== user.email;
    const roleChanged = role.value !== user.role;

    if (
      (emailChanged || roleChanged) &&
      (passwordSum === 0 || passwordSum === passwords.length)
    ) {
      setDisableUpdate(false);
    }
  }, [password, confirmPassword, email, role]);

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

      <View
        style={{
          maxWidth: 330,
          width: 300,
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        <Menu
          style={{
            maxWidth: 330,
            width: 300,
          }}
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <TouchableOpacity onPress={openMenu}>
              <TextInput
                style={{
                  maxWidth: 330,
                  width: 300,
                }}
                label="Role"
                value={role.value}
                disabled
              />
            </TouchableOpacity>
          }
        >
          <Menu.Item
            onPress={() => {
              setRole({ ...role, value: 'member' });
              closeMenu();
            }}
            title="Member"
          />
          <Menu.Item
            onPress={() => {
              setRole({ ...role, value: 'admin' });
              closeMenu();
            }}
            title="Admin"
          />
        </Menu>
      </View>

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

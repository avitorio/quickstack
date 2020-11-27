import React, { memo, useContext, useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { Checkbox, IconButton } from 'react-native-paper';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Paragraph from '../../../components/Paragraph';
import Table from '../../../components/Table';
import Background from '../../../components/Background';

import { UsersListContext } from '../../../context';
import IUser from '../../../context/usersList/user.interface';

const GET_USERS = gql`
  query {
    getUsers {
      id
      email
      role
    }
  }
`;

const Users: React.FC = () => {
  const navigation = useNavigation();
  const { users, setUsers } = useContext(UsersListContext);
  const [checkAll, setCheckAll] = useState(false);
  const { loading, error, data } = useQuery(GET_USERS);

  useEffect(() => {
    if (data) {
      const fetchedUsers =
        data &&
        data.getUsers.map((user: IUser) => ({
          id: user.id,
          email: user.email,
          role: user.role,
          checked: false,
        }));
      setUsers(fetchedUsers);
    }
  }, [data]);

  const handleCheckOne = (user: IUser) => {
    const newUsers = users.map((x) => {
      if (x.id === user.id) {
        return {
          ...user,
          checked: !user.checked,
        };
      } else {
        return x;
      }
    });

    setUsers(newUsers);
  };

  const handleCheckAll = () => {
    const newUsers = users.map((user) => ({
      ...user,
      checked: !checkAll ? true : false,
    }));

    setUsers(newUsers);
    setCheckAll(!checkAll);
  };

  return (
    <Background position="top" wrapperWidth="full">
      {loading && <Paragraph>Loading...</Paragraph>}
      {error && <Paragraph>{error.message}</Paragraph>}
      {users && (
        <Table>
          <Table.Header>
            <Table.Title>
              <View style={{ position: 'absolute', marginTop: -6 }}>
                <Checkbox
                  status={checkAll ? 'checked' : 'unchecked'}
                  onPress={handleCheckAll}
                />
              </View>
            </Table.Title>
            <Table.Title>Email</Table.Title>
            <Table.Title>Role</Table.Title>
            <Table.Title numeric>Options</Table.Title>
          </Table.Header>

          {users.map((user) => (
            <Table.Row key={user.id}>
              <Table.Cell>
                <Checkbox
                  status={user.checked ? 'checked' : 'unchecked'}
                  onPress={() => handleCheckOne(user)}
                />
              </Table.Cell>
              <Table.Cell>{user.email}</Table.Cell>
              <Table.Cell>{user.role}</Table.Cell>
              <Table.Cell numeric>
                <IconButton
                  icon="pencil"
                  size={20}
                  accessibilityStates
                  onPress={() =>
                    navigation.navigate('EditUser', { userId: user.id })
                  }
                />
              </Table.Cell>
            </Table.Row>
          ))}

          <Table.Pagination
            page={1}
            numberOfPages={3}
            onPageChange={(page) => {
              console.log(page);
            }}
            label="1-2 of 6"
          />
        </Table>
      )}
    </Background>
  );
};

export default memo(Users);

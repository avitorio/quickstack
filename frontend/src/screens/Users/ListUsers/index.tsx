import React, { memo, useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { Checkbox, IconButton } from 'react-native-paper';
import { View } from 'react-native';

import Paragraph from '../../../components/Paragraph';
import Table from '../../../components/Table';
import Background from '../../../components/Background';
import { useNavigation } from '@react-navigation/native';

interface UserType {
  id: string;
  email: string;
  role: string;
  checked: boolean;
}

const GET_USERS = gql`
  query query {
    getUsers {
      id
      email
      role
    }
  }
`;

const Users: React.FC = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState<UserType[]>([]);
  const [checkAll, setCheckAll] = useState(false);
  const { loading, error, data } = useQuery(GET_USERS);

  useEffect(() => {
    if (data) {
      const users =
        data &&
        data.getUsers.map((user: UserType) => ({
          id: user.id,
          email: user.email,
          role: user.role,
          checked: false,
        }));
      setUsers(users);
    }
  }, [data]);

  const handleCheckOne = (user: UserType) => {
    const newUsers = users.map((x: UserType) => {
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
    const newUsers = users.map((user: UserType) => ({
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
      {data && (
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

          {users.map((user: UserType) => (
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
                  onPress={() => navigation.navigate('EditUser')}
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

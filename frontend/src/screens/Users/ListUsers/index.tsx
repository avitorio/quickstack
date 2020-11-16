import React, { memo } from 'react';
import { gql, useQuery } from '@apollo/client';
import { Checkbox, IconButton } from 'react-native-paper';
import { View, Platform } from 'react-native';

import Paragraph from '../../../components/Paragraph';
import Table from '../../../components/Table';
import Background from '../../../components/Background';
import { useNavigation } from '@react-navigation/native';

const GET_USERS = gql`
  query query {
    getUsers {
      email
      role
    }
  }
`;

const Users: React.FC = () => {
  const navigation = useNavigation();
  const [checked, setChecked] = React.useState(false);
  const { loading, error, data } = useQuery(GET_USERS);

  return (
    <Background position="top" wrapperWidth="full">
      {loading && <Paragraph>Loading...</Paragraph>}
      {error && <Paragraph>{error.message}</Paragraph>}
      {data && (
        <Table>
          <Table.Header>
            {Platform.OS === 'web' && (
              <Table.Title>
                <View>
                  <Checkbox
                    status={checked ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setChecked(!checked);
                    }}
                  />
                </View>
              </Table.Title>
            )}
            <Table.Title>Email</Table.Title>
            <Table.Title>Role</Table.Title>
            <Table.Title>Options</Table.Title>
          </Table.Header>

          {data.getUsers.map((user) => (
            <Table.Row key={user.email}>
              {Platform.OS === 'web' && (
                <Table.Cell>
                  <Checkbox
                    status={checked ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setChecked(!checked);
                    }}
                  />
                </Table.Cell>
              )}
              <Table.Cell>{user.email}</Table.Cell>
              <Table.Cell>{user.role}</Table.Cell>
              <Table.Cell>
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

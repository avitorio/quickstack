import React, { memo } from 'react';
import { DataTable } from 'react-native-paper';
import { gql, useQuery } from '@apollo/client';

import Header from '../../components/Header';
import Paragraph from '../../components/Paragraph';
import Background from '../../components/Background';

const GET_USERS = gql`
  query query {
    getUsers {
      id
      email
    }
  }
`;

const Users: React.FC = () => {

  const { loading, error, data } = useQuery(GET_USERS);

  return (
    <Background>
      <Header>Users</Header>
      {loading && (<Paragraph>Loading...</Paragraph>)}
      {error && (<Paragraph>{error.message}</Paragraph>)}
      {data && (
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Id</DataTable.Title>
            <DataTable.Title>Email</DataTable.Title>
          </DataTable.Header>

          {data.getUsers.map(user => (
            <DataTable.Row key={user.id}>
            <DataTable.Cell>{user.id}</DataTable.Cell>
            <DataTable.Cell >{user.email}</DataTable.Cell>
            </DataTable.Row>
          ))}

          <DataTable.Pagination
            page={1}
            numberOfPages={3}
            onPageChange={page => {
              console.log(page);
            }}
            label="1-2 of 6"
          />
        </DataTable>
      )}
    </Background>
  );
};

export default memo(Users);

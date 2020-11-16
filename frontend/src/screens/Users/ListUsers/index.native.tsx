import React, { memo } from 'react';
import { gql, useQuery } from '@apollo/client';
import { List } from 'react-native-paper';

import Paragraph from '../../../components/Paragraph';
import Section from '../../../components/List';
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
  const { loading, error, data } = useQuery(GET_USERS);

  return (
    <Background position="top" wrapperWidth="full">
      {loading && <Paragraph>Loading...</Paragraph>}
      {error && <Paragraph>{error.message}</Paragraph>}
      {data && (
        <Section>
          {data.getUsers.map((user) => (
            <List.Item
              key={user.email}
              title={user.email}
              description={user.role}
              onPress={() => navigation.navigate('EditUser')}
              style={{
                backgroundColor: 'white',
                borderBottomWidth: 1,
                borderBottomColor: 'gray',
              }}
            />
          ))}
        </Section>
      )}
    </Background>
  );
};

export default memo(Users);

import React, { memo, useContext } from 'react';
import { gql, useQuery } from '@apollo/client';
import { Checkbox, IconButton, List } from 'react-native-paper';
import { View, Platform } from 'react-native';

import Header from '../../components/Header';
import Paragraph from '../../components/Paragraph';
import Section from '../../components/List';
import Background from '../../components/Background';
import { AlertContext } from '../../context';

const GET_USERS = gql`
  query query {
    getUsers {
      email
      role
    }
  }
`;

const Users: React.FC = () => {
  const { dispatchAlert } = useContext(AlertContext);
  const [checked, setChecked] = React.useState(false);
  const { loading, error, data } = useQuery(GET_USERS);
  const [expanded, setExpanded] = React.useState(true);

  const handlePress = () => setExpanded(!expanded);

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
              onPress={() =>
                dispatchAlert({
                  type: 'open',
                  alertType: 'success',
                  message: 'Your information has been updated!',
                })
              }
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

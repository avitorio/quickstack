import React, { memo, useContext, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { List } from 'react-native-paper';
import { useNavigation, useIsFocused } from '@react-navigation/native';

import Paragraph from '../../../components/Paragraph';
import Section from '../../../components/List';
import Background from '../../../components/Background';

import IUser from '../../../context/usersList/user.interface';
import { UsersListContext } from '../../../context';
import { GET_USERS } from '../../../graphql/queries/getUsers';

const Users: React.FC = () => {
  useIsFocused();
  const navigation = useNavigation();
  const { users, setUsers } = useContext(UsersListContext);
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

  return (
    <Background position="top" wrapperWidth="full">
      {loading && <Paragraph>Loading...</Paragraph>}
      {error && <Paragraph>{error.message}</Paragraph>}
      {data && (
        <Section>
          {users.map((user: IUser) => (
            <React.Fragment key={user.email}>
              <List.Item
                title={user.email}
                description={user.role}
                onPress={() =>
                  navigation.navigate('EditUser', { userId: user.id })
                }
                style={{
                  backgroundColor: 'white',
                  borderBottomWidth: 1,
                  borderBottomColor: 'gray',
                }}
                left={(props) => <List.Icon {...props} icon="account-circle" />}
                accessibilityStates
              />
            </React.Fragment>
          ))}
        </Section>
      )}
    </Background>
  );
};

export default memo(Users);

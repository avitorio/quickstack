import React, { memo, useContext, useEffect } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { List } from 'react-native-paper';
import { useNavigation, useIsFocused } from '@react-navigation/native';

import Paragraph from '../../../components/Paragraph';
import Section from '../../../components/List';
import Background from '../../../components/Background';

import IUser from '../../../context/usersList/user.interface';
import { UsersListContext } from '../../../context';
import { GET_USERS } from '../../../graphql/queries/getUsers';

const limit = 10;

const Users: React.FC = () => {
  useIsFocused();
  const navigation = useNavigation();
  const { users, setUsers } = useContext(UsersListContext);

  const [fetchUsers, { loading, error, data, fetchMore }] = useLazyQuery(
    GET_USERS
  );

  useEffect(() => {
    if (data) {
      const fetchedUsers =
        data &&
        data.getUsers.items.map((user: IUser) => ({
          id: user.id,
          email: user.email,
          role: user.role,
          checked: false,
        }));
      setUsers(fetchedUsers);
    }
  }, [data]);

  useEffect(() => {
    fetchUsers({ variables: { limit, page: 1 } });
  }, []);

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
              />
            </React.Fragment>
          ))}
        </Section>
      )}
    </Background>
  );
};

export default memo(Users);

import React, { memo, useContext, useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { Checkbox, IconButton } from 'react-native-paper';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Paragraph from '../../../components/Paragraph';
import Table from '../../../components/Table';
import Background from '../../../components/Background';

import { UsersListContext } from '../../../context';
import IUser from '../../../context/usersList/user.interface';
import { GET_USERS } from '../../../graphql/queries/getUsers';
import { GetUsers_getUsers_meta } from '../../../graphql/generated/GetUsers';

const limit = 2;

const Users: React.FC = () => {
  const navigation = useNavigation();
  const { users, setUsers } = useContext(UsersListContext);
  const [checkAll, setCheckAll] = useState(false);
  const [page, setPage] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(2);
  const [meta, setMeta] = useState({
    currentPage: 1,
    itemCount: 5,
    itemsPerPage: 5,
    totalItems: 6,
    totalPages: 2,
  });

  const [fetchUsers, { loading, error, data, fetchMore }] = useLazyQuery(
    GET_USERS
  );

  useEffect(() => {
    if (data) {
      const fetchedUsers = data.getUsers.items.map((user: IUser) => ({
        id: user.id,
        email: user.email,
        role: user.role,
        checked: false,
      }));
      setMeta(data.getUsers.meta);
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

  useEffect(() => {
    fetchUsers({ variables: { limit, page: 1 } });
  }, []);

  const handleCheckAll = () => {
    const newUsers = users.map((user) => ({
      ...user,
      checked: !checkAll ? true : false,
    }));

    setUsers(newUsers);
    setCheckAll(!checkAll);
  };

  const getPaginationLabel = (
    metaProps: Omit<GetUsers_getUsers_meta, '__typename'>
  ) => {
    const { currentPage, itemsPerPage, itemCount, totalItems } = metaProps;
    const pageStart = currentPage * itemsPerPage - itemsPerPage + 1;
    const pageEnd = (currentPage - 1) * itemsPerPage + itemCount;

    return `${pageStart} - ${pageEnd} of ${totalItems}`;
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
            <Table.Title>Options</Table.Title>
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
              <Table.Cell>
                <IconButton
                  icon="pencil"
                  size={20}
                  onPress={() =>
                    navigation.navigate('EditUser', { userId: user.id })
                  }
                />
              </Table.Cell>
            </Table.Row>
          ))}

          <Table.Pagination
            page={page}
            numberOfPages={numberOfPages}
            onPageChange={async (page) => {
              setPage(page);
              if (fetchMore) {
                const { data } = await fetchMore({
                  variables: { limit, page: page + 1 },
                });
                const fetchedUsers =
                  data &&
                  data.getUsers.items.map((user: IUser) => ({
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    checked: false,
                  }));
                setMeta(data.getUsers.meta);
                setNumberOfPages(data.getUsers.meta.totalPages);
                setUsers(fetchedUsers);
              }
            }}
            label={getPaginationLabel(meta)}
          />
        </Table>
      )}
    </Background>
  );
};

export default memo(Users);

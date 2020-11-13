import React from 'react';
import { StyleSheet } from 'react-native';
import { DataTable } from 'react-native-paper';
import { theme } from '../../styles/themes/default';

type Props = {
  children: React.ReactNode;
};

const Table = ({ children }: Props) => (
  <DataTable style={styles.table}>{children}</DataTable>
);

Table.Header = ({ children }: Props) => (
  <DataTable.Header style={styles.header}>{children}</DataTable.Header>
);

Table.Title = ({ children }: Props) => (
  <DataTable.Title style={styles.title}>{children}</DataTable.Title>
);

Table.Row = ({ children }: Props) => <DataTable.Row>{children}</DataTable.Row>;

Table.Cell = ({ children }: Props) => (
  <DataTable.Cell>{children}</DataTable.Cell>
);

Table.Pagination = ({ children }: Props) => (
  <DataTable.Pagination>{children}</DataTable.Pagination>
);

const styles = StyleSheet.create({
  table: {
    backgroundColor: '#fff',
  },
  header: {
    height: 58,
  },
  title: {
    alignItems: 'center',
    height: '100%',
  },
  text: {
    fontSize: 16,
    lineHeight: 26,
    color: theme.colors.secondary,
    textAlign: 'center',
    marginBottom: 14,
  },
});

export default Table;

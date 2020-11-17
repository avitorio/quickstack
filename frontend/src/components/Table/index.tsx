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

Table.Title = ({ children, numeric }: Props) => (
  <DataTable.Title numeric={numeric} style={styles.title}>
    {children}
  </DataTable.Title>
);

Table.Row = ({ children }: Props) => <DataTable.Row>{children}</DataTable.Row>;

Table.Cell = ({ children, numeric }: Props) => (
  <DataTable.Cell numeric={numeric}>{children}</DataTable.Cell>
);

Table.Pagination = ({ children }: Props) => (
  <DataTable.Pagination>{children}</DataTable.Pagination>
);

const styles = StyleSheet.create({
  table: {
    backgroundColor: '#fff',
  },
  header: {
    height: 48,
  },
  title: {
    alignItems: 'center',
    height: 48,
    cell: {
      height: 36,
    },
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

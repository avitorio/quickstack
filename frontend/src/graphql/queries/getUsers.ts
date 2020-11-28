import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query query {
    getUsers {
      id
      email
      role
    }
  }
`;

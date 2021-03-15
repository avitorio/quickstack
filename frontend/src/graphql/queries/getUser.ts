import { gql } from '@apollo/client';

export const GET_USER = gql`
  query GetUser($id: String!) {
    getUser(getUserInput: { id: $id }) {
      id
      email
      role
    }
  }
`;

import { gql } from '@apollo/client';

export const GET_USER = gql`
  query getUser($id: String!) {
    getUser(getUserInput: { id: $id }) {
      id
      email
      role
    }
  }
`;

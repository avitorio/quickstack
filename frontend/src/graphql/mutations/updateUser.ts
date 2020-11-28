import { gql } from '@apollo/client';

export const UPDATE_USER = gql`
  mutation updateUser(
    $id: String!
    $email: String!
    $old_password: String
    $password: String
    $role: String
  ) {
    updateUser(
      updateUserInput: {
        id: $id
        email: $email
        old_password: $old_password
        password: $password
        role: $role
      }
    )
  }
`;

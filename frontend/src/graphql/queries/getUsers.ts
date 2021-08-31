import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query GetUsers($limit: Float!, $page: Float!) {
    getUsers(getUsersInput: { limit: $limit, page: $page }) {
      items {
        id
        role
        email
      }
      meta {
        itemCount
        totalItems
        itemsPerPage
        totalPages
        currentPage
      }
    }
  }
`;

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUsers
// ====================================================

export interface GetUsers_getUsers_items {
  __typename: "User";
  id: string;
  role: string;
  email: string;
}

export interface GetUsers_getUsers_meta {
  __typename: "Meta";
  itemCount: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface GetUsers_getUsers {
  __typename: "PaginatedUser";
  items: GetUsers_getUsers_items[] | null;
  meta: GetUsers_getUsers_meta;
}

export interface GetUsers {
  getUsers: GetUsers_getUsers;
}

export interface GetUsersVariables {
  limit: number;
  page: number;
}

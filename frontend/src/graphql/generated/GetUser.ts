/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUser
// ====================================================

export interface GetUser_getUser {
  __typename: "User";
  id: string;
  email: string;
  role: string;
}

export interface GetUser {
  getUser: GetUser_getUser;
}

export interface GetUserVariables {
  id: string;
}

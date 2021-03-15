/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateUser
// ====================================================

export interface UpdateUser {
  updateUser: boolean;
}

export interface UpdateUserVariables {
  id: string;
  email: string;
  old_password?: string | null;
  password?: string | null;
  role?: string | null;
}

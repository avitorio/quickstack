import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from 'react';
import IUser from './user.interface';

interface IInitialState extends Array<IUser> {}

interface IProps {
  children?: ReactNode;
}

interface IUsersListContext {
  users: IInitialState;
  setUsers: Dispatch<SetStateAction<IInitialState>>;
}

const initialState: IInitialState = [];

export const UsersListContext = createContext<IUsersListContext>({
  users: initialState,
  setUsers: () => {},
});

export const UsersListProvider = ({ children }: IProps) => {
  const [users, setUsers] = useState<IInitialState>([]);

  return (
    <UsersListContext.Provider
      value={{
        users,
        setUsers,
      }}
    >
      {children}
    </UsersListContext.Provider>
  );
};

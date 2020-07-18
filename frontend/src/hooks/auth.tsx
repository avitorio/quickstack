import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { gql, useMutation } from '@apollo/client';
import errorParser from '../utils/errorParser';

interface AuthState {
  token: string;
  user: object;
}
interface SignInCredentials {
  email: string;
  password: string;
}
interface AuthContextData {
  user: object;
  loading: boolean;
  handleSignIn(credentials: SignInCredentials): Promise<void | string>;
  signOut(): void;
}

const SIGN_IN = gql`
  mutation SignIn($email: String!, $password: String!) {
    signIn(authCredentialsInput: { email: $email, password: $password }) {
      token
      user {
        id
        email
      }
    }
  }
`;

const AuthContext = createContext<AuthContextData>({} as AuthContextData);
const AuthProvider: React.FC = ({ children }) => {
  const [authData, setAuthData] = useState<AuthState>({} as AuthState);
  const [loading, setLoading] = useState(true);

  const [signIn] = useMutation(SIGN_IN, {
    onCompleted: async (data) => {
      const { token, user } = data.signIn;

      await AsyncStorage.multiSet([
        ['@Gobarber:token', token],
        ['@Gobarber:user', JSON.stringify(user)],
      ]);

      setAuthData({ token, user });
    },
    onError: (error) => {
      const errors = errorParser(error);

      if (errors) {
        throw new Error(errors[0].message);
      }
    },
  });

  useEffect(() => {
    async function loadStoredData(): Promise<void> {
      const [token, user] = await AsyncStorage.multiGet([
        '@Gobarber:token',
        '@Gobarber:user',
      ]);
      if (token[1] && user[1]) {
        setAuthData({ token: token[1], user: JSON.parse(user[1]) });
      }
      setLoading(false);
    }
    loadStoredData();
  }, []);

  const handleSignIn = useCallback(async ({ email, password }) => {
    await AsyncStorage.multiRemove(['@Gobarber:token', '@Gobarber:user']);

    setAuthData({} as AuthState);

    await signIn({
      variables: { email, password },
    });
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove(['@Gobarber:token', '@Gobarber:user']);

    setAuthData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user: authData.user, handleSignIn, signOut, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };

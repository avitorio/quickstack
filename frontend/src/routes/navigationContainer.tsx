import 'react-native-gesture-handler';
import React from 'react';
import { ActivityIndicator, View, Platform, StatusBar } from 'react-native';
import { NavigationContainer as NavContainer } from '@react-navigation/native';

import LinkingPrefixes from './LinkingPrefixes';
import { useAuth } from '../hooks/auth';
import Background from '../components/Background';

const config = {
  screens: {
    path: '',
    initialRouteName: 'Home',
    Home: '',
    Login: {
      path: 'login',
    },
    Register: {
      path: 'register',
    },
    ForgotPassword: {
      path: 'forgot-password',
    },
    ResetPassword: {
      path: 'reset-password',
    },
    Dashboard: {
      path: 'dashboard',
    },
    Profile: {
      path: 'profile',
    },
    NotFound: '*',
  },
};

type Props = {
  children: React.ReactNode;
};

const NavigationContainer = ({ children }: Props) => {
  const { loading } = useAuth();
  if (loading) {
    return (
      <Background>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size="large" color="#999" />
        </View>
      </Background>
    );
  }

  return (
    <>
      <NavContainer
        linking={{
          // To test deep linking on, run the following in the Terminal:
          // Android: adb shell am start -a android.intent.action.VIEW -d "exp://127.0.0.1:19000/--/simple-stack"
          // iOS: xcrun simctl openurl booted exp://127.0.0.1:19000/--/simple-stack
          // Android (bare): adb shell am start -a android.intent.action.VIEW -d "rne://127.0.0.1:19000/--/simple-stack"
          // iOS (bare): xcrun simctl openurl booted rne://127.0.0.1:19000/--/simple-stack
          // The first segment of the link is the the scheme + host (returned by `Linking.makeUrl`)
          prefixes: LinkingPrefixes,
          config,
        }}
      >
        {children}
      </NavContainer>
    </>
  );
};

export default NavigationContainer;

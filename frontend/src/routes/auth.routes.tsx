import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { HomeScreen, ForgotPasswordScreen, Dashboard } from '../screens';

import Home from '../screens/Home';
import Login from '../screens/Login';
import Register from '../screens/Register';
import ForgotPassword from '../screens/ForgotPassword';

const Auth = createStackNavigator();

const AuthRoutes: React.FC = () => (
  <Auth.Navigator headerMode="none">
    <Auth.Screen name="Home" component={Home} />
    <Auth.Screen name="Login" component={Login} />
    <Auth.Screen name="Register" component={Register} />
    <Auth.Screen name="ForgotPassword" component={ForgotPassword} />
  </Auth.Navigator>
);

export default AuthRoutes;

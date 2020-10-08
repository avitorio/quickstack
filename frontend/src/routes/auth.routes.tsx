import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Home from '../screens/Home';
import Login from '../screens/Login';
import Register from '../screens/Register';
import ForgotPassword from '../screens/ForgotPassword';
import ResetPassword from '../screens/ResetPassword';

const Auth = createStackNavigator();

const AuthRoutes: React.FC = () => (
  <Auth.Navigator headerMode="none">
    <Auth.Screen key="Home" name="Home" component={Home} />
    <Auth.Screen name="Login" component={Login} />
    <Auth.Screen name="Register" component={Register} />
    <Auth.Screen name="ForgotPassword" component={ForgotPassword} />
    <Auth.Screen name="ResetPassword" component={ResetPassword} />
  </Auth.Navigator>
);

export default AuthRoutes;

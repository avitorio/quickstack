import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Dashboard from '../screens/Dashboard';
import Profile from '../screens/Profile';

const App = createStackNavigator();

const AppRoute: React.FC = () => {
  return (
    <App.Navigator headerMode="none">
      <App.Screen name="Dashboard" component={Dashboard} />
      <App.Screen name="Profile" component={Profile} />
    </App.Navigator>
  );
};

export default AppRoute;

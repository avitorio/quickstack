import 'react-native-gesture-handler';

import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import Routes from './routes';
import Background from './components/Background';

const App: React.FC = () => (
  <NavigationContainer>
    <Routes />
  </NavigationContainer>
);

export default App;

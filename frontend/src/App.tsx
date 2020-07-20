import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import Routes from './routes';
import AppProvider from './hooks';
import SnackBar from './components/Snackbar';

const App: React.FC = () => (
  <NavigationContainer>
    <AppProvider>
      <Routes />
      <SnackBar />
    </AppProvider>
  </NavigationContainer>
);

export default App;

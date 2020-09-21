import 'react-native-gesture-handler';
import React from 'react';

import NavigationContainer from './routes/navigationContainer';
import Routes from './routes';
import AppProvider from './hooks';
import SnackBar from './components/Snackbar';

const App: React.FC = () => (
  <AppProvider>
    <NavigationContainer>
      <Routes />
      <SnackBar />
    </NavigationContainer>
  </AppProvider>
);

export default App;

import React from 'react';
import { Platform, StatusBar } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import type {} from 'styled-components/cssprop';

import App from './src/App';
import { theme } from './src/core/theme';

import ContextProvider from './src/context/state';
import ApolloProvider from './src/graphql/client';

const Main = () => {
  return (
    <PaperProvider theme={theme}>
      {Platform.OS === 'ios' && (
        <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
      )}
      <ContextProvider>
        <ApolloProvider>
          {Platform.OS === 'web' ? (
            <style type="text/css">{`
              @font-face {
                font-family: 'MaterialCommunityIcons';
                src: url(${require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf')}) format('truetype');
              }
            `}</style>
          ) : null}
          <App />
        </ApolloProvider>
      </ContextProvider>
    </PaperProvider>
  );
};

export default Main;

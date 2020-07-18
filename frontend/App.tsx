import React from 'react';
import { Platform } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import App from './src/App';
import { theme } from './src/core/theme';

const Main = () => {
  const client = new ApolloClient({
    uri: 'http://localhost:3000/graphql',
    cache: new InMemoryCache(),
  });

  return (
    <PaperProvider theme={theme}>
      <ApolloProvider client={client}>
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
    </PaperProvider>
  );
};

export default Main;

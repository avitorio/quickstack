import React from 'react';
import { Provider } from 'react-native-paper';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import App from './src/App';
import { theme } from './src/core/theme';

const Main = () => {
  const client = new ApolloClient({
    uri: 'http://localhost:3000/graphql',
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <Provider theme={theme}>
        <App />
      </Provider>
    </ApolloProvider>
  );
};

export default Main;

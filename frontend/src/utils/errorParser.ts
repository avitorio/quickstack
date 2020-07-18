import { ApolloError } from '@apollo/client';

const errorParser = (error: ApolloError) => {
  const { graphQLErrors, networkError } = error;
  if (graphQLErrors) {
    const errors = graphQLErrors.map(
      ({ extensions }) => extensions?.exception.response
    );

    return errors;
  }

  if (networkError) return [networkError];

  return [error];
};

export default errorParser;

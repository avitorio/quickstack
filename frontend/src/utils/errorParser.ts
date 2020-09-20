import { ApolloError } from '@apollo/client';

const beautify = (s: string) => {
  // Capitalize and add punctuation.
  if (typeof s !== 'string') return '';

  if (!s.endsWith('.')) s = s + '.';

  return s.charAt(0).toUpperCase() + s.slice(1);
};

const errorParser = (error: ApolloError) => {
  const { graphQLErrors, networkError } = error;
  if (graphQLErrors) {
    const errors = graphQLErrors.map(
      ({ extensions }) => extensions?.exception.response
    );

    if (typeof errors[0].message !== 'string') {
      errors[0].message[0] = beautify(errors[0].message[0]);
      return errors;
    }

    errors[0].message = beautify(errors[0].message);

    return errors;
  }

  if (networkError) return [networkError];

  return [error];
};

export default errorParser;

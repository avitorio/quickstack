const beautifyError = (s: string): string => {
  // Capitalize and add punctuation.
  if (typeof s !== 'string') return '';

  if (!s.endsWith('.')) s = s + '.';

  return s.charAt(0).toUpperCase() + s.slice(1);
};

export default beautifyError;

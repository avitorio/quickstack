import { Platform } from 'react-native';
import styled from 'styled-components/native';
import { Snackbar as _Snackbar } from 'react-native-paper';

export const Snackbar = styled(_Snackbar).attrs(() => ({
  wrapperStyle: { top: Platform.OS === 'web' ? 20 : 90 },
}))`
  width: 100%;
  max-width: 300px;
  margin: ${Platform.OS === 'web' ? '0 30px 0 auto' : '0 auto'};
`;

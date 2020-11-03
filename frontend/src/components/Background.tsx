import React, { memo } from 'react';
import {
  Platform,
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
} from 'react-native';

type Props = {
  children: React.ReactNode;
};

const Background = ({ children }: Props) => (
  <ImageBackground
    source={require('../assets/background_dot.png')}
    resizeMode="repeat"
    style={styles.background}
  >
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      {children}
    </KeyboardAvoidingView>
  </ImageBackground>
);

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
    padding: 20,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 'initial' : 340,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: Platform.OS === 'web' ? 'flex-start' : 'center',
  },
});

export default memo(Background);

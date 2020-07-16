import React, { memo } from 'react';
import { useNavigation } from '@react-navigation/native';
import Background from '../../components/Background';
import Logo from '../../components/Logo';
import Header from '../../components/Header';
import Button from '../../components/Button';
import Paragraph from '../../components/Paragraph';

const Home: React.FC = () => {
  const navigation = useNavigation();

  return (
    <Background>
      <Logo />
      <Header>QuickStack</Header>

      <Paragraph>
        The easiest way to start with your amazing application.
      </Paragraph>
      <Button mode="contained" onPress={() => navigation.navigate('Login')}>
        Login
      </Button>
      <Button mode="outlined" onPress={() => navigation.navigate('Register')}>
        Sign Up
      </Button>
    </Background>
  );
};

export default memo(Home);

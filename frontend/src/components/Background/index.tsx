import React, { memo } from 'react';

import { Container, Wrapper } from './styles';

type BackgroundProps = {
  wrapperWidth?: string;
  position?: string;
  children: React.ReactNode;
};

const Background = ({ children, position, wrapperWidth }: BackgroundProps) => (
  <Container
    source={require('../../assets/background_dot.png')}
    resizeMode="repeat"
  >
    <Wrapper position={position} wrapperWidth={wrapperWidth} behavior="padding">
      {children}
    </Wrapper>
  </Container>
);

export default memo(Background);

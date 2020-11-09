import React, { memo } from 'react';

import { Container, Wrapper } from './styles';

type BackgroundProps = {
  width?: string;
  position?: string;
  children: React.ReactNode;
};

const Background = ({ children, position, width }: BackgroundProps) => (
  <Container
    source={require('../../assets/background_dot.png')}
    resizeMode="repeat"
  >
    <Wrapper behavior="padding" position={position} width={width}>
      {children}
    </Wrapper>
  </Container>
);

export default memo(Background);

import styled from 'styled-components/native';

export const Container = styled.ImageBackground`
  flex: 1;
  width: 100%;
`;

type WrapperProps = {
  wrapperWidth?: string;
  position?: string;
  children: React.ReactNode;
};

export const Wrapper = styled.KeyboardAvoidingView<WrapperProps>`
  flex: 1;
  padding: 20px;
  width: 100%;
  min-width: 340px;
  max-width: ${({ wrapperWidth }) =>
    wrapperWidth === 'full' ? '100%' : '340px'};
  align-self: center;
  align-items: center;
  justify-content: ${({ position }) =>
    position === 'top' ? 'flex-start' : 'center'};
`;

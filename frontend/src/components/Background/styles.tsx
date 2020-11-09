import styled from 'styled-components/native';

export const Container = styled.ImageBackground`
  flex: 1;
  width: 100%;
`;

type WrapperProps = {
  width?: string;
  position?: string;
  children: React.ReactNode;
};

export const Wrapper = styled.KeyboardAvoidingView<WrapperProps>`
  flex: 1;
  padding: 20px;
  width: 100%;
  max-width: ${({ width }) => (width === 'full' ? '100%' : '340px')};
  align-self: center;
  align-items: center;
  justify-content: ${({ position }) =>
    position === 'top' ? 'flex-start' : 'center'};
`;

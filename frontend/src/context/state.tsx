import React, { ReactNode, cloneElement } from 'react';
import { AlertProvider } from './alert';

interface IProps {
  children: ReactNode;
}

interface IProviderComposer {
  contexts: Array<{}>;
  children: any;
}

function ProviderComposer({ contexts, children }: IProviderComposer) {
  return contexts.reduceRight(
    (kids: any, parent: any) =>
      cloneElement(parent, {
        children: kids,
      }),
    children
  );
}

function ContextProvider({ children }: IProps) {
  return (
    <ProviderComposer contexts={[<AlertProvider />]}>
      {children}
    </ProviderComposer>
  );
}

export default ContextProvider;

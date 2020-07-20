import React, { createContext, useReducer, ReactNode, Dispatch } from 'react';

interface IInitialState {
  type: string;
  open?: boolean;
  alertType?: string;
  message?: string;
}

interface IProps {
  children?: ReactNode;
}

interface IAlertContext {
  alertState: IInitialState;
  dispatchAlert: Dispatch<IInitialState>;
}

const initialState = {
  type: 'close',
  open: false,
  alertType: 'info',
  message: '',
};

export const AlertContext = createContext<IAlertContext>({
  alertState: initialState,
  dispatchAlert: () => {},
});

const reducer = (_state: Object, action: IInitialState): IInitialState => {
  switch (action.type) {
    case 'close':
      return {
        ...initialState,
      };
    case 'open':
      return {
        type: 'open',
        open: true,
        alertType: action.alertType,
        message: action.message,
      };
    default:
      throw new Error();
  }
};

export const AlertProvider = ({ children }: IProps) => {
  const [alertState, dispatchAlert] = useReducer(reducer, initialState);
  return (
    <AlertContext.Provider
      value={{
        alertState,
        dispatchAlert,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

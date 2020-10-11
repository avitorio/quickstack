import React, { useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { AlertContext } from '../../context';
import colors from '../../styles/colors';

import { Snackbar } from './styles';

const SnackBar: React.FC = () => {
  const { alertState, dispatchAlert } = useContext(AlertContext);
  const [alertSyle, setAlertStyle] = useState({
    backgroundColor: colors.info,
  });

  useEffect(() => {
    switch (alertState.alertType) {
      case 'info':
        setAlertStyle({
          backgroundColor: colors.success,
        });
        break;
      case 'error':
        setAlertStyle({
          backgroundColor: colors.error,
        });
        break;
      case 'success':
        setAlertStyle({
          backgroundColor: colors.success,
        });
        break;
      default:
        setAlertStyle({
          backgroundColor: colors.info,
        });
    }
  }, [alertState]);

  const closeMe = () => {
    dispatchAlert({ type: 'close' });
  };

  return (
    <>
      {typeof alertState.open === 'boolean' && (
        <Snackbar
          style={alertSyle}
          visible={alertState.open}
          onDismiss={() => closeMe()}
          action={{
            label: '',
            onPress: () => {
              // Do something
            },
          }}
        >
          {alertState.message}
        </Snackbar>
      )}
    </>
  );
};

export default SnackBar;

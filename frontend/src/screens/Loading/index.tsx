import React, { memo } from 'react';

import { ActivityIndicator, View } from 'react-native';
import Background from '../../components/Background';

const Loading: React.FC = () => {
  return (
    <Background>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" color="#999" />
      </View>
    </Background>
  );
};

export default memo(Loading);

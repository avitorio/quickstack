import * as React from 'react';
import { Dimensions, ScaledSize } from 'react-native';
import { Appbar } from 'react-native-paper';
import { ParamListBase } from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationOptions,
  StackScreenProps,
} from '@react-navigation/stack';
import { DrawerActions } from '@react-navigation/native';

import ListUsers from './ListUsers';
import EditUser from './EditUser';

type SimpleStackParamList = {
  '.': undefined;
  ListUsers: undefined;
  EditUser: { userId: string };
};

const SimpleStack = createStackNavigator<SimpleStackParamList>();

export default function SimpleStackScreen({
  navigation,
  screenOptions,
}: StackScreenProps<ParamListBase> & {
  screenOptions?: StackNavigationOptions;
}) {
  const [dimensions, setDimensions] = React.useState(Dimensions.get('window'));
  React.useEffect(() => {
    const onDimensionsChange = ({ window }: { window: ScaledSize }) => {
      setDimensions(window);
    };

    Dimensions.addEventListener('change', onDimensionsChange);

    return () => Dimensions.removeEventListener('change', onDimensionsChange);
  }, []);

  const isLargeScreen = dimensions.width >= 1024;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <SimpleStack.Navigator screenOptions={screenOptions}>
      <SimpleStack.Screen
        name="."
        component={ListUsers}
        options={{
          title: 'Users',
          headerLeft: isLargeScreen
            ? undefined
            : () => (
                <Appbar.Action
                  icon="menu"
                  onPress={() =>
                    navigation.dispatch(DrawerActions.openDrawer())
                  }
                />
              ),
        }}
      />
      <SimpleStack.Screen
        name="EditUser"
        component={EditUser}
        options={{ title: 'Edit User' }}
        initialParams={{ userId: '' }}
      />
    </SimpleStack.Navigator>
  );
}

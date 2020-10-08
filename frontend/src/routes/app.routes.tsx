import React from 'react';
import { Dimensions, ScaledSize } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import {
  createDrawerNavigator,
  DrawerScreenProps,
} from '@react-navigation/drawer';
import { Appbar } from 'react-native-paper';

import Dashboard from '../screens/Dashboard';
import Profile from '../screens/Profile';
import Logout from '../utils/components/Logout';

type RootDrawerParamList = {
  Dashboard: undefined;
  Profile: undefined;
  Logout: undefined;
};

const Drawer = createDrawerNavigator<RootDrawerParamList>();
const App = createStackNavigator();

const AppRoute: React.FC = (props) => {
  const [dimensions, setDimensions] = React.useState(Dimensions.get('window'));
  React.useEffect(() => {
    const onDimensionsChange = ({ window }: { window: ScaledSize }) => {
      setDimensions(window);
    };

    Dimensions.addEventListener('change', onDimensionsChange);

    return () => Dimensions.removeEventListener('change', onDimensionsChange);
  }, []);

  const isLargeScreen = dimensions.width >= 1024;

  return (
    <Drawer.Navigator drawerType={isLargeScreen ? 'permanent' : undefined}>
      <Drawer.Screen
        name="Dashboard"
        options={{
          title: 'Dashboard',
          drawerIcon: ({ size, color }) => (
            <MaterialIcons size={size} color={color} name="dashboard" />
          ),
        }}
      >
        {({ navigation }: DrawerScreenProps<RootDrawerParamList>) => (
          <App.Navigator>
            <App.Screen
              name="Dashboard"
              component={Dashboard}
              options={{
                title: 'Dashboard',
                headerLeft: isLargeScreen
                  ? undefined
                  : () => (
                      <Appbar.Action
                        icon="menu"
                        onPress={() => navigation.toggleDrawer()}
                        accessibilityStates
                      />
                    ),
              }}
            />
          </App.Navigator>
        )}
      </Drawer.Screen>
      <Drawer.Screen
        name="Profile"
        options={{
          title: 'Profile',
          drawerIcon: ({ size, color }) => (
            <MaterialIcons size={size} color={color} name="person" />
          ),
        }}
      >
        {({ navigation }: DrawerScreenProps<RootDrawerParamList>) => (
          <App.Navigator>
            <App.Screen
              name="Profile"
              component={Profile}
              options={{
                title: 'Profile',
                headerLeft: isLargeScreen
                  ? undefined
                  : () => (
                      <Appbar.Action
                        icon="menu"
                        onPress={() => navigation.toggleDrawer()}
                        accessibilityStates
                      />
                    ),
              }}
            />
          </App.Navigator>
        )}
      </Drawer.Screen>
      <Drawer.Screen
        name="Logout"
        options={{
          title: 'Logout',
          drawerIcon: ({ size, color }) => (
            <MaterialIcons
              size={size}
              color={color}
              name="power-settings-new"
            />
          ),
        }}
      >
        {({ navigation }: DrawerScreenProps<RootDrawerParamList>) => (
          <App.Navigator>
            <App.Screen
              name="Logout"
              component={Logout}
              options={{
                title: 'Logout',
                headerLeft: isLargeScreen
                  ? undefined
                  : () => (
                      <Appbar.Action
                        icon="menu"
                        onPress={() => navigation.toggleDrawer()}
                        accessibilityStates
                      />
                    ),
              }}
            />
          </App.Navigator>
        )}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
};

export default AppRoute;

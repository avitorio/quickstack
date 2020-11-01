import React from 'react';
import { Dimensions, ScaledSize } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import {
  createDrawerNavigator,
  DrawerScreenProps,
} from '@react-navigation/drawer';
import { Appbar } from 'react-native-paper';

import { useAuth } from '../hooks/auth';

import Dashboard from '../screens/Dashboard';
import Users from '../screens/Users';
import Profile from '../screens/Profile';
import Logout from '../utils/components/Logout';

const SCREENS = {
  Dashboard: {
    title: 'Dashboard',
    component: Dashboard,
    icon: 'dashboard',
    requiredRoles: ['admin',
   'member']
  },
  Users: {
    title: 'Users',
    component: Users,
    icon: 'people',
    requiredRoles: ['admin']
  },
  Profile: {
    title: 'Profile',
    component: Profile,
    icon: 'person',
    requiredRoles: ['admin','member']
  },
  Logout: {
    title: 'Logout',
    component: Logout,
    icon: 'power-settings-new',
    requiredRoles: ['admin','member']
  },
};

type RootDrawerParamList = {
  [P in keyof typeof SCREENS]: undefined;
};


const Drawer = createDrawerNavigator<RootDrawerParamList>();
const App = createStackNavigator();

const AppRoute: React.FC = (props) => {
  const { user } = useAuth();

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
      {(Object.keys(SCREENS) as Array<keyof typeof SCREENS>).map((name) => (
        <React.Fragment key={name}>
        {SCREENS[name].requiredRoles.includes(user.role) &&
        (<Drawer.Screen
          name={name}
          options={{
            title: SCREENS[name].title,
            drawerIcon: ({ size, color }) => (
              <MaterialIcons size={size} color={color} name={SCREENS[name].icon} />
            ),
          }}
        >
          {({ navigation }: DrawerScreenProps<RootDrawerParamList>) => (
            <App.Navigator>
              <App.Screen
                name='app'
                component={SCREENS[name].component}
                options={{
                  title: SCREENS[name].title,
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
        </Drawer.Screen>)}
        </React.Fragment >
      ))}
    </Drawer.Navigator>
  );
};

export default AppRoute;

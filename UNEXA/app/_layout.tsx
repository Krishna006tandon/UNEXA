import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { AuthProvider } from '../contexts/AuthContext';
import LoginScreen from './login';
import RegisterScreen from './register';
import TabLayout from './(tabs)/_layout';

import { useColorScheme } from '@/hooks/use-color-scheme';

const Stack = createNativeStackNavigator();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Main" component={TabLayout} />
          </Stack.Navigator>
          <StatusBar style="auto" />
        </NavigationContainer>
      </ThemeProvider>
    </AuthProvider>
  );
}

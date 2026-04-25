import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import MapScreen from './src/screens/MapScreen';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from './src/styles/theme';

const Stack = createStackNavigator();

// Placeholder for main app (we'll build this next)
function MainPlaceholder() {
  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderText}>⚽ Main App Coming Soon!</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="Main" component={MainPlaceholder} />
        <Stack.Screen name="HostMatch" component={MainPlaceholder} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.primary,
  },
});
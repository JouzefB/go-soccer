import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from './src/styles/theme';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.logo}>⚽ Go Soccer!</Text>
      <Text style={styles.sub}>Loading your world...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 42,
    fontWeight: '900',
    color: theme.colors.primary,
    letterSpacing: -1,
  },
  sub: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: 12,
  },
});
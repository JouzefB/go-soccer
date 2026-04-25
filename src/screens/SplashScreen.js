import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { theme } from '../styles/theme';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  const ballAnim = useRef(new Animated.Value(-200)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const taglineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(ballAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(taglineAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Background circles */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      {/* Ball animation */}
      <Animated.Text
        style={[styles.ball, { transform: [{ translateY: ballAnim }] }]}
      >
        ⚽
      </Animated.Text>

      {/* Logo */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
          alignItems: 'center',
        }}
      >
        <Text style={styles.logo}>Go Soccer!</Text>
        <View style={styles.divider} />
      </Animated.View>

      {/* Tagline */}
      <Animated.Text style={[styles.tagline, { opacity: taglineAnim }]}>
        Find your game. Own the pitch.
      </Animated.Text>

      {/* Bottom */}
      <View style={styles.bottom}>
        <Text style={styles.bottomText}>⚡ Powered by your city</Text>
      </View>
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
  bgCircle1: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: theme.colors.primary,
    opacity: 0.05,
    top: -100,
    right: -100,
  },
  bgCircle2: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: theme.colors.primary,
    opacity: 0.05,
    bottom: -50,
    left: -80,
  },
  ball: {
    fontSize: 80,
    marginBottom: 20,
  },
  logo: {
    fontSize: 48,
    fontWeight: '900',
    color: theme.colors.primary,
    letterSpacing: -1,
  },
  divider: {
    width: 60,
    height: 3,
    backgroundColor: theme.colors.primary,
    borderRadius: 999,
    marginTop: 12,
  },
  tagline: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: 16,
    letterSpacing: 0.5,
  },
  bottom: {
    position: 'absolute',
    bottom: 48,
  },
  bottomText: {
    fontSize: 13,
    color: theme.colors.textMuted,
    letterSpacing: 1,
  },
});
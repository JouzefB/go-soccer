import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, KeyboardAvoidingView,
  Platform, Dimensions, ActivityIndicator,
} from 'react-native';
import { theme } from '../styles/theme';

const { height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' or 'code'
  const [loading, setLoading] = useState(false);

  const handleSendCode = () => {
    if (phone.length < 10) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('code');
    }, 1500);
  };

  const handleVerify = () => {
    if (code.length < 6) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.replace('Map');
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Background accent */}
      <View style={styles.bgAccent} />

      <View style={styles.content}>
        {/* Header */}
        <Text style={styles.ball}>⚽</Text>
        <Text style={styles.title}>
          {step === 'phone' ? 'Join the Game' : 'Check your texts'}
        </Text>
        <Text style={styles.subtitle}>
          {step === 'phone'
            ? 'Enter your phone number to get started'
            : `We sent a code to +1 ${phone}`}
        </Text>

        {/* Input */}
        {step === 'phone' ? (
          <View style={styles.inputWrapper}>
            <View style={styles.flag}>
              <Text style={styles.flagText}>🇺🇸 +1</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="(555) 000-0000"
              placeholderTextColor={theme.colors.textMuted}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              maxLength={10}
            />
          </View>
        ) : (
          <TextInput
            style={styles.codeInput}
            placeholder="------"
            placeholderTextColor={theme.colors.textMuted}
            keyboardType="number-pad"
            value={code}
            onChangeText={setCode}
            maxLength={6}
            textAlign="center"
          />
        )}

        {/* Button */}
        <TouchableOpacity
          style={[
            styles.button,
            (step === 'phone' ? phone.length < 10 : code.length < 6) &&
              styles.buttonDisabled,
          ]}
          onPress={step === 'phone' ? handleSendCode : handleVerify}
          disabled={step === 'phone' ? phone.length < 10 : code.length < 6}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.buttonText}>
              {step === 'phone' ? 'Send Code →' : 'Verify & Play →'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Back option */}
        {step === 'code' && (
          <TouchableOpacity onPress={() => setStep('phone')}>
            <Text style={styles.backText}>← Change number</Text>
          </TouchableOpacity>
        )}

        {/* Terms */}
        {step === 'phone' && (
          <Text style={styles.terms}>
            By continuing you agree to our Terms of Service.{'\n'}
            Must be 12 or older to play. 🔞
          </Text>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  bgAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.35,
    backgroundColor: theme.colors.primary,
    opacity: 0.07,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'center',
  },
  ball: {
    fontSize: 52,
    marginBottom: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: theme.colors.text,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    marginBottom: 36,
    lineHeight: 22,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 16,
    overflow: 'hidden',
  },
  flag: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    backgroundColor: theme.colors.surfaceLight,
    borderRightWidth: 1,
    borderRightColor: theme.colors.border,
  },
  flagText: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 18,
    color: theme.colors.text,
    fontSize: 18,
    letterSpacing: 1,
  },
  codeInput: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    paddingVertical: 20,
    color: theme.colors.text,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: '#000',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  backText: {
    color: theme.colors.primary,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 24,
  },
  terms: {
    fontSize: 12,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 24,
  },
});
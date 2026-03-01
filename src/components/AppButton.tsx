import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { theme } from '../theme';

type AppButtonProps = {
  label: string;
  onPress: () => void;
  accessibilityLabel?: string;
};

export function AppButton({
  label,
  onPress,
  accessibilityLabel,
}: AppButtonProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel || label}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 60,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    ...theme.shadows.card,
  },
  buttonPressed: {
    backgroundColor: theme.colors.primaryPressed,
  },
  label: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.button,
    fontWeight: '700',
  },
});

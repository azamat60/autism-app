import React, { ReactNode, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

type ActivityCardProps = {
  title: string;
  subtitle: string;
  icon: ReactNode;
  onPress: () => void;
  accessibilityLabel: string;
};

export function ActivityCard({
  title,
  subtitle,
  icon,
  onPress,
  accessibilityLabel,
}: ActivityCardProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (value: number) => {
    Animated.timing(scale, {
      toValue: value,
      duration: 180,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale }] }]}>
      <Pressable
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        onPress={onPress}
        onPressIn={() => animateTo(0.97)}
        onPressOut={() => animateTo(1)}
        style={styles.card}
      >
        <View style={styles.iconWrap}>{icon}</View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    minWidth: '47%',
  },
  card: {
    minHeight: 160,
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    justifyContent: 'space-between',
    ...theme.shadows.card,
  },
  iconWrap: {
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 4,
    fontSize: theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
});

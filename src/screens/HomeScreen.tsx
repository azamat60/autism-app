import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityCard } from '../components/ActivityCard';
import { ScreenContainer } from '../components/ScreenContainer';
import {
  ColorsIcon,
  EmotionIcon,
  ShapesIcon,
  TapIcon,
} from '../components/icons/ActivityIcons';
import { RootStackParamList } from '../navigation/types';
import { theme } from '../theme';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const activities = [
  {
    key: 'MatchColors' as const,
    title: 'Match the Colors',
    subtitle: 'Move colors to matching spots',
    icon: <ColorsIcon />,
  },
  {
    key: 'SortShapes' as const,
    title: 'Sort the Shapes',
    subtitle: 'Group each shape type',
    icon: <ShapesIcon />,
  },
  {
    key: 'FindEmotion' as const,
    title: 'Find the Emotion',
    subtitle: 'Pick the right feeling',
    icon: <EmotionIcon />,
  },
  {
    key: 'TapReact' as const,
    title: 'Tap & React',
    subtitle: 'Tap to see what changes',
    icon: <TapIcon />,
  },
];

export function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <ScreenContainer>
      <Text accessibilityRole="header" style={styles.title}>
        Choose an Activity
      </Text>
      <Text style={styles.subtitle}>Tap one activity to begin.</Text>

      <View style={styles.grid}>
        {activities.map(activity => (
          <ActivityCard
            accessibilityLabel={activity.title}
            icon={activity.icon}
            key={activity.key}
            onPress={() => navigation.navigate(activity.key)}
            subtitle={activity.subtitle}
            title={activity.title}
          />
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: theme.typography.title,
    color: theme.colors.textPrimary,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.md,
    fontSize: theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
});

import React, { useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AppButton } from '../../components/AppButton';
import { theme } from '../../theme';

type Emotion = 'happy' | 'sad' | 'angry' | 'surprised';

const rounds: { face: string; answer: Emotion; choices: Emotion[] }[] = [
  { face: '🙂', answer: 'happy', choices: ['happy', 'sad', 'angry'] },
  { face: '🙁', answer: 'sad', choices: ['surprised', 'sad', 'happy'] },
  { face: '😠', answer: 'angry', choices: ['happy', 'angry', 'sad'] },
  { face: '😮', answer: 'surprised', choices: ['angry', 'surprised', 'happy'] },
];

type FindEmotionGameProps = {
  onDone: () => void;
};

export function FindEmotionGame({ onDone }: FindEmotionGameProps) {
  const [roundIndex, setRoundIndex] = useState(0);
  const [selected, setSelected] = useState<Emotion | null>(null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'tryAgain'>('idle');
  const scale = useRef(new Animated.Value(1)).current;

  const currentRound = rounds[roundIndex];
  const completed = roundIndex >= rounds.length;

  const message = useMemo(() => {
    if (status === 'correct') {
      return 'Nice choice.';
    }
    if (status === 'tryAgain') {
      return 'Try another one.';
    }
    return 'Tap the feeling that matches the face.';
  }, [status]);

  const onChoicePress = (choice: Emotion) => {
    if (completed) {
      return;
    }

    setSelected(choice);

    if (choice === currentRound.answer) {
      setStatus('correct');
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.05,
          duration: 160,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 160,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();

      setTimeout(() => {
        setRoundIndex(prev => prev + 1);
        setSelected(null);
        setStatus('idle');
      }, 500);
      return;
    }

    setStatus('tryAgain');
  };

  if (completed) {
    return (
      <View style={styles.container}>
        <View style={styles.doneCard}>
          <Text style={styles.doneTitle}>Great work!</Text>
          <Text style={styles.doneSubtitle}>You found all the feelings.</Text>
          <AppButton label="Back to activities" onPress={onDone} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find the Emotion</Text>
      <Text style={styles.subtitle}>{message}</Text>

      <Animated.View style={[styles.faceCard, { transform: [{ scale }] }]}>
        <Text style={styles.faceEmoji}>{currentRound.face}</Text>
      </Animated.View>

      <View style={styles.choicesWrap}>
        {currentRound.choices.map(choice => {
          const isSelected = selected === choice;
          const isCorrect = isSelected && status === 'correct';

          return (
            <Pressable
              accessibilityLabel={`Emotion option ${choice}`}
              accessibilityRole="button"
              key={choice}
              onPress={() => onChoicePress(choice)}
              style={[
                styles.choice,
                isSelected && styles.choiceSelected,
                isCorrect && styles.choiceCorrect,
              ]}
            >
              <Text style={styles.choiceLabel}>{choice}</Text>
            </Pressable>
          );
        })}
      </View>

      <AppButton label="Back to activities" onPress={onDone} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.heading,
    color: theme.colors.textPrimary,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  faceCard: {
    minHeight: 220,
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.card,
  },
  faceEmoji: {
    fontSize: 100,
  },
  choicesWrap: {
    gap: theme.spacing.sm,
  },
  choice: {
    minHeight: 60,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceSelected: {
    backgroundColor: theme.colors.surfaceMuted,
  },
  choiceCorrect: {
    borderWidth: 2,
    borderColor: theme.colors.success,
  },
  choiceLabel: {
    fontSize: theme.typography.body,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    textTransform: 'capitalize',
  },
  doneCard: {
    marginTop: theme.spacing.xl,
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  doneTitle: {
    fontSize: theme.typography.heading,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  doneSubtitle: {
    textAlign: 'center',
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
  },
});

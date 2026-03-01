import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Sound from 'react-native-sound';
import { AppButton } from '../../components/AppButton';
import { theme } from '../../theme';

const colors = ['#A7C7E7', '#BDE7D0', '#F6C7B6', '#D7C8F0', '#F7E2AA'];
const shapes: Array<'circle' | 'square'> = ['circle', 'square'];

type TapReactGameProps = {
  onDone: () => void;
};

export function TapReactGame({ onDone }: TapReactGameProps) {
  const [tapCount, setTapCount] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const [shapeIndex, setShapeIndex] = useState(0);
  const scale = useRef(new Animated.Value(1)).current;
  const soundRef = useRef<any>(null);

  useEffect(() => {
    Sound.setCategory('Ambient', true);
    const sound = new Sound(
      require('../../assets/sounds/pop.wav'),
      (error: unknown) => {
        if (!error) {
          sound.setVolume(0.2);
        }
      },
    );
    soundRef.current = sound;

    return () => {
      if (soundRef.current) {
        soundRef.current.release();
      }
    };
  }, []);

  const onShapeTap = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.08,
        duration: 160,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 180,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    if (soundRef.current?.isLoaded()) {
      soundRef.current.stop(() => {
        soundRef.current.play();
      });
    }

    setTapCount(prev => prev + 1);
    setColorIndex(prev => (prev + 1) % colors.length);
    setShapeIndex(prev => (prev + 1) % shapes.length);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tap & React</Text>
      <Text style={styles.subtitle}>Tap the shape to see what happens.</Text>

      <View style={styles.playArea}>
        <Animated.View
          style={[
            styles.shapeWrap,
            { transform: [{ scale }] },
            shapes[shapeIndex] === 'circle' ? styles.circle : styles.square,
            { backgroundColor: colors[colorIndex] },
          ]}
        >
          <Pressable
            accessibilityLabel="Tap reaction shape"
            accessibilityRole="button"
            onPress={onShapeTap}
            style={styles.shapePressArea}
          />
        </Animated.View>
      </View>

      <View style={styles.footerCard}>
        <Text style={styles.count}>Taps: {tapCount}</Text>
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
    color: theme.colors.textSecondary,
    fontSize: theme.typography.bodySmall,
  },
  playArea: {
    flex: 1,
    minHeight: 360,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },
  shapeWrap: {
    width: 150,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shapePressArea: {
    width: 160,
    height: 160,
  },
  circle: {
    borderRadius: theme.radius.pill,
  },
  square: {
    borderRadius: theme.radius.lg,
  },
  footerCard: {
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surfaceMuted,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  count: {
    color: theme.colors.textPrimary,
    fontWeight: '700',
    fontSize: theme.typography.body,
  },
});

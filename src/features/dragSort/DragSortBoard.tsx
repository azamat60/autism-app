import React, { useRef, useState } from 'react';
import {
  Animated,
  Easing,
  LayoutChangeEvent,
  PanResponder,
  PanResponderGestureState,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AppButton } from '../../components/AppButton';
import { theme } from '../../theme';

export type DragToken = {
  id: string;
  label: string;
  color: string;
  shape: 'circle' | 'square' | 'triangle';
  targetZoneId: string;
};

export type DropZone = {
  id: string;
  title: string;
  color: string;
};

type Point = { x: number; y: number };

type TokenState = {
  position: Animated.ValueXY;
  start: Point;
  current: Point;
  dragStart: Point;
  locked: boolean;
};

type DragSortBoardProps = {
  title: string;
  instruction: string;
  tokens: DragToken[];
  zones: DropZone[];
  completionTitle: string;
  completionActionLabel: string;
  onCompletePress: () => void;
};

const TOKEN_SIZE = 72;

export function DragSortBoard({
  title,
  instruction,
  tokens,
  zones,
  completionTitle,
  completionActionLabel,
  onCompletePress,
}: DragSortBoardProps) {
  const tokenMap = useRef<Record<string, TokenState>>({}).current;
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [zoneLayouts, setZoneLayouts] = useState<
    Record<string, { x: number; y: number; width: number; height: number }>
  >({});

  const setStartPositions = (width: number) => {
    const columnGap = 18;
    const rowGap = 20;
    const columns = 2;
    const totalWidth = columns * TOKEN_SIZE + columnGap;
    const startX = Math.max(theme.spacing.md, (width - totalWidth) / 2);
    const startY = 20;

    tokens.forEach((token, index) => {
      const column = index % columns;
      const row = Math.floor(index / columns);
      const point = {
        x: startX + column * (TOKEN_SIZE + columnGap),
        y: startY + row * (TOKEN_SIZE + rowGap),
      };

      if (!tokenMap[token.id]) {
        tokenMap[token.id] = {
          position: new Animated.ValueXY(point),
          start: point,
          current: point,
          dragStart: point,
          locked: false,
        };
        return;
      }

      const state = tokenMap[token.id];
      if (!state.locked) {
        state.start = point;
        state.current = point;
        state.position.setValue(point);
      }
    });
  };

  const onBoardLayout = (event: LayoutChangeEvent) => {
    setStartPositions(event.nativeEvent.layout.width);
  };

  const getHitZoneId = (x: number, y: number): string | null => {
    const zone = Object.entries(zoneLayouts).find(([, layout]) => {
      return (
        x >= layout.x &&
        x <= layout.x + layout.width &&
        y >= layout.y &&
        y <= layout.y + layout.height
      );
    });

    return zone ? zone[0] : null;
  };

  const resetToken = (state: TokenState) => {
    Animated.sequence([
      Animated.timing(state.position, {
        toValue: { x: state.current.x - 6, y: state.current.y },
        duration: 70,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }),
      Animated.timing(state.position, {
        toValue: { x: state.current.x + 6, y: state.current.y },
        duration: 70,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }),
      Animated.timing(state.position, {
        toValue: { x: state.current.x, y: state.current.y },
        duration: 70,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }),
      Animated.timing(state.position, {
        toValue: state.start,
        duration: 160,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
    ]).start(() => {
      state.current = { ...state.start };
    });
  };

  const finalizeDrop = (
    token: DragToken,
    gesture: PanResponderGestureState,
  ) => {
    const state = tokenMap[token.id];
    if (!state || state.locked) {
      return;
    }

    const dropPoint = {
      x: state.dragStart.x + gesture.dx,
      y: state.dragStart.y + gesture.dy,
    };

    const centerX = dropPoint.x + TOKEN_SIZE / 2;
    const centerY = dropPoint.y + TOKEN_SIZE / 2;
    const droppedZoneId = getHitZoneId(centerX, centerY);

    if (!droppedZoneId || droppedZoneId !== token.targetZoneId) {
      state.current = dropPoint;
      resetToken(state);
      return;
    }

    const zone = zoneLayouts[droppedZoneId];
    const snapPoint = {
      x: zone.x + (zone.width - TOKEN_SIZE) / 2,
      y: zone.y + (zone.height - TOKEN_SIZE) / 2,
    };

    Animated.timing(state.position, {
      toValue: snapPoint,
      duration: 200,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start(() => {
      state.current = snapPoint;
      state.locked = true;
      setMatchedIds(prev =>
        prev.includes(token.id) ? prev : [...prev, token.id],
      );
    });
  };

  const getPanResponder = (token: DragToken) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => !tokenMap[token.id]?.locked,
      onMoveShouldSetPanResponder: () => !tokenMap[token.id]?.locked,
      onPanResponderGrant: () => {
        const state = tokenMap[token.id];
        if (!state) {
          return;
        }
        state.dragStart = { ...state.current };
      },
      onPanResponderMove: (_, gesture) => {
        const state = tokenMap[token.id];
        if (!state || state.locked) {
          return;
        }
        state.position.setValue({
          x: state.dragStart.x + gesture.dx,
          y: state.dragStart.y + gesture.dy,
        });
      },
      onPanResponderRelease: (_, gesture) => {
        finalizeDrop(token, gesture);
      },
      onPanResponderTerminate: (_, gesture) => {
        finalizeDrop(token, gesture);
      },
    });

  const allMatched = matchedIds.length === tokens.length;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.instruction}>{instruction}</Text>

      <View onLayout={onBoardLayout} style={styles.boardArea}>
        <View style={styles.zoneGrid}>
          {zones.map(zone => (
            <View
              accessibilityLabel={`Drop zone ${zone.title}`}
              accessibilityRole="text"
              key={zone.id}
              onLayout={(event: LayoutChangeEvent) => {
                const { x, y, width, height } = event.nativeEvent.layout;
                setZoneLayouts(prev => ({
                  ...prev,
                  [zone.id]: { x, y, width, height },
                }));
              }}
              style={[
                styles.zoneCard,
                { borderColor: zone.color, backgroundColor: `${zone.color}33` },
              ]}
            >
              <Text style={styles.zoneTitle}>{zone.title}</Text>
            </View>
          ))}
        </View>

        {tokens.map(token => {
          const tokenState = tokenMap[token.id];
          const panResponder = getPanResponder(token);
          if (!tokenState) {
            return null;
          }

          return (
            <Animated.View
              accessibilityLabel={`${token.label} draggable item`}
              key={token.id}
              style={[styles.tokenWrap, tokenState.position.getLayout()]}
            >
              <View
                {...panResponder.panHandlers}
                style={[
                  styles.token,
                  token.shape === 'circle' && styles.circle,
                  token.shape === 'square' && styles.square,
                  token.shape === 'triangle' && styles.triangle,
                  token.shape !== 'triangle' && {
                    backgroundColor: token.color,
                  },
                  token.shape === 'triangle' && {
                    borderBottomColor: token.color,
                  },
                ]}
              />
            </Animated.View>
          );
        })}
      </View>

      {allMatched && (
        <View style={styles.completionCard}>
          <Text style={styles.completionTitle}>{completionTitle}</Text>
          <AppButton
            accessibilityLabel={completionActionLabel}
            label={completionActionLabel}
            onPress={onCompletePress}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: theme.typography.heading,
    color: theme.colors.textPrimary,
    fontWeight: '700',
  },
  instruction: {
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.md,
    fontSize: theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  boardArea: {
    flex: 1,
    minHeight: 480,
    position: 'relative',
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    ...theme.shadows.card,
  },
  zoneGrid: {
    marginTop: 200,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  zoneCard: {
    minHeight: 120,
    minWidth: '47%',
    flexGrow: 1,
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.sm,
  },
  zoneTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.body,
    fontWeight: '700',
    textAlign: 'center',
  },
  tokenWrap: {
    position: 'absolute',
  },
  token: {
    width: TOKEN_SIZE,
    height: TOKEN_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    borderRadius: theme.radius.pill,
  },
  square: {
    borderRadius: theme.radius.md,
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: TOKEN_SIZE / 2,
    borderRightWidth: TOKEN_SIZE / 2,
    borderBottomWidth: TOKEN_SIZE,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: theme.colors.colorSun,
  },
  completionCard: {
    marginTop: theme.spacing.md,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surfaceMuted,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  completionTitle: {
    textAlign: 'center',
    color: theme.colors.textPrimary,
    fontWeight: '700',
    fontSize: theme.typography.body,
  },
});

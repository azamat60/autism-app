import React, { memo, useEffect, useMemo, useRef } from 'react';
import { Image, LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { BasketBounds, DropResult, ItemAsset } from '../types';

type DraggableItemProps = {
  item: ItemAsset;
  baskets: BasketBounds[];
  resetSignal: number;
  onDropResolve: (
    item: ItemAsset,
    centerX: number,
    centerY: number,
  ) => DropResult;
  onPlaced: (itemId: string, basketId: string) => void;
};

const ITEM_SIZE = 82;

function DraggableItemComponent({
  item,
  baskets,
  resetSignal,
  onDropResolve,
  onPlaced,
}: DraggableItemProps) {
  const containerRef = useRef<View | null>(null);

  const startCenterX = useSharedValue(0);
  const startCenterY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const locked = useSharedValue(0);

  useEffect(() => {
    locked.value = 0;
    translateX.value = withTiming(0, {
      duration: 220,
      easing: Easing.out(Easing.cubic),
    });
    translateY.value = withTiming(0, {
      duration: 220,
      easing: Easing.out(Easing.cubic),
    });
    scale.value = 1;
  }, [locked, resetSignal, scale, translateX, translateY]);

  const basketSnapshot = useMemo(() => baskets, [baskets]);

  const measureSelf = () => {
    if (!containerRef.current) {
      return;
    }

    containerRef.current.measureInWindow((x, y, width, height) => {
      startCenterX.value = x + width / 2;
      startCenterY.value = y + height / 2;
    });
  };

  const handleDropEnd = (centerX: number, centerY: number) => {
    if (locked.value === 1) {
      return;
    }

    const result = onDropResolve(item, centerX, centerY);

    if (
      !result.matched ||
      !result.snapCenterX ||
      !result.snapCenterY ||
      !result.basketId
    ) {
      translateX.value = withTiming(0, {
        duration: 220,
        easing: Easing.out(Easing.cubic),
      });
      translateY.value = withTiming(0, {
        duration: 220,
        easing: Easing.out(Easing.cubic),
      });
      scale.value = withTiming(1, {
        duration: 160,
        easing: Easing.out(Easing.cubic),
      });
      return;
    }

    const targetTranslateX = result.snapCenterX - startCenterX.value;
    const targetTranslateY = result.snapCenterY - startCenterY.value;

    locked.value = 1;
    translateX.value = withTiming(targetTranslateX, {
      duration: 220,
      easing: Easing.out(Easing.cubic),
    });
    translateY.value = withTiming(targetTranslateY, {
      duration: 220,
      easing: Easing.out(Easing.cubic),
    });
    scale.value = withSequence(
      withTiming(1.04, { duration: 110, easing: Easing.out(Easing.cubic) }),
      withTiming(1, { duration: 110, easing: Easing.out(Easing.cubic) }),
    );

    onPlaced(item.id, result.basketId);
  };

  const gesture = Gesture.Pan()
    .runOnJS(true)
    .onBegin(() => {
      if (locked.value === 1) {
        return;
      }
      scale.value = withTiming(1.02, {
        duration: 120,
        easing: Easing.out(Easing.cubic),
      });
    })
    .onUpdate(event => {
      if (locked.value === 1) {
        return;
      }
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd(() => {
      if (locked.value === 1) {
        return;
      }

      const centerX = startCenterX.value + translateX.value;
      const centerY = startCenterY.value + translateY.value;
      handleDropEnd(centerX, centerY);
    })
    .onFinalize(() => {
      if (locked.value === 0) {
        scale.value = withTiming(1, {
          duration: 140,
          easing: Easing.out(Easing.cubic),
        });
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
      zIndex: locked.value === 1 ? 1 : 5,
    };
  });

  const onLayout = (_event: LayoutChangeEvent) => {
    requestAnimationFrame(measureSelf);
  };

  const hasDropTargets = basketSnapshot.length > 0;

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        accessibilityLabel={`${item.colorKey} item`}
        accessibilityRole="imagebutton"
        accessibilityState={{ disabled: !hasDropTargets }}
        onLayout={onLayout}
        ref={containerRef}
        style={[styles.container, animatedStyle]}
      >
        <Image resizeMode="contain" source={item.source} style={styles.image} />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    margin: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export const DraggableItem = memo(DraggableItemComponent);

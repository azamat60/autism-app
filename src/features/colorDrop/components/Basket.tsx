import React, { memo, useCallback, useRef } from 'react';
import { Image, LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { BasketAsset, BasketBounds } from '../types';

type BasketProps = {
  basket: BasketAsset;
  onMeasured: (bounds: BasketBounds) => void;
};

function BasketComponent({ basket, onMeasured }: BasketProps) {
  const containerRef = useRef<View | null>(null);

  const measure = useCallback(() => {
    if (!containerRef.current) {
      return;
    }

    containerRef.current.measureInWindow((x, y, width, height) => {
      onMeasured({
        id: basket.id,
        colorKey: basket.colorKey,
        x,
        y,
        width,
        height,
      });
    });
  }, [basket.colorKey, basket.id, onMeasured]);

  const onLayout = (_event: LayoutChangeEvent) => {
    requestAnimationFrame(measure);
  };

  return (
    <View
      accessibilityLabel={`${basket.colorKey} basket`}
      accessibilityRole="image"
      onLayout={onLayout}
      ref={containerRef}
      style={styles.container}
    >
      <Image resizeMode="contain" source={basket.source} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 108,
    height: 112,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export const Basket = memo(BasketComponent);

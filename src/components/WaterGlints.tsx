import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

type GlintConfig = {
  key: string;
  top: `${number}%`;
  left: `${number}%`;
  size: number;
  scaleX: number;
  minOpacity: number;
  maxOpacity: number;
  duration: number;
  delay: number;
};

const glintConfigs: GlintConfig[] = [
  {
    key: 'glint-1',
    top: '6%',
    left: '8%',
    size: 24,
    scaleX: 4.2,
    minOpacity: 0.15,
    maxOpacity: 0.57,
    duration: 1493,
    delay: 0,
  },
  {
    key: 'glint-2',
    top: '12%',
    left: '62%',
    size: 18,
    scaleX: 4.1,
    minOpacity: 0.11,
    maxOpacity: 0.53,
    duration: 1307,
    delay: 600,
  },
  {
    key: 'glint-3',
    top: '20%',
    left: '24%',
    size: 16,
    scaleX: 3.6,
    minOpacity: 0.1,
    maxOpacity: 0.45,
    duration: 1680,
    delay: 1200,
  },
  {
    key: 'glint-4',
    top: '26%',
    left: '74%',
    size: 28,
    scaleX: 4.3,
    minOpacity: 0.15,
    maxOpacity: 0.64,
    duration: 1587,
    delay: 900,
  },
  {
    key: 'glint-5',
    top: '36%',
    left: '10%',
    size: 18,
    scaleX: 3.5,
    minOpacity: 0.08,
    maxOpacity: 0.42,
    duration: 1400,
    delay: 1500,
  },
  {
    key: 'glint-6',
    top: '44%',
    left: '42%',
    size: 20,
    scaleX: 4.1,
    minOpacity: 0.13,
    maxOpacity: 0.52,
    duration: 1773,
    delay: 300,
  },
  {
    key: 'glint-7',
    top: '58%',
    left: '68%',
    size: 26,
    scaleX: 4.1,
    minOpacity: 0.17,
    maxOpacity: 0.6,
    duration: 1540,
    delay: 1800,
  },
  {
    key: 'glint-8',
    top: '68%',
    left: '18%',
    size: 22,
    scaleX: 4,
    minOpacity: 0.11,
    maxOpacity: 0.48,
    duration: 1353,
    delay: 1000,
  },
  {
    key: 'glint-9',
    top: '76%',
    left: '52%',
    size: 15,
    scaleX: 3.6,
    minOpacity: 0.1,
    maxOpacity: 0.38,
    duration: 1633,
    delay: 1400,
  },
];

function WaterGlint({ config }: { config: GlintConfig }) {
  const opacity = useRef(new Animated.Value(config.minOpacity)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(config.delay),
        Animated.timing(opacity, {
          toValue: config.maxOpacity,
          duration: Math.round(config.duration / 2),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: config.minOpacity,
          duration: Math.round(config.duration / 2),
          useNativeDriver: true,
        }),
      ]),
    );

    loop.start();

    return () => {
      loop.stop();
    };
  }, [
    config.delay,
    config.duration,
    config.maxOpacity,
    config.minOpacity,
    opacity,
  ]);

  return (
    <Animated.View
      style={[
        styles.glint,
        {
          top: config.top,
          left: config.left,
          width: config.size,
          height: config.size,
          opacity,
          transform: [{ scaleX: config.scaleX }],
        },
      ]}
    />
  );
}

export function WaterGlints() {
  return (
    <View pointerEvents="none" style={styles.layer}>
      {glintConfigs.map(config => (
        <WaterGlint config={config} key={config.key} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    height: '34%',
    overflow: 'hidden',
  },
  glint: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
});

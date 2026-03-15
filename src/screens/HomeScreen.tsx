import React, { useEffect, useRef } from 'react';
import {
  Animated,
  ImageBackground,
  ImageSourcePropType,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { WaterGlints } from '../components/WaterGlints';
import { RootStackParamList } from '../navigation/types';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const islandBackground = require('../assets/images/island_bg.jpg');
const backgroundAspectRatio = 1024 / 1948;
const cloud1 = require('../assets/images/cloud_1.png');
const cloud2 = require('../assets/images/cloud_2.png');
const cloud3 = require('../assets/images/cloud_3.png');
const cloud4 = require('../assets/images/cloud_4.png');
const palm = require('../assets/images/palm.png');
const houseBorder = require('../assets/images/house_border.png');
const boatBorder = require('../assets/images/boat_border.png');
const gardenBorder = require('../assets/images/garden_border.png');

type CloudConfig = {
  key: string;
  source: ImageSourcePropType;
  top: `${number}%`;
  width: number;
  height: number;
  direction: 'leftToRight' | 'rightToLeft';
  delay: number;
  duration: number;
};

type IntroCloudConfig = {
  key: string;
  source: ImageSourcePropType;
  top: `${number}%`;
  width: number;
  height: number;
  direction: 'leftToRight' | 'rightToLeft';
  startProgress: number;
  duration: number;
};

type PalmConfig = {
  key: string;
  left: `${number}%`;
  bottom: `${number}%`;
  width: number;
  height: number;
  imageOffsetX: number;
  imageOffsetY: number;
  startDeg: number;
  endDeg: number;
  duration: number;
};

type HouseConfig = {
  left: `${number}%`;
  bottom: `${number}%`;
  width: number;
  height: number;
  imageOffsetX: number;
  imageOffsetY: number;
  duration: number;
};

type BoatConfig = {
  left: `${number}%`;
  bottom: `${number}%`;
  width: number;
  height: number;
  imageOffsetX: number;
  imageOffsetY: number;
  swayDuration: number;
  swayStartDeg: number;
  swayEndDeg: number;
};

type GardenConfig = {
  left: `${number}%`;
  bottom: `${number}%`;
  width: number;
  height: number;
  imageOffsetX: number;
  imageOffsetY: number;
  duration: number;
};

const cloudConfigs: CloudConfig[] = [
  {
    key: 'cloud-1',
    source: cloud1,
    top: '30%',
    width: 550,
    height: 220,
    direction: 'leftToRight',
    delay: 0,
    duration: 27000,
  },
  {
    key: 'cloud-2',
    source: cloud2,
    top: '35%',
    width: 466,
    height: 220,
    direction: 'rightToLeft',
    delay: 7000,
    duration: 33000,
  },
  {
    key: 'cloud-3',
    source: cloud3,
    top: '22%',
    width: 276,
    height: 124,
    direction: 'leftToRight',
    delay: 13000,
    duration: 29250,
  },
  {
    key: 'cloud-4',
    source: cloud4,
    top: '15%',
    width: 254,
    height: 124,
    direction: 'rightToLeft',
    delay: 19000,
    duration: 28500,
  },
];

const introCloudConfigs: IntroCloudConfig[] = [
  {
    key: 'intro-cloud-1',
    source: cloud3,
    top: '18%',
    width: 276,
    height: 124,
    direction: 'leftToRight',
    startProgress: 0.18,
    duration: 9000,
  },
  {
    key: 'intro-cloud-2',
    source: cloud4,
    top: '28%',
    width: 254,
    height: 124,
    direction: 'rightToLeft',
    startProgress: 0.26,
    duration: 10500,
  },
];

const palmConfigs: PalmConfig[] = [
  {
    key: 'palm-2',
    left: '22%',
    bottom: '46%',
    width: 162,
    height: 277,
    imageOffsetX: -75,
    imageOffsetY: -188,
    startDeg: 3,
    endDeg: -4,
    duration: 2900,
  },
  {
    key: 'palm-1',
    left: '43%',
    bottom: '53%',
    width: 185,
    height: 305,
    imageOffsetX: -90,
    imageOffsetY: -201,
    startDeg: -4,
    endDeg: 5,
    duration: 3400,
  },
  {
    key: 'palm-3',
    left: '83%',
    bottom: '48%',
    width: 140,
    height: 244,
    imageOffsetX: -66,
    imageOffsetY: -164,
    startDeg: -5,
    endDeg: 4,
    duration: 3700,
  },
];

const houseConfig: HouseConfig = {
  left: '55%',
  bottom: '49%',
  width: 208,
  height: 214,
  imageOffsetX: -74,
  imageOffsetY: -136,
  duration: 1400,
};

const boatConfig: BoatConfig = {
  left: '66%',
  bottom: '18%',
  width: 336,
  height: 236,
  imageOffsetX: -174,
  imageOffsetY: -194,
  swayDuration: 2600,
  swayStartDeg: -2.8,
  swayEndDeg: 2.8,
};

const gardenConfig: GardenConfig = {
  left: '30%',
  bottom: '39%',
  width: 226,
  height: 188,
  imageOffsetX: -88,
  imageOffsetY: -98,
  duration: 1400,
};

const houseBounceSpeed = 150;
const houseBounceInterval = 900;
const boatBounceSpeedFactor = 1.08;
const boatBounceIntervalFactor = 0.92;
const gardenBounceSpeedFactor = 1.18;
const gardenBounceIntervalFactor = 1.12;

function MovingCloud({
  config,
  screenWidth,
}: {
  config: CloudConfig;
  screenWidth: number;
}) {
  const travelPadding = 32;
  const startX =
    config.direction === 'leftToRight'
      ? -config.width - travelPadding
      : screenWidth + travelPadding;
  const endX =
    config.direction === 'leftToRight'
      ? screenWidth + travelPadding
      : -config.width - travelPadding;
  const translateX = useRef(new Animated.Value(startX)).current;

  useEffect(() => {
    translateX.setValue(startX);

    const cycle = Animated.sequence([
      Animated.delay(config.delay),
      Animated.timing(translateX, {
        toValue: endX,
        duration: config.duration,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: startX,
        duration: 0,
        useNativeDriver: true,
      }),
    ]);
    const animation = Animated.loop(cycle);

    animation.start();

    return () => {
      animation.stop();
    };
  }, [config.delay, config.duration, endX, startX, translateX]);

  return (
    <Animated.Image
      accessibilityIgnoresInvertColors
      source={config.source}
      style={[
        styles.cloud,
        {
          top: config.top,
          width: config.width,
          height: config.height,
          transform: [{ translateX }],
        },
      ]}
    />
  );
}

function IntroCloud({
  config,
  screenWidth,
}: {
  config: IntroCloudConfig;
  screenWidth: number;
}) {
  const travelPadding = 32;
  const offscreenStart =
    config.direction === 'leftToRight'
      ? -config.width - travelPadding
      : screenWidth + travelPadding;
  const offscreenEnd =
    config.direction === 'leftToRight'
      ? screenWidth + travelPadding
      : -config.width - travelPadding;
  const distance = offscreenEnd - offscreenStart;
  const startX = offscreenStart + distance * config.startProgress;
  const translateX = useRef(new Animated.Value(startX)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    translateX.setValue(startX);
    opacity.setValue(1);

    const animation = Animated.parallel([
      Animated.timing(translateX, {
        toValue: offscreenEnd,
        duration: config.duration,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(Math.max(0, config.duration - 1200)),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    ]);

    animation.start();

    return () => {
      animation.stop();
    };
  }, [config.duration, offscreenEnd, opacity, startX, translateX]);

  return (
    <Animated.Image
      accessibilityIgnoresInvertColors
      source={config.source}
      style={[
        styles.cloud,
        {
          top: config.top,
          width: config.width,
          height: config.height,
          opacity,
          transform: [{ translateX }],
        },
      ]}
    />
  );
}

function SwayingPalm({ config }: { config: PalmConfig }) {
  const rotate = useRef(new Animated.Value(config.startDeg)).current;

  useEffect(() => {
    rotate.setValue(config.startDeg);

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(rotate, {
          toValue: config.endDeg,
          duration: config.duration,
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: config.startDeg,
          duration: config.duration,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [config.duration, config.endDeg, config.startDeg, rotate]);

  return (
    <View
      pointerEvents="none"
      style={[
        styles.palmAnchor,
        {
          left: config.left,
          bottom: config.bottom,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.palmSwing,
          {
            transform: [
              {
                rotate: rotate.interpolate({
                  inputRange: [-12, 12],
                  outputRange: ['-12deg', '12deg'],
                }),
              },
            ],
          },
        ]}
      >
        <Animated.Image
          accessibilityIgnoresInvertColors
          source={palm}
          style={[
            styles.palmImage,
            {
              width: config.width,
              height: config.height,
              left: config.imageOffsetX,
              top: config.imageOffsetY,
            },
          ]}
        />
      </Animated.View>
    </View>
  );
}

function BouncyHouse({ config }: { config: HouseConfig }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    progress.setValue(0);

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration: houseBounceSpeed,
          useNativeDriver: true,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: houseBounceSpeed,
          useNativeDriver: true,
        }),
        Animated.delay(houseBounceInterval),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [config.duration, progress]);

  const scaleX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.916],
  });
  const scaleY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.096],
  });

  return (
    <View
      pointerEvents="none"
      style={[
        styles.houseAnchor,
        {
          left: config.left,
          bottom: config.bottom,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.houseBounce,
          {
            transform: [{ scaleX }, { scaleY }],
          },
        ]}
      >
        <Animated.Image
          accessibilityIgnoresInvertColors
          source={houseBorder}
          style={[
            styles.houseImage,
            {
              width: config.width,
              height: config.height,
              left: config.imageOffsetX,
              top: config.imageOffsetY,
            },
          ]}
        />
      </Animated.View>
    </View>
  );
}

function BouncyBoat({ config }: { config: BoatConfig }) {
  const bounce = useRef(new Animated.Value(0)).current;
  const sway = useRef(new Animated.Value(config.swayStartDeg)).current;
  const boatBounceSpeed = Math.round(houseBounceSpeed * boatBounceSpeedFactor);
  const boatBounceInterval = Math.round(
    houseBounceInterval * boatBounceIntervalFactor,
  );

  useEffect(() => {
    bounce.setValue(0);
    sway.setValue(config.swayStartDeg);

    const bounceAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, {
          toValue: 1,
          duration: boatBounceSpeed,
          useNativeDriver: true,
        }),
        Animated.timing(bounce, {
          toValue: 0,
          duration: boatBounceSpeed,
          useNativeDriver: true,
        }),
        Animated.delay(boatBounceInterval),
      ]),
    );

    const swayAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(sway, {
          toValue: config.swayEndDeg,
          duration: config.swayDuration,
          useNativeDriver: true,
        }),
        Animated.timing(sway, {
          toValue: config.swayStartDeg,
          duration: config.swayDuration,
          useNativeDriver: true,
        }),
      ]),
    );

    bounceAnimation.start();
    swayAnimation.start();

    return () => {
      bounceAnimation.stop();
      swayAnimation.stop();
    };
  }, [
    bounce,
    boatBounceInterval,
    boatBounceSpeed,
    config.swayDuration,
    config.swayEndDeg,
    config.swayStartDeg,
    sway,
  ]);

  const scaleX = bounce.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.95],
  });
  const scaleY = bounce.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.06],
  });
  const rotate = sway.interpolate({
    inputRange: [-8, 8],
    outputRange: ['-8deg', '8deg'],
  });

  return (
    <View
      pointerEvents="none"
      style={[
        styles.boatAnchor,
        {
          left: config.left,
          bottom: config.bottom,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.boatSwing,
          {
            transform: [{ rotate }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.boatBounce,
            {
              transform: [{ scaleX }, { scaleY }],
            },
          ]}
        >
          <Animated.Image
            accessibilityIgnoresInvertColors
            source={boatBorder}
            style={[
              styles.boatImage,
              {
                width: config.width,
                height: config.height,
                left: config.imageOffsetX,
                top: config.imageOffsetY,
              },
            ]}
          />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

function BouncyGarden({ config }: { config: GardenConfig }) {
  const progress = useRef(new Animated.Value(0)).current;
  const gardenBounceSpeed = Math.round(
    houseBounceSpeed * gardenBounceSpeedFactor,
  );
  const gardenBounceInterval = Math.round(
    houseBounceInterval * gardenBounceIntervalFactor,
  );

  useEffect(() => {
    progress.setValue(0);

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration: gardenBounceSpeed,
          useNativeDriver: true,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: gardenBounceSpeed,
          useNativeDriver: true,
        }),
        Animated.delay(gardenBounceInterval),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [config.duration, gardenBounceInterval, gardenBounceSpeed, progress]);

  const scaleX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.916],
  });
  const scaleY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.096],
  });

  return (
    <View
      pointerEvents="none"
      style={[
        styles.gardenAnchor,
        {
          left: config.left,
          bottom: config.bottom,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.gardenBounce,
          {
            transform: [{ scaleX }, { scaleY }],
          },
        ]}
      >
        <Animated.Image
          accessibilityIgnoresInvertColors
          source={gardenBorder}
          style={[
            styles.gardenImage,
            {
              width: config.width,
              height: config.height,
              left: config.imageOffsetX,
              top: config.imageOffsetY,
            },
          ]}
        />
      </Animated.View>
    </View>
  );
}

export function HomeScreen({ navigation }: HomeScreenProps) {
  console.log(navigation);
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const screenAspectRatio = screenWidth / screenHeight;
  const backgroundFrame =
    screenAspectRatio > backgroundAspectRatio
      ? {
          width: screenWidth,
          height: screenWidth / backgroundAspectRatio,
          left: 0,
          top: (screenHeight - screenWidth / backgroundAspectRatio) / 2,
        }
      : {
          width: screenHeight * backgroundAspectRatio,
          height: screenHeight,
          left: (screenWidth - screenHeight * backgroundAspectRatio) / 2,
          top: 0,
        };

  return (
    <View style={styles.screen}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <ImageBackground
        accessibilityIgnoresInvertColors
        resizeMode="cover"
        source={islandBackground}
        style={styles.background}
      >
        <View pointerEvents="none" style={styles.cloudLayer}>
          {introCloudConfigs.map(config => (
            <IntroCloud
              config={config}
              key={config.key}
              screenWidth={screenWidth}
            />
          ))}

          {cloudConfigs.map(config => (
            <MovingCloud
              config={config}
              key={config.key}
              screenWidth={screenWidth}
            />
          ))}
        </View>

        <View
          pointerEvents="none"
          style={[
            styles.palmLayer,
            {
              width: backgroundFrame.width,
              height: backgroundFrame.height,
              left: backgroundFrame.left,
              top: backgroundFrame.top,
            },
          ]}
        >
          {palmConfigs.map(config => (
            <SwayingPalm config={config} key={config.key} />
          ))}

          <BouncyHouse config={houseConfig} />
          <BouncyGarden config={gardenConfig} />
          <BouncyBoat config={boatConfig} />
        </View>

        <WaterGlints />

        <View style={styles.overlay}>
          <View style={styles.hero}>
            <Text style={styles.title}>Calm Learning</Text>
            <Text style={styles.subtitle}>Tap to start</Text>
          </View>

          {/*
          Previous home screen kept here temporarily for reference:

          <ScreenContainer>
            <Text accessibilityRole="header" style={styles.oldTitle}>
              Choose an Activity
            </Text>
            <Text style={styles.oldSubtitle}>Tap one activity to begin.</Text>

            <View style={styles.oldGrid}>
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
          */}
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0E4D67',
  },
  background: {
    flex: 1,
  },
  cloudLayer: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    height: '40%',
    overflow: 'hidden',
  },
  cloud: {
    position: 'absolute',
    left: 0,
    resizeMode: 'contain',
    opacity: 0.95,
  },
  palmLayer: {
    position: 'absolute',
    overflow: 'hidden',
    zIndex: 2,
  },
  palmAnchor: {
    position: 'absolute',
    width: 1,
    height: 1,
  },
  palmSwing: {
    position: 'absolute',
    width: 1,
    height: 1,
  },
  palmImage: {
    position: 'absolute',
    resizeMode: 'contain',
  },
  houseAnchor: {
    position: 'absolute',
    width: 1,
    height: 1,
  },
  houseBounce: {
    position: 'absolute',
    width: 1,
    height: 1,
  },
  houseImage: {
    position: 'absolute',
    resizeMode: 'contain',
  },
  boatAnchor: {
    position: 'absolute',
    width: 1,
    height: 1,
  },
  boatSwing: {
    position: 'absolute',
    width: 1,
    height: 1,
  },
  boatBounce: {
    position: 'absolute',
    width: 1,
    height: 1,
  },
  boatImage: {
    position: 'absolute',
    resizeMode: 'contain',
  },
  gardenAnchor: {
    position: 'absolute',
    width: 1,
    height: 1,
  },
  gardenBounce: {
    position: 'absolute',
    width: 1,
    height: 1,
  },
  gardenImage: {
    position: 'absolute',
    resizeMode: 'contain',
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 96,
    paddingBottom: 48,
    backgroundColor: 'rgba(8, 27, 39, 0.08)',
  },
  hero: {
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    lineHeight: 42,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.4,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.92)',
  },
  primaryButton: {
    alignSelf: 'center',
    minWidth: 180,
    minHeight: 64,
    paddingHorizontal: 28,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  primaryButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  primaryButtonText: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '800',
    color: '#1A5268',
  },
});

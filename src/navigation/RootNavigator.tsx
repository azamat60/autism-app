import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { ColorDropScreen } from '../screens/ColorDropScreen';
import { MatchColorsScreen } from '../screens/MatchColorsScreen';
import { SortShapesScreen } from '../screens/SortShapesScreen';
import { FindEmotionScreen } from '../screens/FindEmotionScreen';
import { TapReactScreen } from '../screens/TapReactScreen';
import { RootStackParamList } from './types';
import { theme } from '../theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        animation: 'simple_push',
        headerShadowVisible: false,
        headerTitleStyle: {
          color: theme.colors.textPrimary,
          fontSize: theme.typography.body,
          fontWeight: '700',
        },
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen
        component={HomeScreen}
        name="Home"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        component={ColorDropScreen}
        name="ColorDrop"
        options={{ title: 'Color Drop' }}
      />
      <Stack.Screen
        component={MatchColorsScreen}
        name="MatchColors"
        options={{ title: 'Match the Colors' }}
      />
      <Stack.Screen
        component={SortShapesScreen}
        name="SortShapes"
        options={{ title: 'Sort the Shapes' }}
      />
      <Stack.Screen
        component={FindEmotionScreen}
        name="FindEmotion"
        options={{ title: 'Find the Emotion' }}
      />
      <Stack.Screen
        component={TapReactScreen}
        name="TapReact"
        options={{ title: 'Tap & React' }}
      />
    </Stack.Navigator>
  );
}

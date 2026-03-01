import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../components/ScreenContainer';
import { FindEmotionGame } from '../features/findEmotion/FindEmotionGame';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'FindEmotion'>;

export function FindEmotionScreen({ navigation }: Props) {
  return (
    <ScreenContainer>
      <FindEmotionGame onDone={() => navigation.navigate('Home')} />
    </ScreenContainer>
  );
}

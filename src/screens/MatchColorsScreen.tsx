import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../components/ScreenContainer';
import { MatchColorsGame } from '../features/matchColors/MatchColorsGame';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'MatchColors'>;

export function MatchColorsScreen({ navigation }: Props) {
  return (
    <ScreenContainer>
      <MatchColorsGame onDone={() => navigation.navigate('Home')} />
    </ScreenContainer>
  );
}

import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../components/ScreenContainer';
import { SortShapesGame } from '../features/sortShapes/SortShapesGame';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'SortShapes'>;

export function SortShapesScreen({ navigation }: Props) {
  return (
    <ScreenContainer>
      <SortShapesGame onDone={() => navigation.navigate('Home')} />
    </ScreenContainer>
  );
}

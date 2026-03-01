import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../components/ScreenContainer';
import { TapReactGame } from '../features/tapReact/TapReactGame';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'TapReact'>;

export function TapReactScreen({ navigation }: Props) {
  return (
    <ScreenContainer>
      <TapReactGame onDone={() => navigation.navigate('Home')} />
    </ScreenContainer>
  );
}
